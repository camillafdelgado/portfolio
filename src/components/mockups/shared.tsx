/**
 * Shared pieces for the WA211 case-study phone mockups, ported from the
 * Framer code components on the original site: colors, phone geometry,
 * icons, small styles, and the iPhone status bar.
 */
import type { CSSProperties, ReactNode } from 'react';

export const BLUE = '#1D4F9F'; // Washington 211 blue
export const INK = '#1E1A15';
export const EASE_OUT = 'cubic-bezier(0.19, 1, 0.22, 1)';
export const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const EASE_STD = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Phone geometry (iPhone 15-ish), drawn at full size then scaled down.
export const SCREEN_W = 393;
export const SCREEN_H = 852;
export const SCREEN_RADIUS = 55;
export const STATUS_H = 54;
export const SCREEN_TOP = 12;
export const BEZEL_X = 4;
export const PHONE_W = 425;
export const PHONE_H = 876;
export const SIDE_BUTTONS = [
	{ side: 'left', top: 150, height: 34 },
	{ side: 'left', top: 214, height: 62 },
	{ side: 'left', top: 290, height: 62 },
	{ side: 'right', top: 236, height: 96 },
	{ side: 'right', top: 560, height: 56 },
] as const;

export const FONTS = {
	title: { fontFamily: '"DM Sans", sans-serif', fontSize: 32, fontWeight: 600, letterSpacing: '-0.2px', lineHeight: 1.2 },
	stepTitle: { fontFamily: '"DM Sans", sans-serif', fontSize: 20, fontWeight: 600, lineHeight: 1.2 },
	stepBody: { fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
	label: { fontFamily: '"DM Mono", monospace', fontSize: 11, fontWeight: 400, letterSpacing: '0.08em', lineHeight: 1 },
} satisfies Record<string, CSSProperties>;

export const COLORS = {
	text: 'rgb(30, 26, 21)',
	body: 'rgb(64, 64, 64)',
	muted: 'rgb(107, 102, 96)',
	accent: 'rgb(59, 130, 246)',
	activeBackground: 'rgb(255, 255, 255)',
};

export const SCREEN_FONT = 'Inter, -apple-system, "Segoe UI", sans-serif';

export const S = {
	pad: { padding: '0 16px' },
	link: { display: 'flex', alignItems: 'center', gap: 8, color: BLUE, fontSize: 16 },
	h: { color: BLUE, fontSize: 24, fontWeight: 600, margin: '18px 0 10px' },
	skeleton: { height: 16, borderRadius: 8, background: '#DADADA', marginBottom: 14 },
	block: { height: 230, borderRadius: 4, background: '#D9D9D9', marginTop: 24 },
	chip: { fontSize: 14, borderRadius: 4, padding: '2px 5px' },
} satisfies Record<string, CSSProperties>;

export const Icon = {
	search: (size = 20, color = BLUE) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
			<circle cx="10.5" cy="10.5" r="7" />
			<path d="M16 16l5 5" />
		</svg>
	),
	pin: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round">
			<path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
			<circle cx="12" cy="9" r="2.5" />
		</svg>
	),
	chevronDown: (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round">
			<path d="M5 9l7 7 7-7" />
		</svg>
	),
	chevronLeft: (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round">
			<path d="M15 5l-7 7 7 7" />
		</svg>
	),
	share: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8">
			<circle cx="18" cy="5" r="2.5" />
			<circle cx="6" cy="12" r="2.5" />
			<circle cx="18" cy="19" r="2.5" />
			<path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
		</svg>
	),
	link: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
			<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
			<path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
		</svg>
	),
	map: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round">
			<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
			<path d="M9 4v14M15 6v14" />
		</svg>
	),
	clock: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</svg>
	),
	mail: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinejoin="round">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="M3 7l9 6 9-6" />
		</svg>
	),
	linkWhite: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
			<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" />
			<path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
		</svg>
	),
	print: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinejoin="round">
			<path d="M7 9V3h10v6" />
			<rect x="3" y="9" width="18" height="8" rx="2" />
			<path d="M7 14h10v7H7z" />
		</svg>
	),
	close: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round">
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	),
	pinDark: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round">
			<path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
			<circle cx="12" cy="9" r="2.5" />
		</svg>
	),
	/** Pin with a slash through it (size, stroke color). */
	pinOff: (size = 20, color = '#333', style?: CSSProperties) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
			<mask id={`pinOffGap${size}`}>
				<rect width="24" height="24" fill="#fff" />
				<path d="M3 3l18 18" stroke="#000" strokeWidth="3.6" strokeLinecap="round" />
			</mask>
			<g mask={`url(#pinOffGap${size})`}>
				<path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
				<circle cx="12" cy="9" r="2.5" />
			</g>
			<path d="M3 3l18 18" />
		</svg>
	),
	/** Chevron that flips up when `open`. */
	chevron: (open: boolean, color = BLUE) => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2.2"
			strokeLinecap="round"
			style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 250ms ease' }}
		>
			<path d="M5 9l7 7 7-7" />
		</svg>
	),
	x: (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	),
	replay: (
		<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
			<path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
		</svg>
	),
	phone: (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
			<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z" />
		</svg>
	),
};

/** iPhone status bar: 9:41, signal, wifi, battery. */
export function StatusBar() {
	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: SCREEN_W,
				height: STATUS_H,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '4px 32px 0 52px',
				boxSizing: 'border-box',
				background: '#fff',
				color: '#000',
				fontFamily: '-apple-system, "SF Pro Text", Inter, sans-serif',
			}}
		>
			<span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px' }}>9:41</span>
			<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
				<svg width="19" height="12" viewBox="0 0 19 12" fill="#000">
					<rect x="0" y="8" width="3.2" height="4" rx="0.8" />
					<rect x="5.2" y="5.5" width="3.2" height="6.5" rx="0.8" />
					<rect x="10.4" y="3" width="3.2" height="9" rx="0.8" />
					<rect x="15.6" y="0" width="3.2" height="12" rx="0.8" />
				</svg>
				<svg width="17" height="12" viewBox="0 0 17 12" fill="#000">
					<path d="M8.5 2.4c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 008.5.7 10.6 10.6 0 001 3.7l1.2 1.2a8.9 8.9 0 016.3-2.5z" />
					<path d="M8.5 5.8c1.5 0 2.8.6 3.9 1.5l1.2-1.2a7.2 7.2 0 00-10.2 0l1.2 1.2c1-.9 2.4-1.5 3.9-1.5z" />
					<path d="M8.5 9.1c.6 0 1.1.2 1.5.6L8.5 11.3 7 9.7c.4-.4.9-.6 1.5-.6z" />
				</svg>
				<svg width="27" height="13" viewBox="0 0 27 13">
					<rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="#000" strokeOpacity="0.35" />
					<rect x="2" y="2" width="20" height="9" rx="2.5" fill="#000" />
					<path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="#000" fillOpacity="0.4" />
				</svg>
			</span>
		</div>
	);
}

/** Gray placeholder card that shimmers while results "load". */
export function CardSkeleton() {
	const bar = (width: number | string, height: number, marginBottom: number, borderRadius = 4): CSSProperties => ({
		width,
		height,
		marginBottom,
		borderRadius,
		background: 'linear-gradient(90deg, #EAEAEA 25%, #F5F5F5 37%, #EAEAEA 63%)',
		backgroundSize: '400% 100%',
		animation: 'sedShimmer 1.3s ease infinite',
	});
	return (
		<div style={{ background: '#fff', border: '1px solid #E2E2E2', borderRadius: 8, padding: '16px 12px 14px' }}>
			<div style={bar('92%', 20, 8)} />
			<div style={bar('64%', 20, 16)} />
			<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
				<div style={bar(120, 24, 0)} />
				<div style={bar(48, 24, 0)} />
			</div>
			<div style={bar('100%', 13, 8)} />
			<div style={bar('96%', 13, 8)} />
			<div style={bar('58%', 13, 18)} />
			<div style={bar(96, 15, 12)} />
			<div style={bar(220, 24, 18)} />
			<div style={bar('100%', 40, 8)} />
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
				<div style={bar('100%', 40, 0)} />
				<div style={bar('100%', 40, 0)} />
			</div>
		</div>
	);
}

/** Crossfades between a loading skeleton and the real content. */
export function LoadingSwap({ loading, reduceMotion, children }: { loading: boolean; reduceMotion: boolean; children: ReactNode }) {
	return (
		<div style={{ position: 'relative' }}>
			<div
				style={{
					opacity: loading ? 0 : 1,
					transform: loading ? 'translateY(8px)' : 'none',
					transition: reduceMotion ? 'none' : `opacity 280ms ease, transform 420ms ${EASE_OUT}`,
				}}
			>
				{children}
			</div>
			<div
				aria-hidden="true"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					opacity: loading ? 1 : 0,
					transition: reduceMotion ? 'none' : 'opacity 200ms ease',
				}}
			>
				<CardSkeleton />
			</div>
		</div>
	);
}

/**
 * The phone itself (frame, buttons, screen, Dynamic Island), drawn at full
 * size and scaled. `fullScreen` skips the status bar (for Before screenshots).
 */
export function PhoneFrame({ scale, label, fullScreen = false, children }: { scale: number; label: string; fullScreen?: boolean; children: ReactNode }) {
	return (
		<div role="img" aria-label={label} style={{ width: PHONE_W * scale, height: PHONE_H * scale, position: 'relative' }}>
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
				<div style={{ position: 'absolute', left: 16, top: SCREEN_TOP, width: SCREEN_W, height: SCREEN_H, borderRadius: SCREEN_RADIUS, overflow: 'hidden', background: '#fff' }}>
					<div aria-hidden="true" style={{ width: SCREEN_W, height: SCREEN_H, position: 'relative', fontFamily: SCREEN_FONT, color: INK }}>
						{fullScreen ? (
							<div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{children}</div>
						) : (
							<>
								<StatusBar />
								<div style={{ position: 'absolute', top: STATUS_H, left: 0, width: SCREEN_W, height: SCREEN_H - STATUS_H, overflow: 'hidden' }}>{children}</div>
							</>
						)}
						<div style={{ position: 'absolute', top: 11, left: (SCREEN_W - 125) / 2, width: 125, height: 37, borderRadius: 18.5, background: '#000' }} />
					</div>
				</div>
			</div>
		</div>
	);
}
