# Sweet & Sour practice chat prototype

The Practice chat flow from the final Figma prototype, on a phone, looping in ~6.9s:
Practice home → tap "Start A Practice Chat" → the AI offers a template → tap it → the AI asks
who it's for and what tone → type the answer → send → the AI writes the script → Save →
slide back to Practice home and loop.

## Run
With the Astro dev server running, open http://localhost:4321/animations/companion/
(or `python3 -m http.server 5179` in this folder, or open the file directly).

- `?clean` hides the Replay / Pause controls for screen recording (record the stage only)

## How it's built
- `screens/01-practice.png` (Practice home) and the chat header are exported from Figma.
- The chat itself is rebuilt with the Figma styles (Inter 16/24, #2F4F3E bubbles, #AFB8AA
  outlined buttons, #ECECE8 input, 313×44 field that grows to 104 while typing) so it can type,
  press and scroll like the real app. Positions are Figma pixels on a 393×852 screen.
- Buttons behave like software: hover tint, press (sink, darker tint, ripple from the finger),
  spring back on release.

## Edit
- The conversation: `CONFIG` at the top of the `<script>`
- Timing: the `wait(...)` calls in `play()`; typing speed is `TYPE_MS`
- Colors: CSS variables in `:root`
