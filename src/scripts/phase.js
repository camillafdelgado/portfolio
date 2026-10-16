// Time-of-day phase for the homepage sky, from real Seattle sunrise/sunset.
// Inlined into <head> so data-phase is set before first paint (no flash, no seam).
// Sun math is a trimmed version of SunCalc (github.com/mourner/suncalc, BSD-2).
(() => {
	const LAT = 47.6062;
	const LNG = -122.3321;
	const PHASES = ['predawn', 'sunrise', 'day', 'sunset', 'dusk', 'night'];

	const rad = Math.PI / 180;
	const dayMs = 864e5;
	const J1970 = 2440588;
	const J2000 = 2451545;
	const J0 = 0.0009;
	const tilt = rad * 23.4397;

	const toDays = (date) => date.valueOf() / dayMs - 0.5 + J1970 - J2000;
	const fromJulian = (j) => new Date((j + 0.5 - J1970) * dayMs);

	function sunTimes(date) {
		const lw = rad * -LNG;
		const phi = rad * LAT;
		const n = Math.round(toDays(date) - J0 - lw / (2 * Math.PI));
		const ds = J0 + lw / (2 * Math.PI) + n;
		const M = rad * (357.5291 + 0.98560028 * ds);
		const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
		const L = M + C + rad * 102.9372 + Math.PI;
		const dec = Math.asin(Math.sin(tilt) * Math.sin(L));
		const noon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
		const h0 = rad * -0.833;
		const w = Math.acos((Math.sin(h0) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
		const a = J0 + (w + lw) / (2 * Math.PI) + n;
		const set = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
		return { rise: fromJulian(noon - (set - noon)), set: fromJulian(set) };
	}

	// Minutes relative to sunrise / sunset where each phase starts and ends,
	// in the order a real sky goes: pre-dawn → sunrise → day → sunset → dusk → night.
	function phaseAt(now) {
		const min = 6e4;
		for (const offset of [-1, 0, 1]) {
			const { rise, set } = sunTimes(new Date(now.valueOf() + offset * dayMs));
			const r = (now - rise) / min;
			const s = (now - set) / min;
			if (r >= -60 && r < -15) return 'predawn';
			if (r >= -15 && r < 45) return 'sunrise';
			if (r >= 45 && s < -45) return 'day';
			if (s >= -45 && s < 15) return 'sunset';
			if (s >= 15 && s < 60) return 'dusk';
		}
		return 'night';
	}

	// The visitor's choice from the theme menu: 'auto', 'off' or a phase.
	// Saved in this browser only; falls back to 'auto' if storage is blocked.
	const KEY = 'sky-theme';
	function getChoice() {
		try {
			const v = localStorage.getItem(KEY);
			return v === 'off' || PHASES.includes(v) ? v : 'auto';
		} catch {
			return 'auto';
		}
	}
	function setChoice(v) {
		try {
			localStorage.setItem(KEY, v);
		} catch {}
		// A menu pick wins over a ?phase= preview link.
		const url = new URL(location.href);
		if (url.searchParams.has('phase')) {
			url.searchParams.delete('phase');
			history.replaceState(history.state, '', url);
		}
		// Switch quickly when chosen (the slow 3s fade is for the sun's own changes).
		const root = document.documentElement;
		root.classList.add('theme-switching');
		clearTimeout(setChoice.timer);
		setChoice.timer = setTimeout(() => root.classList.remove('theme-switching'), 700);
		apply();
	}

	// ?phase=dusk forces a phase for previewing (wins over the saved choice).
	function forcedPhase() {
		const p = new URLSearchParams(location.search).get('phase');
		return PHASES.includes(p) ? p : null;
	}

	function apply() {
		const choice = getChoice();
		const root = document.documentElement;
		root.dataset.themeChoice = choice;
		root.dataset.phase = forcedPhase() || (choice === 'auto' ? phaseAt(new Date()) : choice);
	}

	apply();
	window.__sky = { phaseAt, sunTimes, apply, getChoice, setChoice, PHASES };
})();
