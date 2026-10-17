/**
 * "Every search leads somewhere": the WA211 search redesign, as a self-playing
 * phone demo (ported from the Framer component on the original case study).
 *   1. One tap to start searching   (home → search screen)
 *   2. Typos still find help        ("shlter fre" → results for “shelter fire”)
 *   3. An alternative search before calling (no results → search “housing”)
 */
import type { CSSProperties } from 'react';
import PhoneDemo, { typing, type DemoState, type Scene, type ScreensProps } from './PhoneDemo';
import { BLUE, EASE_OUT, INK, Icon, LoadingSwap, S } from './shared';

const NO_RESULTS_ART = '/work/washington-211/undraw-searching.svg';

const STEPS = [
	{
		title: 'One tap to start searching',
		body: 'Reaching search used to take three steps and a jump to a separate site. Now the search bar sits on the homepage and in the navigation, so people can type what they need the moment they arrive.',
	},
	{
		title: 'Typos still find help',
		body: 'Search only worked with exact words. Now it recognizes misspellings and close matches, so “shlter fre” still finds “shelter fire.”',
	},
	{
		title: 'An alternative search before calling',
		body: 'Washington 211’s no-results page only offered a phone number, which sent people to call centers that were already overwhelmed. Now it also suggests a broader search, so people can keep looking on their own and still call if they need to.',
	},
];

const START: DemoState = {
	screen: 'home',
	query: '',
	focus: false,
	cursor: 'start',
	cursorVisible: false,
	pressed: false,
	marker: null,
	loading: false,
};

const SCENES: Scene[] = [
	{
		init: { ...START },
		script: [
			[250, { cursorVisible: true }],
			[600, { cursor: 'homeField' }],
			[1100, { pressed: true }],
			[1250, { pressed: false, screen: 'suggest', focus: true, cursorVisible: false }],
			[1750, { marker: 'suggestField' }],
		],
		duration: 3200,
	},
	{
		init: { ...START, screen: 'suggest', focus: true, cursor: 'suggestField' },
		script: [
			...typing(250, 'shlter fre', 80),
			[1050, { cursorVisible: true }],
			[1450, { cursor: 'searchBtn' }],
			[1900, { pressed: true }],
			[2050, { pressed: false }],
			[2150, { screen: 'results', focus: false, cursorVisible: false, loading: true }],
			[3050, { loading: false }],
			[3450, { marker: 'corrected' }],
		],
		duration: 5800,
	},
	{
		init: { ...START, screen: 'results', query: 'shlter fre', cursor: 'start', cursorVisible: true },
		script: [
			[300, { cursor: 'resultsField' }],
			[750, { pressed: true }],
			[900, { pressed: false, focus: true, query: '' }],
			...typing(1050, 'shelter housing for seniors', 50),
			[2650, { screen: 'empty', focus: false, loading: true }],
			[3550, { loading: false }],
			[4000, { marker: 'instead' }],
			[4600, { cursor: 'insteadLink' }],
			[5050, { pressed: true }],
			[5200, { pressed: false }],
			[5300, { screen: 'housing', query: 'housing', cursorVisible: false, marker: null, loading: true }],
			[6200, { loading: false }],
		],
		duration: 8600,
	},
];

/** Washington 211 header bar: logo block, Menu, search button. */
function TopBar() {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
			<div style={{ width: 40, height: 22, borderRadius: 5, background: '#D9D9D9' }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: '#333' }}>
				{Icon.chevronDown}
				Menu
				<div
					data-t="navSearch"
					style={{ width: 24, height: 24, borderRadius: 4, background: BLUE, display: 'grid', placeItems: 'center', marginLeft: 6 }}
				>
					{Icon.search(15, '#fff')}
				</div>
			</div>
		</div>
	);
}

function SearchField({ t, query, focus, placeholder = 'Search for assistance' }: { t: string; query: string; focus: boolean; placeholder?: string }) {
	return (
		<div
			data-t={t}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				height: 46,
				padding: '0 12px',
				border: `1px solid ${focus ? BLUE : '#333'}`,
				boxShadow: focus ? '0 0 0 3px rgba(29,79,159,0.15)' : 'none',
				borderRadius: 8,
				fontSize: 16,
				transition: 'box-shadow 200ms ease, border-color 200ms ease',
			}}
		>
			{Icon.search(22)}
			<span style={{ color: query ? INK : '#555', whiteSpace: 'nowrap', overflow: 'hidden' }}>{query || (focus ? '' : placeholder)}</span>
			{focus && <span className="sed-caret" style={{ width: 1.5, height: 20, background: INK, marginLeft: -10 }} />}
		</div>
	);
}

function SearchHeader({ t, query, focus, showButton = false }: { t: string; query: string; focus: boolean; showButton?: boolean }) {
	return (
		<div style={S.pad}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '28px 0 16px' }}>
				<span style={{ ...S.link, gap: 6 }}>
					{Icon.chevronLeft}
					Back
				</span>
				{showButton && (
					<span data-t="searchBtn" style={{ background: BLUE, color: '#fff', fontSize: 16, padding: '3px 9px', borderRadius: 4 }}>
						Search
					</span>
				)}
			</div>
			<p style={{ margin: '0 0 14px', fontSize: 15, color: '#333', lineHeight: 1.3 }}>Search for resources at our partner, Washington 211</p>
			<SearchField t={t} query={query} focus={focus} />
		</div>
	);
}

function ResultsMeta({ count, loading = false }: { count: string; loading?: boolean }) {
	return (
		<div style={S.pad}>
			<div style={{ ...S.link, marginTop: 16 }}>
				{Icon.pin}
				Use my location
			</div>
			<div style={{ ...S.link, marginTop: 16 }}>
				{Icon.chevronDown}
				Filter and sort
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
				<span style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #CCC', borderRadius: 4, padding: '5px 9px', fontSize: 16, color: '#333' }}>
					{Icon.share}
					Share
				</span>
				<span style={{ fontSize: 16, color: '#333', opacity: loading ? 0 : 1, transition: 'opacity 200ms ease' }}>{count}</span>
			</div>
		</div>
	);
}

function ResourceCard({ title, tags, description, whatsHere, phone }: { title: string; tags: string[]; description: string; whatsHere: string[]; phone: string }) {
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
				{Icon.phone}
				{phone}
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
				{(
					[
						[Icon.link, 'Website'],
						[Icon.map, 'Directions'],
					] as const
				).map(([icon, label]) => (
					<div
						key={label}
						style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 4, background: '#F5F5F5', border: '1px solid #D0D0D0', fontSize: 15, color: '#333' }}
					>
						{icon}
						{label}
					</div>
				))}
			</div>
			<p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 15, color: BLUE }}>See more</p>
		</div>
	);
}

function Screens({ state, reduceMotion }: ScreensProps) {
	// Each screen fades/slides in when it's the current one.
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
	// Suggestion rows stagger in.
	const row = (i: number, on: boolean): CSSProperties => ({
		opacity: on ? 1 : 0,
		transform: on ? 'none' : 'translateY(6px)',
		transition: reduceMotion ? 'none' : `opacity 240ms ease ${120 + i * 60}ms, transform 420ms ${EASE_OUT} ${120 + i * 60}ms`,
	});
	const suggesting = state.screen === 'suggest';
	const corrected = state.screen === 'results' && state.marker === 'corrected';
	const loading = (name: string) => state.screen === name && state.loading;

	return (
		<>
			<div data-screen="home" style={screen('home')}>
				<TopBar />
				<div style={S.pad}>
					<h3 style={{ color: BLUE, fontSize: 34, lineHeight: 1, fontWeight: 600, margin: '28px 0 12px', letterSpacing: '-0.5px' }}>
						From Hello to Help, WA 211 has you covered.
					</h3>
					<p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.3, color: '#333' }}>
						WA 211 is the only statewide helpline with knowledgeable people on the phone and 17,000 local resources in our statewide
						resource directory, 211 Connects.
					</p>
					<SearchField t="homeField" query={state.screen === 'home' ? state.query : ''} focus={state.screen === 'home' && state.focus} />
					<div style={{ ...S.link, marginTop: 18 }}>
						{Icon.pin}
						Use my location
					</div>
				</div>
				<div style={{ background: '#F5F4F2', marginTop: 20, padding: '24px 16px', height: 560 }}>
					<div style={S.skeleton} />
					<div style={S.skeleton} />
					<div style={{ ...S.skeleton, width: '72%' }} />
					<div style={S.block} />
				</div>
			</div>

			<div data-screen="suggest" style={screen('suggest')}>
				<TopBar />
				<SearchHeader
					t="suggestField"
					query={suggesting || state.screen === 'results' ? state.query : ''}
					focus={suggesting && state.focus}
					showButton
				/>
				<div style={S.pad}>
					<div style={{ ...S.link, marginTop: 16, ...row(0, suggesting) }}>
						{Icon.pin}
						Use my location
					</div>
					<div style={row(1, suggesting)}>
						<p data-t="suggestions" style={{ ...S.h, display: 'inline-block' }}>
							Suggestions
						</p>
						<div style={S.link}>
							{Icon.search(18)}I need help finding housing
						</div>
					</div>
					<div style={row(2, suggesting)}>
						<p style={S.h}>Topics</p>
						<div style={{ ...S.link, marginBottom: 14 }}>
							{Icon.search(18)}Transitional Housing
						</div>
						<div style={S.link}>
							{Icon.search(18)}Permanent Housing
						</div>
					</div>
					<div style={row(3, suggesting)}>
						<p style={S.h}>Taxonomies</p>
						<div style={{ ...S.link, marginBottom: 14, alignItems: 'flex-start' }}>
							{Icon.search(18)}
							<span>Post Pregnancy Shelter/Transitional Housing</span>
						</div>
						<div style={S.link}>
							{Icon.search(18)}Transitional Housing/Shelter
						</div>
					</div>
				</div>
				<div style={{ background: '#F5F4F2', marginTop: 20, padding: '0 16px', height: 400 }}>
					<div style={{ ...S.block, marginTop: 0 }} />
					<div style={S.block} />
				</div>
			</div>

			<div data-screen="results" style={screen('results')}>
				<TopBar />
				<SearchHeader
					t="resultsField"
					query={state.screen === 'results' ? state.query : state.screen === 'empty' ? 'shelter housing for seniors' : 'shlter fre'}
					focus={state.screen === 'results' && state.focus}
				/>
				<div style={S.pad}>
					<p style={{ margin: '14px 0 0', fontSize: 16, color: '#333' }}>
						These are the results for{' '}
						<span
							data-t="corrected"
							style={{
								color: BLUE,
								fontWeight: 600,
								borderRadius: 4,
								padding: '1px 3px',
								background: corrected ? 'rgba(59,130,246,0.14)' : 'transparent',
								transition: reduceMotion ? 'none' : 'background 300ms ease',
							}}
						>
							“shelter fire”
						</span>
					</p>
				</div>
				<ResultsMeta count="1-20 of 20" loading={loading('results')} />
				<div style={{ background: '#F5F4F2', padding: '24px 16px', height: 560 }}>
					<LoadingSwap loading={loading('results')} reduceMotion={reduceMotion}>
						<ResourceCard
							title="Disaster Relief and Recovery offered at American Red Cross, Northwest Washington Chapter"
							tags={['Disaster Housing', 'Free']}
							description="Provides emergency food, clothing and shelter to victims of disaster situations including loss of home to flood, fire and other natural disasters."
							whatsHere={['Community Disaster Service Centers/Hotlines', 'Disaster Related Clothing/Emergency Supplies', 'Red Cross Disaster Service Centers']}
							phone="(425) 252-4103"
						/>
					</LoadingSwap>
				</div>
			</div>

			<div data-screen="empty" style={screen('empty')}>
				<TopBar />
				<SearchHeader t="emptyField" query="shelter housing for seniors" focus={false} />
				<ResultsMeta count="0-0 of 0" loading={loading('empty')} />
				<div style={{ background: '#F5F4F2', padding: '40px 16px', height: 560 }}>
					<LoadingSwap loading={loading('empty')} reduceMotion={reduceMotion}>
						<div style={{ background: '#fff', padding: '24px 16px', textAlign: 'center' }}>
							<p style={{ margin: 0, fontSize: 19, color: '#000', lineHeight: 1.25 }}>No results found matching your query</p>
							<p data-t="instead" style={{ margin: '8px auto 0', fontSize: 15, color: '#333', display: 'inline-block' }}>
								Search for{' '}
								<span data-t="insteadLink" style={{ color: BLUE, fontWeight: 600 }}>
									“housing”
								</span>{' '}
								instead
							</p>
							<img src={NO_RESULTS_ART} alt="" style={{ display: 'block', height: 118, width: 'auto', margin: '28px auto 32px' }} />
							<p style={{ margin: '0 0 10px', fontSize: 19, color: '#000', lineHeight: 1.25 }}>Need help? We have people standing by</p>
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: BLUE, color: '#fff', fontSize: 16, padding: '5px 14px', borderRadius: 4 }}>
								{Icon.phone}
								877-211-9274
							</span>
						</div>
					</LoadingSwap>
				</div>
			</div>

			<div data-screen="housing" style={screen('housing')}>
				<TopBar />
				<SearchHeader t="housingField" query="housing" focus={false} />
				<ResultsMeta count="1-10 of 10" loading={loading('housing')} />
				<div style={{ background: '#F5F4F2', padding: '24px 16px', height: 560 }}>
					<LoadingSwap loading={loading('housing')} reduceMotion={reduceMotion}>
						<ResourceCard
							title="Emergency Housing offered by Thrive International in Spokane"
							tags={['Spokane area families', 'Displacement by August 2026 fires']}
							description="Offers housing in downtown Spokane for families displaced by the August 2026 wildfires. Rooms include a private bath and access to shared common spaces, laundry, and on-site staff. Apply online."
							whatsHere={['Transitional Housing/Shelter']}
							phone="(509) 553-5606"
						/>
					</LoadingSwap>
				</div>
			</div>
		</>
	);
}

export default function SearchDemo() {
	return (
		<PhoneDemo
			title="Every search leads somewhere"
			steps={STEPS}
			scenes={SCENES}
			Screens={Screens}
			beforeImages={[
				'/work/washington-211/before/search-1.png',
				'/work/washington-211/before/search-2.png',
				'/work/washington-211/before/search-3.png',
			]}
			beforeAlt="Washington 211's current site."
			anchors={{ start: { x: 300, y: 620 } }}
		/>
	);
}
