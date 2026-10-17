/**
 * "Reducing cognitive load on resource cards": the redesigned WA211 result
 * cards (ported from the Framer component on the original case study).
 * The results page slowly scrolls down to the two cards and back, on a loop.
 */
import type { CSSProperties } from 'react';
import CompareDemo, { type CompareScreenProps, type CompareState } from './CompareDemo';
import { BLUE, EASE_STD, Icon, S } from './shared';

const INIT: CompareState = { cursor: 'start', cursorVisible: false, pressed: false };
const SCROLL_BY = 440;

function Header() {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
			<div style={{ width: 40, height: 22, borderRadius: 5, background: '#D9D9D9' }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: '#333' }}>
				{Icon.chevronDown}
				Menu
				<div style={{ width: 24, height: 24, borderRadius: 4, background: BLUE, display: 'grid', placeItems: 'center', marginLeft: 6 }}>{Icon.search(15, '#fff')}</div>
			</div>
		</div>
	);
}

/** Gray stand-ins for the search block above the results. */
function SearchSkeleton() {
	const bar = (width: number | string, height = 16, marginBottom = 11) => ({ width, height, borderRadius: 8, background: '#DADADA', marginBottom });
	return (
		<div style={{ padding: '18px 16px 30px' }}>
			<div style={bar(64)} />
			<div style={bar('100%')} />
			<div style={bar('100%')} />
			<div style={bar(147)} />
			<div style={bar(134, 16, 14)} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				<div style={{ ...bar(82, 34, 0), borderRadius: 4 }} />
				<div style={{ ...bar(82, 34, 0), borderRadius: 4 }} />
				<div style={{ ...bar(94, 16, 0), marginLeft: 'auto' }} />
			</div>
		</div>
	);
}

type CardProps = {
	title: string;
	tags: string[];
	description: string;
	whatsHere: string[];
	phone?: string;
	hours?: string;
};

const SECONDARY_ICONS = { Website: Icon.link, Directions: Icon.map, Email: Icon.mail } as const;

function Card({ title, tags, description, whatsHere, phone = '', hours = '' }: CardProps) {
	// A phone-first service leads with Call; a web-only one leads with Website.
	const secondary = phone ? (['Website', 'Directions'] as const) : [];
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
			{secondary.length > 0 && (
				<div style={{ display: 'grid', gridTemplateColumns: `repeat(${secondary.length}, 1fr)`, gap: 8, marginTop: 8 }}>
					{secondary.map((label) => (
						<div
							key={label}
							style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 4, background: '#F5F5F5', border: '1px solid #D0D0D0', fontSize: 15, color: '#333' }}
						>
							{SECONDARY_ICONS[label]}
							{label}
						</div>
					))}
				</div>
			)}
			<p style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 15, color: BLUE }}>See more</p>
		</div>
	);
}

function Screen({ reduceMotion }: CompareScreenProps<CompareState>) {
	return (
		<div style={{ position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden' }}>
			<style>{`
				@keyframes rccScroll {
					0%, 22% { transform: translateY(0) }
					40%, 72% { transform: translateY(var(--rcc-scroll)) }
					90%, 100% { transform: translateY(0) }
				}
				.rcc-scroll { animation: rccScroll 9s ${EASE_STD} infinite; }
			`}</style>
			<div className={reduceMotion ? undefined : 'rcc-scroll'} style={{ '--rcc-scroll': `-${SCROLL_BY}px` } as CSSProperties}>
				<Header />
				<SearchSkeleton />
				<div style={{ background: '#F5F4F2', padding: '24px 16px 400px', display: 'grid', gap: 24 }}>
					<Card
						title="Emergency Housing offered by Thrive International in Spokane"
						tags={['Spokane area families', 'Displacement by August 2026 fires']}
						description="Offers housing in downtown Spokane for families displaced by the August 2026 wildfires. Rooms include a private bath and access to shared common spaces, laundry, and on-site staff. Apply online."
						whatsHere={['Transitional Housing/Shelter']}
						phone="(509) 553-5606"
					/>
					<Card
						title="Online Housing Search offered by King County Housing Authority"
						tags={['No restrictions', 'Free']}
						hours="24 hours daily"
						description="Provides searchable, real time, detailed listings of available low and market-rate housing, including senior housing options in King County."
						whatsHere={['Home Rental Listings', 'Housing Search Assistance']}
					/>
				</div>
			</div>
		</div>
	);
}

export default function ResourceCardsDemo() {
	return (
		<CompareDemo
			title="Reducing cognitive load on resource cards"
			titleLetterSpacing="-0.02px"
			body="Who each service is for sits up top as tags, details are trimmed to essential information, eligibility is shown on a first glance, and the main button matches how to reach it."
			afterLabel="Redesigned resource cards: who each service is for appears as tags up top, and the main button matches how to reach it: Call for a phone-first service, Website for a web-only one."
			beforeImage="/work/washington-211/before/cards.png"
			beforeAlt="Washington 211's current resource card: long text, every detail at the same weight, and Call, Website, and Directions buttons styled alike."
			tablistLabel="Compare resource cards"
			Screen={Screen}
			init={INIT}
		/>
	);
}
