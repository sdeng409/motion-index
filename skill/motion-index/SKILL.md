---
name: motion-index
description: >
  Apply or adapt a web animation from the Motion Index catalog (36 CSS-first, framework-agnostic
  patterns — spring easing, clip-path/word reveal, 3D flip, FLIP, View Transitions, scroll-driven
  reveal and progress, motion path, shape morph, odometer, marquee, skeleton, spinner, modal, toast,
  accordion, popover menu, tab indicator, ripple, like burst, etc.) to the user's current codebase.
  Use when the user asks to add or tune an animation, transition, or motion effect in UI code,
  asks to build a feature "using/like" one of these animations, mentions Motion Index, or pastes a
  prompt copied from the Motion Index site.
---

# Motion Index

A catalog of production web animations. Every example is plain HTML + CSS (+ small vanilla JS that
only toggles state), with `prefers-reduced-motion` handling and browser-support notes.

- Catalog: `references/llms.txt` (one line per example → `references/{id}.md`)
- Each `{id}.md`: what it does, tunable values with ranges, HTML/CSS/JS, and porting rules.
- Live site (preview + value tuner): see the URL in `references/llms.txt`.

## Workflow

1. **Pick the pattern.**
   - If the user pasted a Motion Index prompt, it already contains the example and the values they
     tuned. Use those values as-is; they take precedence over the defaults in `references/`.
   - Otherwise read `references/llms.txt` and pick the closest example(s). If two fit, say which you
     chose and why in one line. Only open the `{id}.md` files you need.
2. **Read the target code before writing.** Framework, styling method (CSS Modules, Tailwind,
   CSS-in-JS, plain CSS), naming conventions, existing motion tokens/utilities, and whether the
   project already has a global reduced-motion rule. Mirror what is there.
3. **Port, don't paste.** Follow the "옮길 때 지킬 것" rules in the `.md`. The non-negotiables:
   - CSS owns the motion; JS only flips state (class, attribute, `popover`, `dialog`).
   - Keep the `prefers-reduced-motion` block and any `@supports` guard.
   - Keep the rendering-cost tier (transform/opacity stays transform/opacity).
   - Drop `demo-*` classes; use the target's real elements and styles.
   - Document-delegated vanilla JS becomes component handlers + refs in React/Vue/Svelte.
4. **Adapting to a new feature** ("이 애니메이션을 응용해서 ~ 만들고 싶어"): keep the example's
   mechanism (e.g. `@starting-style` + `allow-discrete`, `animation-timeline: view()`, FLIP via WAAPI)
   and change only structure, values, and triggers. Combine patterns when needed, and say which ones.
5. **Verify.** Run the project's typecheck/lint/build on touched files. If a dev server and browser
   tooling are available, check that the animation actually runs and that reduced motion disables it.
6. **Report** which example(s) you used, the final values (duration, easing, distance), and anything
   you changed from the reference and why.
