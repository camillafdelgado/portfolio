/**
 * "Improving filter visibility": the WA211 filters redesign as a looping phone
 * demo (ported from the Framer component on the original case study).
 * Opens "Filter and sort", picks an option in four filter groups, applies,
 * and shows the active filters as removable tags.
 */
import type { ReactNode } from 'react';
import CompareDemo, { type CompareScreenProps, type CompareState } from './CompareDemo';
import { BLUE, EASE_OUT, INK, Icon, S } from './shared';

const QUERY = 'I need help finding housing';

type Group = { id: string; label: string; all: string; options: string[]; pick: string; tag: string };

const GROUPS: Group[] = [
	{ id: 'focus', label: 'Focus Population', all: 'All focus population', options: [], pick: '', tag: '' },
	{
		id: 'age',
		label: 'Age Group',
		all: 'All age groups',
		options: ['Young Adults (18-24)', 'Adults (25-64)', 'Older Adults (65+)'],
		pick: 'Older Adults (65+)',
		tag: 'Age Group: Older Adults (65+)',
	},
	{ id: 'lang', label: 'Languages', all: 'All languages', options: ['Interpreter services', 'Spanish', 'Russian'], pick: 'Spanish', tag: 'Languages: Spanish' },
	{
		id: 'pay',
		label: 'Payment Options',
		all: 'All payment options',
		options: ['Free', 'WA Apple Health (Medicaid)', 'Low-Cost/Sliding Scale'],
		pick: 'Free',
		tag: 'Payment Options: Free',
	},
	{ id: 'avail', label: 'Availability', all: 'Any day', options: ['Sunday', 'Monday', 'Tuesday'], pick: 'Monday', tag: 'Availability: Monday' },
];
const PICKED = GROUPS.filter((g) => g.pick);

type State = CompareState & {
	loading: boolean;
	panelOpen: boolean;
	openGroup: string | null;
	menuOpen: string | null;
	picked: string[];
	applied: boolean;
};

const INIT: State = {
	cursor: 'start',
	cursorVisible: false,
	pressed: false,
	loading: false,
	panelOpen: false,
	openGroup: null,
	menuOpen: null,
	picked: [],
	applied: false,
};

/** Open the panel, then for each filter: open group → open dropdown → pick; then Apply. */
function buildScript() {
	const steps: [number, Partial<State>][] = [
		[300, { cursorVisible: true }],
		[600, { cursor: 'filterToggle' }],
		[1050, { pressed: true }],
		[1200, { pressed: false, panelOpen: true }],
	];
	let t = 1700;
	const picked: string[] = [];
	PICKED.forEach((g) => {
		steps.push([t, { cursor: `grp-${g.id}` }]);
		steps.push([t + 400, { pressed: true }]);
		steps.push([t + 550, { pressed: false, openGroup: g.id }]);
		steps.push([t + 950, { cursor: `sel-${g.id}` }]);
		steps.push([t + 1350, { pressed: true }]);
		steps.push([t + 1500, { pressed: false, menuOpen: g.id }]);
		steps.push([t + 1850, { cursor: `opt-${g.id}` }]);
		steps.push([t + 2250, { pressed: true }]);
		picked.push(g.id);
		steps.push([t + 2400, { pressed: false, menuOpen: null, picked: [...picked] }]);
		t += 2700;
	});
	steps.push([t, { cursor: 'applyBtn' }]);
	steps.push([t + 400, { pressed: true }]);
	steps.push([t + 550, { pressed: false, panelOpen: false, openGroup: null, applied: true, loading: true, cursorVisible: false }]);
	steps.push([t + 1450, { loading: false }]);
	return steps;
}

const SCRIPT = buildScript();
const DURATION = SCRIPT[SCRIPT.length - 1][0] + 2600;

function Header() {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
			<div style={{ width: 40, height: 22, borderRadius: 5, background: '#D9D9D9' }} />
			<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: '#333' }}>
				{Icon.chevron(false)}
				Menu
				<div style={{ width: 24, height: 24, borderRadius: 4, background: BLUE, display: 'grid', placeItems: 'center', marginLeft: 6 }}>{Icon.search(15, '#fff')}</div>
			</div>
		</div>
	);
}

function SearchBlock() {
	return (
		<div style={S.pad}>
			<div style={{ margin: '28px 0 16px' }}>
				<span style={{ ...S.link, gap: 6 }}>
					{Icon.chevronLeft}
					Back
				</span>
			</div>
			<p style={{ margin: '0 0 14px', fontSize: 15, color: '#333', lineHeight: 1.3 }}>Search for resources at our partner, Washington 211</p>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 46, padding: '0 12px', border: '1px solid #333', borderRadius: 8, fontSize: 16, color: INK }}>
				{Icon.search(22)}
				{QUERY}
			</div>
		</div>
	);
}

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

/** Gray result placeholders; they shimmer while results load. */
function ResultBlocks({ loading }: { loading: boolean }) {
	const block = (marginTop: number) => ({
		...S.block,
		marginTop,
		backgroundColor: '#D9D9D9',
		backgroundImage: loading ? 'linear-gradient(90deg, #E3E3E3 25%, #F0F0F0 37%, #E3E3E3 63%)' : 'none',
		backgroundSize: '400% 100%',
		animation: loading ? 'sedShimmer 1.3s ease infinite' : 'none',
	});
	return (
		<div style={{ background: '#F5F4F2', padding: '24px 16px', height: 560 }}>
			<div style={block(0)} />
			<div style={block(24)} />
		</div>
	);
}

function Select({ t, value, placeholder }: { t: string; value: string; placeholder: string }) {
	return (
		<div
			data-t={t}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				height: 34,
				padding: '0 8px 0 9px',
				background: '#fff',
				border: '1px solid #333',
				borderRadius: 4,
				fontSize: 15,
				color: value ? INK : '#333',
			}}
		>
			{value || placeholder}
			{Icon.chevron(false)}
		</div>
	);
}

function Screen({ state, reduceMotion }: CompareScreenProps<State>) {
	const rule = '1px solid #D6D3CE';
	const groups: Group[] = [{ id: 'sort', label: 'Sort by', all: '', options: [], pick: '', tag: '' }, ...GROUPS];
	return (
		<div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
			<Header />
			<SearchBlock />
			<div style={S.pad}>
				<div style={{ ...S.link, marginTop: 16 }}>
					{Icon.pin}
					Use my location
				</div>
				<div data-t="filterToggle" style={{ ...S.link, marginTop: 16, display: 'inline-flex' }}>
					{Icon.chevron(state.panelOpen)}
					Filter and sort
				</div>
				<Collapse open={state.panelOpen} reduceMotion={reduceMotion}>
					<div style={{ marginTop: 12, background: '#F5F4F2', borderRadius: 4, padding: '0 8px 8px' }}>
						{groups.map((g) => {
							const open = state.openGroup === g.id;
							const value = state.picked.includes(g.id) ? g.pick : '';
							return (
								<div key={g.id} style={{ borderBottom: rule }}>
									<div data-t={`grp-${g.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, fontSize: 16, color: '#333' }}>
										{Icon.chevron(open, '#333')}
										{g.label}
									</div>
									{g.all && (
										<Collapse open={open} reduceMotion={reduceMotion}>
											<div style={{ paddingBottom: 14 }}>
												<Select t={`sel-${g.id}`} value={value} placeholder={g.all} />
												{state.menuOpen === g.id && (
													<div
														style={{
															marginTop: 4,
															background: '#fff',
															border: '1px solid #CFCFCF',
															borderRadius: 6,
															boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
															padding: '4px 0',
														}}
													>
														{[g.all, ...g.options].map((option) => (
															<div
																key={option}
																data-t={option === g.pick ? `opt-${g.id}` : undefined}
																style={{ padding: '9px 12px', fontSize: 15, color: '#333', background: option === g.all ? '#F2F5FA' : 'transparent' }}
															>
																{option}
															</div>
														))}
													</div>
												)}
											</div>
										</Collapse>
									)}
								</div>
							);
						})}
						<div data-t="applyBtn" style={{ display: 'grid', placeItems: 'center', height: 40, marginTop: 12, borderRadius: 4, background: BLUE, color: '#fff', fontSize: 16 }}>
							Apply
						</div>
					</div>
				</Collapse>
				<Collapse open={state.applied && !state.panelOpen} reduceMotion={reduceMotion}>
					<div style={{ borderTop: rule, marginTop: 16, paddingTop: 14 }}>
						<p style={{ margin: '0 0 12px', fontSize: 16, color: '#333' }}>Active filters</p>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
							{PICKED.map((g) => (
								<span
									key={g.id}
									style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 4, background: '#F2F2F2', border: '1px solid #D0D0D0', fontSize: 15, color: '#333' }}
								>
									{Icon.x}
									{g.tag}
								</span>
							))}
						</div>
						<p style={{ margin: '14px 0 0', fontSize: 16, color: BLUE, textDecoration: 'underline', textUnderlineOffset: 3 }}>Clear all filters</p>
					</div>
				</Collapse>
				<ResultsBar count={state.applied ? '1-3 of 3' : '1-100 of 126'} loading={state.loading} />
			</div>
			<ResultBlocks loading={state.loading} />
		</div>
	);
}

export default function FiltersDemo() {
	return (
		<CompareDemo<State>
			title="Improving filter visibility"
			body="Each filter group is now a single dropdown inside one collapsible panel, and everything that’s applied shows as a tag people can remove."
			afterLabel="Redesigned filters: a collapsible Filter and sort panel where each group is a single dropdown, then a list of active filters that can each be removed."
			beforeImage="/work/washington-211/before/filters.png"
			beforeAlt="Washington 211's current filters: a drawer where every filter group is expanded at once, with long checkbox lists and no summary of what's selected."
			Screen={Screen}
			init={INIT}
			script={SCRIPT}
			duration={DURATION}
			layoutKeys={['openGroup', 'menuOpen', 'panelOpen', 'applied']}
		/>
	);
}
