---
name: web-design
description: Web design and visual-polish guidance for this portfolio site (static HTML/CSS/JS on Bootstrap + jQuery vendor libs, no build step). Load before adding or editing any page section, component, or style in index.html, portfolio-details.html, 404.html, or assets/css/style.css — anything that changes what a visitor sees. Covers typography, color/contrast, spacing/layout, responsiveness, motion, and accessibility, matched to this repo's actual stack rather than generic advice. Use for requests like "make this look better", "add a new section", "redesign X", "improve the hero/nav/footer", or any styling change.
---

# Web Design for this portfolio

Concrete, checkable rules for visual work on this site — not aesthetic opinions. The goal is a portfolio that reads as *considered*, not templated, while staying consistent with the existing Bootstrap-based structure.

## This repo's actual stack (verify before assuming otherwise)

- Static HTML pages (`index.html`, `portfolio-details.html`, `404.html`) — no framework, no build/bundle step.
- Styling: Bootstrap 5 (`assets/vendor/bootstrap`) + one custom stylesheet `assets/css/style.css`. No CSS custom properties (`:root` vars) currently exist — colors and fonts are hardcoded per rule. If you introduce a new recurring color or spacing value, add it as a `:root` variable in `style.css` rather than hardcoding it a third time.
- Fonts already loaded: **Open Sans** (body), **Raleway** (nav/section titles), **Poppins** (headings/buttons). Don't introduce a fourth font family — reuse these three.
- JS: jQuery + vendor plugins (isotope, owl.carousel, venobox, waypoints, counterup) plus `assets/js/main.js` and `assets/js/navbar.js`. New interactive behavior should extend `main.js`/`navbar.js` in the same jQuery style, not introduce a new framework.
- Blog content has its own detailed conventions in `BLOG_STANDARDS.md` — read that file before touching anything under `blogs/`. This skill covers layout/visual work, not blog content structure.

## Before any visual change

1. Open `assets/css/style.css` and the target HTML file first — match existing class naming, spacing units, and breakpoints instead of inventing new patterns.
2. Check both the section you're editing *and* the section immediately above/below it — new spacing or color must look intentional next to what's already there, not just correct in isolation.
3. If the change is more than a tweak (new section, new page, redesign), do it in a local branch/dev server and view it in a real browser before calling it done — see the `run` skill for launching a local server. Test at mobile width (~375px), tablet (~768px), and desktop (~1280px+), since this is a Bootstrap grid site and breakage usually shows up at breakpoints.

## Typography

- Keep the existing three-font hierarchy: Poppins for headings/buttons, Raleway for nav and section titles, Open Sans for body copy. Don't mix in a new family for "just this one section."
- Body text stays readable: don't drop below ~16px for paragraph copy, and don't justify body text (Bootstrap default is left-aligned, keep it that way).
- Line length matters more than most style rules here: long paragraphs should stay inside a `col-md-8`/`col-lg-6`-ish container, not stretch full-width on large screens.

## Color & contrast

- Reuse the site's existing accent color rather than introducing a new one for a single component — grep `style.css` for the current accent hex before picking a new one.
- Any new text-on-background or button combination must pass WCAG AA contrast (4.5:1 for body text, 3:1 for large text/UI). Check with a contrast calculator mentally or by comparing against existing passing combinations already in the file — don't eyeball it.
- Don't rely on color alone to convey state (e.g., a "current" nav item, form validation) — pair it with weight, an icon, or an underline.

## Spacing & layout

- Follow Bootstrap's grid and spacing utilities (`py-*`, `mb-*`, `container`/`row`/`col-*`) instead of adding one-off inline styles or magic-number margins in `style.css`.
- Vertical rhythm between sections should stay consistent with neighboring sections (check the existing `py-*`/section padding values before picking new ones).
- Avoid dense walls of content — respect existing whitespace conventions; this template leans toward generous section padding, not compact.

## Motion & interaction

- This site already uses AOS-style scroll animations and hover transitions via the vendor libs/`main.js`. New elements should get the same treatment (matching animation type/duration) rather than a novel effect, unless the user asks for something specific.
- Respect `prefers-reduced-motion` for any new custom animation you add directly (existing vendor animations are out of scope to rewrite, but don't make the problem worse).
- Hover/focus states are required on every new interactive element (links, buttons, cards) — never ship a clickable element with no visible state change.

## Accessibility (non-negotiable, not optional polish)

- Every `<img>` needs meaningful `alt` text (empty `alt=""` only for purely decorative images).
- Every interactive element must be keyboard-reachable and show a visible focus state — don't strip Bootstrap's focus outline without replacing it with something equally visible.
- Use real heading levels (`h1`–`h6`) in document order for structure, not for font size — don't skip levels just to get a smaller/larger look.
- Form inputs need associated `<label>`s (this repo has a contact form under `forms/` — follow the same pattern for any new form).

## Definition of "done" for a visual change

Before reporting a styling/layout task complete: viewed in a real browser (not just read the HTML/CSS), checked at mobile + desktop widths, checked hover/focus states on anything interactive, and checked it doesn't visually clash with the section above/below it.
