/**
 * Step-by-step phone demo with an After / Before toggle, ported from the
 * Framer code component on the original WA211 case study.
 *
 * Left: a numbered list of steps (the active one expands). Right: a phone that
 * plays the active step's scripted scene (a fake cursor taps, types, and a
 * numbered marker points at the change), then moves on to the next step.
 * "Before" shows a screenshot of Washington 211's current site for that step.
 *
 * Scenes are plain data: an initial state plus timed state changes. The
 * screens component renders the state; elements it marks with data-t="name"
 * can be targeted by `cursor` and `marker`.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import {
	BEZEL_X,
	COLORS,
	EASE_BACK,
	EASE_OUT,
	EASE_STD,
	FONTS,
	PHONE_H,
	PHONE_W,
	SCREEN_FONT,
	SCREEN_H,
	SCREEN_RADIUS,
	SCREEN_TOP,
	SCREEN_W,
	SIDE_BUTTONS,
	STATUS_H,
	StatusBar,
	INK,
} from './shared';

export type DemoState = {
	screen: string;
	query: string;
	focus: boolean;
	cursor: string;
	cursorVisible: boolean;
	pressed: boolean;
	marker: string | null;
	loading: boolean;
	[key: string]: unknown;
};

export type Scene = {
	init: DemoState;
	script: [number, Partial<DemoState>][];
	duration: number;
	/** Optional overrides for the resting frame (paused / reduced motion). */
	still?: Partial<DemoState>;
};

export type ScreensProps = { state: DemoState; reduceMotion: boolean };

type Point = { x: number; y: number };

interface Props {
	title: string;
	steps: { title: string; body: string }[];
	scenes: Scene[];
	Screens: ComponentType<ScreensProps>;
	beforeImages: string[];
	beforeAlt: string;
	/** Named cursor positions that aren't elements (e.g. where it starts). */
	anchors: Record<string, Point>;
	hint?: string;
	phoneWidth?: number;
	/** Line height of the step descriptions (the original used 160% / 165%). */
	stepBodyLineHeight?: number;
}

/** Keystrokes: one state change per character, `step` ms apart, into `field`. */
export function typing(start: number, text: string, step: number, from = 0, field = 'query'): [number, Partial<DemoState>][] {
	return Array.from(text.slice(from)).map((_, i) => [start + i * step, { [field]: text.slice(0, from + i + 1) }]);
}

/** Where a scene ends up (shown when paused, offscreen, or reduced motion). */
function finalState(scene: Scene): DemoState {
	const end = scene.script.reduce((s, [, change]) => ({ ...s, ...change }), { ...scene.init, cursorVisible: false });
	return scene.still ? { ...end, ...scene.still } : end;
}

/** Position of an element relative to an ancestor, ignoring the phone's scale. */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
	let x = 0;
	let y = 0;
	let node: HTMLElement | null = el;
	while (node && node !== root) {
		x += node.offsetLeft;
		y += node.offsetTop;
		node = node.offsetParent as HTMLElement | null;
	}
	return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export default function PhoneDemo({
	title,
	steps,
	scenes,
	Screens,
	beforeImages,
	beforeAlt,
	anchors,
	hint = 'Toggle to compare',
	phoneWidth = 300,
	stepBodyLineHeight = 1.6,
}: Props) {
	const [active, setActive] = useState(0);
	const [state, setState] = useState<DemoState>(scenes[0].init);
	const [tab, setTab] = useState<'after' | 'before'>('after');
	const [inView, setInView] = useState(false);
	const [reduceMotion, setReduceMotion] = useState(false);
	const [cursor, setCursor] = useState<Point>(anchors.start);
	const [marker, setMarker] = useState<Point | null>(null);
	const [markerNumber, setMarkerNumber] = useState(1);
	const [width, setWidth] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const screenRef = useRef<HTMLDivElement>(null);

	const playing = inView && !reduceMotion && tab === 'after';
	const pad = { left: 1, right: 0, top: 8 };
	const scale = (width > 0 ? Math.min(phoneWidth, (width - pad.left - pad.right - 48) / 1.1694117647058824) : phoneWidth) / PHONE_W;

	// Track our width so the phone can shrink on small screens.
	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		const mq = matchMedia('(prefers-reduced-motion: reduce)');
		setReduceMotion(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);

	// Only play while at least a third of it is on screen.
	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	// Run the active step's script, then move on to the next step.
	useEffect(() => {
		const scene = scenes[active];
		if (!playing) {
			setState(finalState(scene));
			return;
		}
		setState(scene.init);
		const timers = scene.script.map(([at, change]) => setTimeout(() => setState((s) => ({ ...s, ...change })), at));
		timers.push(setTimeout(() => setActive((a) => (a + 1) % scenes.length), scene.duration));
		return () => timers.forEach(clearTimeout);
	}, [active, playing, scenes]);

	// Move the cursor / marker onto the element they name.
	useLayoutEffect(() => {
		const screen = screenRef.current?.querySelector<HTMLElement>(`[data-screen="${state.screen}"]`);
		const find = (name: string) => screen?.querySelector<HTMLElement>(`[data-t="${name}"]`) ?? null;
		if (anchors[state.cursor]) setCursor(anchors[state.cursor]);
		else {
			const el = find(state.cursor);
			if (el && screen) {
				const r = offsetWithin(el, screen);
				setCursor({ x: r.x + Math.min(r.w / 2, 120), y: r.y + r.h / 2 });
			}
		}
		if (state.marker) {
			const el = find(state.marker);
			if (el && screen) {
				const r = offsetWithin(el, screen);
				setMarker({ x: r.x + r.w, y: r.y });
				setMarkerNumber(active + 1);
			}
		}
	}, [state.cursor, state.marker, state.screen]);

	const beforeImage = beforeImages[active] || beforeImages.find(Boolean) || '';

	return (
		<div
			ref={rootRef}
			className="phone-demo"
			style={{
				width: '100%',
				padding: `${pad.top}px ${pad.right}px 0 ${pad.left}px`,
				boxSizing: 'border-box',
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				gap: 48,
				color: COLORS.text,
			}}
		>
			<style>{`
				@keyframes sedBlink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
				@keyframes sedShimmer { 0% { background-position: 100% 50% } 100% { background-position: 0 50% } }
				.sed-caret { animation: sedBlink 1s steps(1) infinite; }
				@media (prefers-reduced-motion: reduce) { .sed-caret { animation: none; } }
				.sed-step:focus-visible, .sed-tab:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 2px; }
			`}</style>

			{/* Steps */}
			<div style={{ flex: '1 1 280px', minWidth: 0 }}>
				<h3 style={{ ...FONTS.title, margin: '0 0 20px', color: COLORS.text }}>{title}</h3>
				<ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 4 }}>
					{steps.map((step, i) => {
						const on = i === active;
						return (
							<li key={step.title} style={{ maxWidth: 'none' }}>
								<button
									type="button"
									className="sed-step"
									aria-current={on ? 'step' : undefined}
									onClick={() => setActive(i)}
									style={{
										display: 'grid',
										gridTemplateColumns: '24px 1fr',
										gap: 12,
										width: '100%',
										textAlign: 'left',
										padding: 12,
										border: 'none',
										borderRadius: 10,
										cursor: 'pointer',
										font: 'inherit',
										color: 'inherit',
										background: on ? COLORS.activeBackground : 'transparent',
										boxShadow: on ? '0 0 0 1px rgba(30,26,21,0.08)' : 'none',
										transition: 'background 200ms ease, box-shadow 200ms ease',
									}}
								>
									<span
										style={{
											width: 22,
											height: 22,
											borderRadius: 11,
											display: 'grid',
											placeItems: 'center',
											fontFamily: FONTS.stepTitle.fontFamily,
											fontSize: 12,
											fontWeight: 600,
											color: on ? '#fff' : COLORS.muted,
											background: on ? COLORS.accent : 'rgba(30,26,21,0.07)',
											transition: 'background 200ms ease, color 200ms ease',
											marginTop: 1,
										}}
									>
										{i + 1}
									</span>
									<span>
										<span style={{ ...FONTS.stepTitle, display: 'block', color: on ? COLORS.text : COLORS.muted, transition: 'color 200ms ease' }}>
											{step.title}
										</span>
										<span
											style={{
												display: 'grid',
												gridTemplateRows: on ? '1fr' : '0fr',
												transition: reduceMotion ? 'none' : `grid-template-rows 360ms ${EASE_OUT}`,
											}}
										>
											<span style={{ overflow: 'hidden' }}>
												<span style={{ ...FONTS.stepBody, lineHeight: stepBodyLineHeight, display: 'block', paddingTop: 4, color: COLORS.body }}>
													{step.body}
												</span>
											</span>
										</span>
									</span>
								</button>
							</li>
						);
					})}
				</ol>
			</div>

			{/* Phone + After/Before toggle */}
			<div style={{ flex: '0 0 auto', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
				{hint && <p style={{ ...FONTS.label, margin: 0, color: '#8A8A8A', textTransform: 'uppercase' }}>{hint}</p>}
				<div style={{ border: '1px solid rgba(30,26,21,0.08)', borderRadius: 12, overflow: 'hidden' }}>
					<div role="tablist" aria-label="Compare with Washington 211's current site" style={{ display: 'flex' }}>
						{(['after', 'before'] as const).map((name) => {
							const on = tab === name;
							return (
								<button
									key={name}
									type="button"
									role="tab"
									aria-selected={on}
									className="sed-tab"
									onClick={() => setTab(name)}
									style={{
										...FONTS.label,
										flex: 1,
										padding: 10,
										border: 'none',
										borderBottom: `2px solid ${on ? COLORS.accent : 'transparent'}`,
										background: on ? 'rgba(0,102,204,0.03)' : 'rgba(30,26,21,0.04)',
										color: on ? INK : '#5A5248',
										textTransform: 'uppercase',
										cursor: 'pointer',
										transition: 'background 200ms, color 200ms, border-color 200ms',
									}}
								>
									{name === 'after' ? 'After' : 'Before'}
								</button>
							);
						})}
					</div>
					<div style={{ display: 'flex', justifyContent: 'center', padding: `28px ${Math.ceil(36 * scale)}px ${Math.ceil(66 * scale)}px` }}>
						<div
							role="img"
							aria-label={
								tab === 'before'
									? `Before, step ${active + 1}: ${beforeAlt}`
									: `Demo, step ${active + 1} of ${scenes.length}: ${steps[active].title}. ${steps[active].body}`
							}
							style={{ width: PHONE_W * scale, height: PHONE_H * scale, position: 'relative' }}
						>
							<div style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})`, transformOrigin: '0 0', position: 'relative' }}>
								{SIDE_BUTTONS.map((b, i) => (
									<div
										key={i}
										style={{
											position: 'absolute',
											top: b.top,
											height: b.height,
											width: 6,
											left: b.side === 'left' ? 0 : PHONE_W - BEZEL_X - 2,
											borderRadius: 2,
											background: '#2A2A2D',
											boxShadow: 'inset 0 0 0 1px #6E6E73',
										}}
									/>
								))}
								<div
									style={{
										position: 'absolute',
										left: BEZEL_X,
										top: 0,
										width: 417,
										height: PHONE_H,
										borderRadius: 67,
										background: '#111113',
										boxShadow: 'inset 0 0 0 1.5px #4A4A4E, 0 0 0 1.5px #A1A1A6, 0 30px 60px -24px rgba(30,26,21,0.35)',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: 16,
										top: SCREEN_TOP,
										width: SCREEN_W,
										height: SCREEN_H,
										borderRadius: SCREEN_RADIUS,
										overflow: 'hidden',
										background: '#fff',
									}}
								>
									<div ref={screenRef} aria-hidden="true" style={{ width: SCREEN_W, height: SCREEN_H, position: 'relative', fontFamily: SCREEN_FONT, color: INK }}>
										<StatusBar />
										<div style={{ position: 'absolute', top: STATUS_H, left: 0, width: SCREEN_W, height: SCREEN_H - STATUS_H, overflow: 'hidden' }}>
											<Screens state={state} reduceMotion={reduceMotion} />
											{marker && (
												<div
													style={{
														position: 'absolute',
														left: Math.min(marker.x + 4, SCREEN_W - 34),
														top: marker.y - 14,
														width: 28,
														height: 28,
														borderRadius: 14,
														background: COLORS.accent,
														color: '#fff',
														fontSize: 15,
														fontWeight: 600,
														fontFamily: FONTS.stepTitle.fontFamily,
														display: 'grid',
														placeItems: 'center',
														boxShadow: '0 2px 6px rgba(59,130,246,0.4)',
														opacity: state.marker ? 1 : 0,
														transform: state.marker ? 'scale(1)' : 'scale(0.4)',
														transition: reduceMotion ? 'none' : `opacity 200ms ease, transform 250ms ${EASE_BACK}`,
													}}
												>
													{markerNumber}
												</div>
											)}
											<div
												style={{
													position: 'absolute',
													left: cursor.x - 18,
													top: cursor.y - 18,
													width: 36,
													height: 36,
													borderRadius: 18,
													background: 'rgba(30,26,21,0.18)',
													border: '2px solid rgba(255,255,255,0.9)',
													boxShadow: '0 2px 8px rgba(30,26,21,0.25)',
													opacity: state.cursorVisible ? 1 : 0,
													transform: state.pressed ? 'scale(0.78)' : 'scale(1)',
													transition: reduceMotion
														? 'none'
														: `left 450ms ${EASE_STD}, top 450ms ${EASE_STD}, opacity 200ms ease, transform 150ms ease`,
												}}
											/>
										</div>
										{tab === 'before' && beforeImage && (
											<img
												src={beforeImage}
												alt=""
												style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
											/>
										)}
										{/* Dynamic Island */}
										<div style={{ position: 'absolute', top: 11, left: (SCREEN_W - 125) / 2, width: 125, height: 37, borderRadius: 18.5, background: '#000' }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
