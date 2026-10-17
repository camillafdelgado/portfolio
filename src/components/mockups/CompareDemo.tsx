/**
 * Single-scene phone demo with an After / Before toggle and a replay button,
 * ported from the Framer code components on the original WA211 case study
 * (used by the filters and resource-card mockups).
 *
 * Title and text sit above a framed phone. "After" loops a scripted scene
 * (a fake cursor taps through the redesign) or, with no script, just shows the
 * screen and its own CSS animation; "Before" shows a screenshot of Washington
 * 211's current site.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type RefObject } from 'react';
import { EASE_STD, INK, Icon, PHONE_W, PhoneFrame } from './shared';

export type CompareState = { cursor: string; cursorVisible: boolean; pressed: boolean; [key: string]: unknown };
export type CompareScreenProps<S extends CompareState> = { state: S; reduceMotion: boolean };

type Point = { x: number; y: number };

const ACCENT = 'rgb(59, 130, 246)';
const LABEL = { fontFamily: '"DM Mono", monospace', fontSize: 12, fontWeight: 400, letterSpacing: '0.08em', lineHeight: 1 } as const;

interface Props<S extends CompareState> {
	title: string;
	body: string;
	afterLabel: string;
	beforeImage: string;
	beforeAlt: string;
	Screen: ComponentType<CompareScreenProps<S>>;
	init: S;
	/** Leave out for a screen that animates itself (no cursor, no replay). */
	script?: [number, Partial<S>][];
	/** Loop length in ms. */
	duration?: number;
	/** State keys whose changes move things around, so the cursor re-aims. */
	layoutKeys?: (keyof S)[];
	tablistLabel?: string;
	titleLetterSpacing?: string;
	hint?: string;
	phoneWidth?: number;
}

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

export default function CompareDemo<S extends CompareState>({
	title,
	body,
	afterLabel,
	beforeImage,
	beforeAlt,
	Screen,
	init,
	script = [],
	duration = 0,
	layoutKeys = [],
	tablistLabel,
	titleLetterSpacing = '-0.2px',
	hint = 'Toggle to compare',
	phoneWidth = 320,
}: Props<S>) {
	const [tab, setTab] = useState<'after' | 'before'>('after');
	const [loop, setLoop] = useState(0);
	const [state, setState] = useState<S>(init);
	const [inView, setInView] = useState(false);
	const [reduceMotion, setReduceMotion] = useState(false);
	const [cursor, setCursor] = useState<Point>({ x: 300, y: 620 });
	const [width, setWidth] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);

	const scripted = script.length > 0;
	const playing = scripted && tab === 'after' && inView && !reduceMotion;
	const scale = (width > 0 ? Math.min(phoneWidth, (width - 48) / 1.1694117647058824) : phoneWidth) / PHONE_W;

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

	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	// Play the script, then start over. Paused / reduced motion: show the end.
	useEffect(() => {
		if (!playing) {
			setState(script.reduce((s, [, change]) => ({ ...s, ...change }), { ...init }));
			return;
		}
		setState(init);
		const timers = script.map(([at, change]) => setTimeout(() => setState((s) => ({ ...s, ...change })), at));
		timers.push(setTimeout(() => setLoop((n) => n + 1), duration));
		return () => timers.forEach(clearTimeout);
	}, [playing, loop]);

	// Aim the cursor at the element it names; re-aim once panels finish moving.
	useLayoutEffect(() => {
		const aim = () => {
			if (state.cursor === 'start') {
				setCursor({ x: 300, y: 620 });
				return;
			}
			const stage = stageRef.current;
			const el = stage?.querySelector<HTMLElement>(`[data-t="${state.cursor}"]`);
			if (el && stage) {
				const r = offsetWithin(el, stage);
				setCursor({ x: r.x + Math.min(r.w / 2, 100), y: r.y + r.h / 2 });
			}
		};
		aim();
		const t = setTimeout(aim, 440);
		return () => clearTimeout(t);
	}, [state.cursor, ...layoutKeys.map((k) => state[k])]);

	const tabButton = (name: 'after' | 'before', label: string) => {
		const on = tab === name;
		return (
			<button
				type="button"
				role="tab"
				aria-selected={on}
				className="fc-tab"
				onClick={() => setTab(name)}
				style={{
					...LABEL,
					flex: 1,
					padding: 10,
					border: 'none',
					borderBottom: `2px solid ${on ? ACCENT : 'transparent'}`,
					background: on ? 'rgba(0,102,204,0.03)' : 'rgba(30,26,21,0.04)',
					color: on ? INK : '#5A5248',
					textTransform: 'uppercase',
					cursor: 'pointer',
					transition: 'background 200ms, color 200ms, border-color 200ms',
				}}
			>
				{label}
			</button>
		);
	};

	return (
		<div ref={rootRef} className="compare-demo" style={{ width: '100%', boxSizing: 'border-box', color: INK }}>
			<style>{`
				@keyframes sedShimmer { 0% { background-position: 100% 50% } 100% { background-position: 0 50% } }
				.fc-tab:focus-visible, .fc-replay:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: -2px; }
			`}</style>
			<h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 32, fontWeight: 600, letterSpacing: titleLetterSpacing, lineHeight: 1.2, margin: '0 0 12px', color: INK }}>
				{title}
			</h3>
			<p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 1.65, margin: '0 0 16px', color: '#404040' }}>{body}</p>
			{hint && <p style={{ ...LABEL, margin: '0 0 10px', color: '#8A8A8A', textTransform: 'uppercase' }}>{hint}</p>}
			<div style={{ border: '1px solid rgba(30,26,21,0.08)', borderRadius: 12, overflow: 'hidden' }}>
				<div role="tablist" aria-label={tablistLabel ?? `Compare: ${title}`} style={{ display: 'flex' }}>
					{tabButton('after', 'After')}
					{tabButton('before', 'Before')}
				</div>
				<div
					style={{
						position: 'relative',
						background: 'rgb(255, 255, 255)',
						display: 'flex',
						justifyContent: 'center',
						padding: `32px 24px ${Math.max(0, 66 * scale - 8)}px`,
					}}
				>
					<div style={{ display: tab === 'after' ? 'block' : 'none' }}>
						<PhoneFrame scale={scale} label={afterLabel}>
							<div ref={stageRef as RefObject<HTMLDivElement>} style={{ position: 'absolute', inset: 0 }}>
								<Screen state={state} reduceMotion={reduceMotion} />
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
										transition: reduceMotion ? 'none' : `left 450ms ${EASE_STD}, top 450ms ${EASE_STD}, opacity 200ms ease, transform 150ms ease`,
									}}
								/>
							</div>
						</PhoneFrame>
					</div>
					<div style={{ display: tab === 'before' ? 'block' : 'none' }}>
						<PhoneFrame scale={scale} label={beforeAlt} fullScreen>
							<img src={beforeImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
						</PhoneFrame>
					</div>
					{scripted && tab === 'after' && !reduceMotion && (
						<button
							type="button"
							className="fc-replay"
							aria-label="Replay from the beginning"
							onClick={() => setLoop((n) => n + 1)}
							style={{
								position: 'absolute',
								right: 16,
								bottom: 16,
								width: 44,
								height: 44,
								borderRadius: 22,
								border: 'none',
								display: 'grid',
								placeItems: 'center',
								background: 'rgba(30,26,21,0.72)',
								color: '#fff',
								boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
								cursor: 'pointer',
							}}
						>
							{Icon.replay}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
