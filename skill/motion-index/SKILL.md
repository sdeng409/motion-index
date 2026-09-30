---
name: motion-index
description: >
  Apply, adapt, or replace web animations in the user's current codebase using the Motion Index
  catalog (36 CSS-first, framework-agnostic patterns — spring easing, clip-path/word reveal, 3D flip,
  FLIP, View Transitions, scroll-driven reveal and progress, motion path, shape morph, odometer,
  marquee, skeleton, spinner, modal, toast, accordion, popover menu, tab indicator, ripple, like
  burst, etc.). Use whenever the user asks to add, modify, tune, replace, or restyle an animation,
  transition, keyframes, or motion effect in UI code, including changing an existing animation and
  switching to a different motion mid-task, and for Korean requests such as "애니메이션 수정",
  "모션 바꿔줘", "움직임 효과 넣어줘". Also use when the user asks to build a feature "using/like"
  one of these animations, mentions Motion Index, or pastes a prompt copied from the Motion Index
  site.
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
   - If the prompt's "적용할 곳" is empty or still the placeholder, read the code, propose 2–3
     fitting places, and ask before writing.
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
   - Values under "## 조정한 값" were picked by the user: never snap them to design tokens. Values
     under "## 기본값" may become a token only if it is within 10%; otherwise keep the example value
     and mention the nearby token in the report.
   - Exit before removal (conditional render, list delete): flip state, then await
     `Promise.allSettled(el.getAnimations().map((a) => a.finished))` before removing. Waiting on
     `transitionend` alone leaves the element forever when the duration is 0 or motion is reduced.
     If the removed element had focus, move focus somewhere sensible (e.g. the next item).
4. **Adapting to a new feature** ("이 애니메이션을 응용해서 ~ 만들고 싶어"): keep the example's
   mechanism (e.g. `@starting-style` + `allow-discrete`, `animation-timeline: view()`, FLIP via WAAPI)
   and change only structure, values, and triggers. Combine patterns when needed, and say which ones.
5. **Verify.** Run the project's typecheck/lint/build on touched files. Then check in a browser that
   the animation actually runs, and that it is disabled with reduced motion on (Chrome DevTools
   Rendering panel, CDP `Emulation.setEmulatedMedia`, or Playwright `reducedMotion: 'reduce'`).
   Seeing the rule in the CSS is not verification; if you could not run a check, say so in the report.
6. **Report** which example(s) you used, the final values (duration, easing, distance), and anything
   you changed from the reference and why.
