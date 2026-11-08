# Matrix experiments

Branch: `matrix-experiments`. Production continues to use `main`.

## Preview

Serve the repository root with any static HTTP server, for example:

```sh
python -m http.server 8776
```

Open `http://localhost:8776/`. Add `?profile` to expose timing samples in the
`render-profile` meta element. These timings measure JavaScript work, not total
GPU frame time.

## Controls

- Enter the Construct opens the white room.
- The archive supports arrows, keyboard navigation and touch swipes.
- Open a dossier and use Scan Architecture to inspect its four illustrated layers.
- Drag or activate the green lower-right corner to reveal the wireframe layer.
- The terminal command `director` enables the visual presentation mode. Escape exits it.
- Bullet Time adds fading positions around the core.
- The ending includes a replay button. Wheel, touch or keyboard input cancels replay.
- Pause and reduced-motion preferences stop continuous animation.

## Stability changes

The travelling glyph object renders only within its owning room, archive or ending.
It does not cross project descriptions. The archive omits it below 900 CSS pixels.
One scheduler handles these scenes and stops outside them, while hidden, or while
a modal, code vision or the wireframe layer blocks rendering.

The Canvas fallback retains the variable-shadowing fix from main. Morph endpoints
also clear their previous frame. Modal closing cancels the scanner timers, and
touch swipes suppress the trailing click so they cannot accidentally open a dossier.
Decorative text echoes are hidden from assistive technology and removed on narrow screens.

## Validation

```sh
node --test render-regression.test.cjs
```

The regression checks cover all journey phases and morph endpoints without WebGL,
finite projected coordinates and clearing between frames. Browser checks cover
opening/closing dossiers, scanner completion and paused state, language switching,
the wireframe layer and director-mode exit. Physical-device GPU performance still
needs review; no uniform frame-rate guarantee is implied.
