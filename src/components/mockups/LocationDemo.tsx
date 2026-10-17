/**
 * "Results that start where you are": the WA211 location redesign, as a
 * self-playing phone demo (ported from the Framer component on the original
 * case study).
 *   1. Location in one tap        (Use my location → Allow → location chip)
 *   2. Change it anytime          (tap the chip → type “Spokane” → Confirm)
 *   3. Clear about what’s showing (Don’t Allow → Cancel → “Location is off”)
 */
import type { CSSProperties, ReactNode } from 'react';
import PhoneDemo, { typing, type DemoState, type Scene, type ScreensProps } from './PhoneDemo';
import { SearchHeader, TopBar } from './SearchDemo';
import { BLUE, EASE_BACK, EASE_OUT, INK, Icon, LoadingSwap, S } from './shared';

const SEATTLE = 'Seattle, Washington, 98101';
const SPOKANE = 'Spokane, Washington, United States';
const HOUSING = 'I need help finding housing';

const STEPS = [
	{
		title: 'Location in one tap',
		body: 'Location used to live in a separate, optional field, so most searches the whole state. Now “Use my location” fills it in with one tap, and results narrow to what’s nearby.',
	},
	{
		title: 'Change it anytime',
		body: 'The location shows as a chip people can tap to change or clear, so they’re never stuck searching the wrong area.',
	},
	{
		title: 'Clear about what’s showing',
		body: 'If people turn location off, they can type a city instead or keep browsing. Either way, the page says which area the results cover.',
	},
];

const START: DemoState = {
	screen: 'start',
	query: '',
	focus: false,
	cursor: 'start',
	cursorVisible: false,
	pressed: false,
	marker: null,
	loading: false,
	prompt: false,
	locSet: false,
	locOff: false,
	city: SEATTLE,
	panel: null,
	input: '',
	inputFocus: false,
};

const SCENES: Scene[] = [
	{
		init: { ...START },
		script: [
			[250, { cursorVisible: true }],
			[600, { cursor: 'useLocation' }],
			[1100, { pressed: true }],
			[1250, { pressed: false, prompt: true }],
			[2000, { cursor: 'allowBtn' }],
			[2450, { pressed: true }],
			[2600, { pressed: false, prompt: false, locSet: true }],
			[2900, { marker: 'startChip' }],
			[3500, { cursor: 'suggestHousing' }],
			[4000, { pressed: true }],
			[4150, { pressed: false, screen: 'near', query: HOUSING, loading: true, marker: null, cursorVisible: false }],
			[5050, { loading: false }],
		],
		duration: 6200,
	},
	{
		init: { ...START, screen: 'near', query: HOUSING, locSet: true, city: SEATTLE, cursor: 'start' },
		script: [
			[300, { cursorVisible: true }],
			[600, { cursor: 'chip' }],
			[1100, { pressed: true }],
			[1250, { pressed: false, panel: 'change', input: SEATTLE }],
			[1750, { cursor: 'panelField' }],
			[2200, { pressed: true }],
			[2350, { pressed: false, inputFocus: true, input: '' }],
			...typing(2500, 'Spokane', 80, 0, 'input'),
			[3150, { input: SPOKANE }],
			[3500, { cursor: 'confirmBtn' }],
			[3950, { pressed: true }],
			[4100, { pressed: false, panel: null, inputFocus: false, city: SPOKANE, loading: true, cursorVisible: false }],
			[5000, { loading: false }],
			[5400, { marker: 'chip' }],
		],
		duration: 6900,
	},
	{
		init: { ...START, screen: 'off', query: HOUSING, cursor: 'start' },
		script: [
			[300, { cursorVisible: true }],
			[600, { cursor: 'useLocation' }],
			[1100, { pressed: true }],
			[1250, { pressed: false, prompt: true }],
			[2000, { cursor: 'denyBtn' }],
			[2450, { pressed: true }],
			[2600, { pressed: false, prompt: false, panel: 'off', input: '' }],
			[3500, { cursor: 'cancelBtn' }],
			[3950, { pressed: true }],
			[4100, { pressed: false, panel: null, locOff: true, cursorVisible: false }],
			[4500, { marker: 'offMsg' }],
		],
		duration: 6600,
	},
];

/** Print / Share buttons and the result count. */
function ResultsBar({ count, loading }: { count: string; loading: boolean }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
			<span style={{ display: 'flex', gap: 8 }}>
				{(
					[
						[Icon.print, 'Print'],
						[Icon.share, 'Share'],
					] as const
				).map(([icon, label]) => (
					<span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #CCC', borderRadius: 4, padding: '5px 9px', fontSize: 16, color: '#333' }}>
						{icon}
						{label}
					</span>
				))}
			</span>
			<span style={{ fontSize: 16, color: '#333', opacity: loading ? 0 : 1, transition: 'opacity 200ms ease' }}>{count}</span>
		</div>
	);
}

/** Smoothly opens and closes its children. */
function Collapse({ open, reduceMotion, children }: { open: boolean; reduceMotion: boolean; children: ReactNode }) {
	return (
		<div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: reduceMotion ? 'none' : `grid-template-rows 420ms ${EASE_OUT}` }}>
			<div
				style={{
					minHeight: 0,
					overflow: 'hidden',
					padding: '3px 3px 6px',
					margin: '-3px -3px -6px',
					opacity: open ? 1 : 0,
					transition: reduceMotion ? 'none' : 'opacity 240ms ease',
				}}
			>
				{children}
			</div>
		</div>
	);
}

/** The location chip: pin, city, ×. */
function LocationChip({ t, city, highlight, reduceMotion }: { t: string; city: string; highlight: boolean; reduceMotion: boolean }) {
	return (
		<div
			data-t={t}
			style={{
				display: 'flex',
				width: 'fit-content',
				alignItems: 'center',
				gap: 8,
				marginTop: 16,
				padding: '6px 8px',
				borderRadius: 4,
				background: '#E3EDFA',
				boxShadow: highlight ? 'inset 0 0 0 2px rgba(59,130,246,0.45)' : 'none',
				transition: reduceMotion ? 'none' : 'box-shadow 300ms ease',
				color: BLUE,
				fontSize: 16,
			}}
		>
			{Icon.pin}
			{city}
			{Icon.close}
		</div>
	);
}

/** "Change location" / "Location is off" panel with a city field. */
function LocationPanel({ kind, input, focus }: { kind: 'change' | 'off'; input: string; focus: boolean }) {
	return (
		<div style={{ marginTop: 16, background: '#F5F4F2', borderRadius: 4, padding: '12px 8px' }}>
			<p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 6px', fontSize: 18, fontWeight: 600, color: '#333' }}>
				{kind === 'off' ? Icon.pinOff(20) : Icon.pinDark}
				{kind === 'off' ? 'Location is off' : 'Change location'}
			</p>
			<p style={{ margin: '0 0 14px', fontSize: 14, color: '#555' }}>Enter a location to find resources near you.</p>
			<p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#333' }}>City or ZIP code</p>
			<div
				data-t="panelField"
				style={{
					display: 'flex',
					alignItems: 'center',
					height: 44,
					padding: '0 12px',
					background: '#fff',
					border: `${focus ? 2 : 1.5}px solid ${BLUE}`,
					borderRadius: 4,
					fontSize: 16,
					color: input ? INK : '#8A8A8A',
					boxSizing: 'border-box',
				}}
			>
				{focus && !input && <span className="sed-caret" style={{ width: 1.5, height: 20, background: INK, marginRight: 1 }} />}
				{input || 'City or ZIP code'}
				{focus && input && <span className="sed-caret" style={{ width: 1.5, height: 20, background: INK, marginLeft: 1 }} />}
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 24, marginTop: 16 }}>
				<span data-t="cancelBtn" style={{ fontSize: 16, color: BLUE }}>
					Cancel
				</span>
				<span data-t="confirmBtn" style={{ display: 'grid', placeItems: 'center', height: 44, borderRadius: 4, background: BLUE, color: '#fff', fontSize: 16 }}>
					Confirm
				</span>
			</div>
		</div>
	);
}

/** The browser's "would like to use your current location" prompt. */
function LocationPrompt({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
	const button: CSSProperties = {
		display: 'grid',
		placeItems: 'center',
		height: 44,
		borderRadius: 22,
		background: '#DCE8FB',
		fontSize: 16,
		fontWeight: 600,
		color: '#1A2A44',
	};
	return (
		<>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', opacity: open ? 1 : 0, transition: reduceMotion ? 'none' : 'opacity 220ms ease' }} />
			<div
				style={{
					position: 'absolute',
					left: 30,
					right: 30,
					top: 250,
					background: '#fff',
					borderRadius: 26,
					padding: '24px 22px 22px',
					boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
					opacity: open ? 1 : 0,
					transform: open ? 'scale(1)' : 'scale(0.92)',
					transition: reduceMotion ? 'none' : `opacity 200ms ease, transform 320ms ${EASE_BACK}`,
				}}
			>
				<p style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 600, lineHeight: 1.3, color: '#222' }}>
					“search.wa211.org” would like to use your current location.
				</p>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
					<span data-t="denyBtn" style={button}>
						Don’t Allow
					</span>
					<span data-t="allowBtn" style={button}>
						Allow
					</span>
				</div>
			</div>
		</>
	);
}

type Secondary = 'Website' | 'Directions' | 'Email';

function ResourceCard({
	title,
	tags,
	description,
	whatsHere,
	phone = '',
	hours = '',
	secondary = null,
}: {
	title: string;
	tags: string[];
	description: string;
	whatsHere: string[];
	phone?: string;
	hours?: string;
	secondary?: Secondary[] | null;
}) {
	const extra: Secondary[] = secondary ?? (phone ? ['Website', 'Directions'] : []);
	const icons = { Website: Icon.link, Directions: Icon.map, Email: Icon.mail };
	return (
		<div style={{ background: '#fff', border: '1px solid #D0D0D0', borderRadius: 8, padding: '16px 12px 12px' }}>
			<p style={{ margin: '0 0 12px', fontSize: 20, lineHeight: 1.2, color: '#000', textDecoration: 'underline', textUnderlineOffset: 3 }}>{title}</p>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
				{tags.map((tag) => (
					<span key={tag} style={{ ...S.chip, color: BLUE, background: '#E8F0FB', border: '1px solid #B9CDEB' }}>
						{tag}
					</span>
				))}
			</div>
			{hours && (
				<div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '12px 0 4px', fontSize: 15, color: '#333' }}>
					{Icon.clock}
					{hours}
				</div>
			)}
			<p style={{ margin: '8px 0 16px', fontSize: 15, lineHeight: 1.3, color: '#333' }}>{description}</p>
			<p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: '#333' }}>What’s Here</p>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, marginBottom: 14 }}>
				{whatsHere.map((item) => (
					<span key={item} style={{ ...S.chip, color: '#333', background: '#F2F2F2', border: '1px solid #D0D0D0' }}>
						{item}
					</span>
				))}
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, borderRadius: 4, background: BLUE, color: '#fff', fontSize: 16 }}>
				{phone ? Icon.phone : Icon.linkWhite}
				{phone || 'Website'}
			</div>
			{extra.length > 0 && (
				<div style={{ display: 'grid', gridTemplateColumns: `repeat(${extra.length}, 1fr)`, gap: 8, marginTop: 8 }}>
					{extra.map((label) => (
						<div
							key={label}
							style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 4, background: '#F5F5F5', border: '1px solid #D0D0D0', fontSize: 15, color: '#333' }}
						>
							{icons[label]}
							{label}
						</div>
					))}
				</div>
			)}
			<p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 15, color: BLUE }}>See more</p>
		</div>
	);
}

function Screens({ state, reduceMotion }: ScreensProps) {
	const screen = (name: string): CSSProperties => {
		const on = state.screen === name;
		return {
			position: 'absolute',
			inset: 0,
			background: '#fff',
			opacity: on ? 1 : 0,
			transform: on ? 'translateY(0)' : 'translateY(10px)',
			transition: reduceMotion ? 'none' : `opacity 260ms ease, transform 420ms ${EASE_OUT}`,
			pointerEvents: 'none',
		};
	};
	const is = (name: string) => state.screen === name;
	const city = state.city as string;
	const panel = state.panel as string | null;

	return (
		<>
			<div data-screen="start" style={screen('start')}>
				<TopBar />
				<SearchHeader t="startField" query="" focus={false} showButton />
				<div style={S.pad}>
					<Collapse open={!(is('start') && state.locSet)} reduceMotion={reduceMotion}>
						<div data-t="useLocation" style={{ ...S.link, marginTop: 16, display: 'inline-flex' }}>
							{Icon.pin}
							Use my location
						</div>
					</Collapse>
					<Collapse open={is('start') && Boolean(state.locSet)} reduceMotion={reduceMotion}>
						<LocationChip t="startChip" city={SEATTLE} highlight={state.marker === 'startChip'} reduceMotion={reduceMotion} />
					</Collapse>
					<p style={S.h}>Suggestions</p>
					<div data-t="suggestHousing" style={{ ...S.link, display: 'inline-flex' }}>
						{Icon.search(18)}
						{HOUSING}
					</div>
					<p style={S.h}>Topics</p>
					<div style={{ ...S.link, marginBottom: 14 }}>
						{Icon.search(18)}Transitional Housing
					</div>
					<div style={S.link}>
						{Icon.search(18)}Permanent Housing
					</div>
					<p style={S.h}>Taxonomies</p>
					<div style={{ ...S.link, marginBottom: 14, alignItems: 'flex-start' }}>
						{Icon.search(18)}
						<span>Post Pregnancy Shelter/Transitional Housing</span>
					</div>
					<div style={S.link}>
						{Icon.search(18)}Transitional Housing/Shelter
					</div>
				</div>
				<div style={{ background: '#F5F4F2', marginTop: 20, padding: '0 16px', height: 400 }}>
					<div style={{ ...S.block, marginTop: 0 }} />
				</div>
				<LocationPrompt open={is('start') && Boolean(state.prompt)} reduceMotion={reduceMotion} />
			</div>

			<div data-screen="near" style={screen('near')}>
				<TopBar />
				<SearchHeader t="nearField" query={HOUSING} focus={false} />
				<div style={S.pad}>
					<Collapse open={panel !== 'change'} reduceMotion={reduceMotion}>
						<LocationChip t="chip" city={city} highlight={is('near') && state.marker === 'chip'} reduceMotion={reduceMotion} />
					</Collapse>
					<Collapse open={is('near') && panel === 'change'} reduceMotion={reduceMotion}>
						<LocationPanel kind="change" input={state.input as string} focus={Boolean(state.inputFocus)} />
					</Collapse>
					<div style={{ ...S.link, marginTop: 14 }}>
						{Icon.chevronDown}
						Filter and sort
					</div>
					<ResultsBar count={city === SPOKANE ? '1-30 of 30' : '1-79 of 79'} loading={is('near') && state.loading} />
				</div>
				<div style={{ background: '#F5F4F2', padding: '24px 16px', height: 560 }}>
					<LoadingSwap loading={is('near') && state.loading} reduceMotion={reduceMotion}>
						{city === SPOKANE ? (
							<ResourceCard
								title="Subsidized Housing offered at Goodale and Barbieri Company"
								tags={['Low-Income']}
								hours="24 hours daily"
								description="Provides a list of available subsidized housing units. May need to contact individual managers to be added to a wait list for available units."
								whatsHere={['Low Income/Subsidized Private Rental Housing']}
								phone="(509) 459-6102"
							/>
						) : (
							<ResourceCard
								title="Multifamily Affordable Rental Housing Division offered by U.S. Department of Housing and Urban Development"
								tags={['Free', 'Low-Income Households', 'Disability Friendly']}
								hours="24 hours daily"
								description="Provides subsidies to public and private rental providers for the purpose of offering low-income housing, and provides regional lists of these HUD-subsidized properties. Call or check website for lists."
								whatsHere={['Home Rental Listings']}
								secondary={['Email', 'Directions']}
							/>
						)}
					</LoadingSwap>
				</div>
			</div>

			<div data-screen="off" style={screen('off')}>
				<TopBar />
				<SearchHeader t="offField" query={HOUSING} focus={false} />
				<div style={S.pad}>
					<Collapse open={!state.locOff && panel !== 'off'} reduceMotion={reduceMotion}>
						<div data-t="useLocation" style={{ ...S.link, marginTop: 16, display: 'inline-flex' }}>
							{Icon.pin}
							Use my location
						</div>
						<p style={{ margin: '6px 0 0', fontSize: 14, color: '#555' }}>Showing results across Washington</p>
					</Collapse>
					<Collapse open={is('off') && panel === 'off'} reduceMotion={reduceMotion}>
						<LocationPanel kind="off" input={state.input as string} focus={Boolean(state.inputFocus)} />
					</Collapse>
					<Collapse open={is('off') && Boolean(state.locOff)} reduceMotion={reduceMotion}>
						<p data-t="offMsg" style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 6, margin: '16px 0 0', fontSize: 14, lineHeight: 1.35, color: '#444' }}>
							{Icon.pinOff(16, '#444', { flex: '0 0 auto', marginTop: 1 })}
							Location is off. Results cover all of Washington.
						</p>
					</Collapse>
					<div style={{ ...S.link, marginTop: 14 }}>
						{Icon.chevronDown}
						Filter and sort
					</div>
					<ResultsBar count="1-100 of 383" loading={false} />
				</div>
				<div style={{ background: '#F5F4F2', padding: '24px 16px', height: 560 }}>
					<ResourceCard
						title="Online Housing Search offered by King County Housing Authority"
						tags={['No restrictions', 'Free']}
						hours="24 hours daily"
						description="Provides searchable, real time, detailed listings of available low and market-rate housing, including senior housing options in King County."
						whatsHere={['Home Rental Listings', 'Housing Search Assistance']}
					/>
				</div>
				<LocationPrompt open={is('off') && Boolean(state.prompt)} reduceMotion={reduceMotion} />
			</div>
		</>
	);
}

export default function LocationDemo() {
	return (
		<PhoneDemo
			title="Results that start where you are"
			steps={STEPS}
			scenes={SCENES}
			Screens={Screens}
			beforeImages={[
				'/work/washington-211/before/location-1.png',
				'/work/washington-211/before/location-2.png',
				'/work/washington-211/before/location-3.png',
			]}
			beforeAlt="Washington 211's current site."
			anchors={{ start: { x: 300, y: 620 } }}
			stepBodyLineHeight={1.65}
		/>
	);
}
