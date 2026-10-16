# 211 search → no results prototype

Animated walkthrough: home → type "shelter/housing/roommate" → search → no-results page.

## Run
```
python3 -m http.server 5178
```
Then open http://localhost:5178 (opening the file directly also works).

- `?debug` — outlines every hotspot so you can line things up
- `?clean` — hides the controls for screen recording (record the blue frame)

## Edit
Everything tweakable is in the `CONFIG` block at the top of the `<script>` in `index.html`:
- `query`, typing speed
- hotspot boxes/points, as % of each screenshot
- `results.layers` — the regions of the results page that reveal one after another
- `camera` — zoom level and focus point for each shot

Colors are CSS variables in `:root`. The story order and timing are in `build()`.
Swap screenshots by replacing the files in `assets/`.
