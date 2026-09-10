---
name: Vectis Corporate Enterprise
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#003120'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a32'
  on-tertiary-container: '#4ac08f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-trust, structured, and authoritative atmosphere tailored for mission-critical enterprise evaluations, high-stakes recruitment drives, and academic or certification competitions. The visual aesthetic reflects institutional rigor, operational clarity, and precision. It avoids gamification clichés—such as neon gradients, playful floating badges, and high-saturation celebratory modals—in favor of a clean, executive interface engineered for deep focus, fairness, and sustained cognitive engagement.

Target personas encompass enterprise HR leaders, procurement evaluators, compliance officers, and contest candidates executing timed assessments. The visual language conveys impartiality and reliability through balanced information density, razor-sharp typographic hierarchy, and deliberate, restrained functional accents.

## Colors

The system uses an executive navy and slate palette anchored on institutional stability, supplemented by precise semantic signaling.

- **Primary (`#1E3A8A`) & Secondary (`#2563EB`):** Deep Indigo anchors navigation shells, global headers, primary action buttons, active navigation states, and key interactive highlights. Secondary Royal Blue delivers high-clarity focus rings, inline links, and interactive hover feedback.
- **Neutrals & Surfaces:**
  - `Canvas / Background`: `#F8FAFC` (Slate 50) delivers an unglaring background canvas.
  - `Card / Modal Surface`: `#FFFFFF` pure white, ensuring crisp contrast against the muted canvas.
  - `Structural Borders`: `#E2E8F0` (Slate 200) for standard layout and table dividing lines; `#CBD5E1` (Slate 300) for interactive control borders.
  - `Text Primary`: `#0F172A` (Slate 900) provides AAA readability for question prompts, scores, and data grids.
  - `Text Secondary`: `#334155` (Slate 700) for field labels, metadata, and supporting documentation.
  - `Text Muted`: `#64748B` (Slate 500) for column headers, placeholder copy, and disabled hints.
- **Semantic Accents:**
  - `Success`: `#059669` (Emerald 600) for passing grades, verified statuses, and submission receipts, paired with `#ECFDF5` tint fills.
  - `Warning`: `#D97706` (Amber 600) for impending expirations, flag alerts, and provisional scores, paired with `#FFFBEB` fills.
  - `Error / Destructive`: `#DC2626` (Crimson 600) for integrity alerts, validation failures, and disqualification notices, paired with `#FEF2F2` fills.

## Typography

The typography couples the structural clarity of **Manrope** for analytical headings and KPI values with **Inter** for data density, continuous question readability, and granular interface labels.

- **Headlines & Titles:** Manrope delivers calibrated geometric stability. Use bold/semi-bold weights with slight negative letter tracking on headings above 20px to prevent visual sprawl in high-density consoles.
- **Body & Data Rendering:** Inter provides neutral clarity across tabular numbers, question stems, and multi-line instructions. Tabular figures (`tnum`) must be enforced across timer displays, percentile scores, question indexing, and test matrices to guarantee alignment.
- **Labels & Microcopy:** High-contrast semi-bold weights for badges, table column identifiers, form field headers, and status indicators preserve legibility at small scale.

## Layout & Spacing

The layout model adheres to a strict 8px incremental scale (base unit: 0.5rem = 8px) to eliminate visual ambiguity and enforce architectural rigor.

- **Grid Systems:**
  - **Desktop (>= 1280px):** 12-column responsive fluid grid with `1.5rem` (24px) gutters and `2rem` (32px) margins. Workspace sidebars remain anchored at a fixed width of 260px or 300px, while question builder canvases and assessment panels expand within a bounded `max-width: 1440px`.
  - **Tablet (768px - 1279px):** 8-column layout with `1.5rem` gutters and `1.5rem` margins. Sidebars collapse to fixed icons or fold into drawer sheets.
  - **Mobile (< 768px):** 4-column layout with `1rem` (16px) gutters and `1rem` margins. Side-by-side split screens (e.g., code editor + question statement) convert to switchable tab segments.
- **Density Guidelines:**
  - Default layout mode favors high data accessibility: form controls use `0.75rem` vertical spacing, and question stems use `1.5rem` separation.
  - In data-dense contexts (such as grade tables or proctoring timelines), padding compresses to `0.5rem` vertically without reducing font sizing below `12px`.

## Elevation & Depth

This design system uses a restrained approach combining **low-contrast outlines** with **subtle ambient shadows**, avoiding exaggerated skeuomorphism or floaty glassmorphism.

- **Base Layer (Level 0):** Canvas `#F8FAFC`, non-elevated.
- **Flat Containers (Level 1):** White background surfaces (`#FFFFFF`) with a continuous 1px perimeter border in `#E2E8F0`. No drop shadow. Used for inline panels, question cards, section containers, and tabular wrappers.
- **Interactive Elevated Cards (Level 2):** Applied to active assessment cards, question builder modules, and hovered cards. Uses a soft ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)` combined with the 1px `#E2E8F0` border.
- **Overlays & Drawers (Level 3):** Employed for test-taker candidate inspection drawers, scoring flyouts, and dropdown sheets: `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`, bordered by `#CBD5E1`.
- **System Dialogs & Modals (Level 4):** Reserved for test finalization confirmations, anti-cheat termination warnings, and export dialogues: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`, backed by a solid `#0F172A` backdrop at 40% opacity.

## Shapes

The design system standardizes on crisp, controlled geometry with selective micro-radii to balance enterprise durability with modern software standards:

- **Cards & Data Panels:** Defined at `12px` to `16px` (`rounded-lg` through `rounded-xl`) to clearly frame content areas without softening into casual consumer forms.
- **Form Controls & Inputs:** Anchored at `8px` (`rounded-md` equivalent) to guarantee precise, stable interaction lines.
- **Buttons:** Styled with `8px` corner radii matching inputs to maintain structural continuity in form footers and dialog action rows.
- **Status & Meta Badges:** Formatted with full pill shapes (`9999px` border radius) to visually distinguish them from actionable buttons and rectangular inputs.

## Components

### Buttons
- **Primary:** Deep Indigo (`#1E3A8A`) background, white text, 8px border radius, subtle hover state to `#1E40AF`, with a 2px offset focus ring in `#2563EB`. Padding: 10px 18px for medium size.
- **Secondary / Outline:** White surface, 1px border `#CBD5E1`, text `#0F172A`. Hover background transitions to `#F1F5F9`.
- **Destructive:** Crimson (`#DC2626`) fill or outline variant for assessment invalidation and candidate removal.
- **Sizes:** Compact (32px height for table actions), Default (40px height for canvas actions), Large (48px height for final assessment submission).

### Chips & Pill Badges
- **Format:** Strict pill shape (`rounded-full`), `padding: 2px 10px`, font size `12px` with semi-bold weight.
- **Variants:**
  - *Success (Passed / Complete):* `#059669` text, `#ECFDF5` background, 1px border `#A7F3D0`.
  - *Warning (Flagged / Pending):* `#D97706` text, `#FFFBEB` background, 1px border `#FDE68A`.
  - *Error (Disqualified / Failed):* `#DC2626` text, `#FEF2F2` background, 1px border `#FECACA`.
  - *Neutral (Draft / Unassigned):* `#475569` text, `#F1F5F9` background, 1px border `#E2E8F0`.

### Question Cards & Builder Modules
- **Container:** White surface, 12px border radius, 1px border `#E2E8F0`, padding `24px`.
- **Header:** Question weight, numerical sequence tag (e.g., "Question 04 of 25"), and points chip aligned horizontally.
- **Options List:** Selectable options use 8px radii, 1px solid border `#CBD5E1`, internal padding `12px 16px`. Active/Selected option utilizes a 1.5px border `#2563EB`, background tint `#EFF6FF`, and a bold radio indicator.

### Input Fields & Controls
- **Inputs:** 40px default height, 8px border radius, 1px `#CBD5E1` border, `#FFFFFF` background, `#0F172A` text. Placeholder in `#94A3B8`. Focused state: border color `#2563EB` with an ambient 3px box-shadow at 15% opacity (`rgba(37, 99, 235, 0.15)`).
- **Checkboxes & Radios:** 18px dimensions with `#CBD5E1` default stroke. Checked state transitions to `#1E3A8A` background with crisp white iconography.

### Data Tables (Assessments & Candidate Rosters)
- **Header:** Background `#F8FAFC`, uppercase label-sm typography in `#64748B`, 1px border-bottom in `#E2E8F0`, padding `12px 16px`.
- **Row:** Height 52px, alternating hover highlight `#F8FAFC`, border-bottom 1px `#F1F5F9`. Numeric columns use tabular figures (`font-variant-numeric: tabular-nums`).
- **Cells:** Vertical alignment centered, supporting inline badges, avatar initials, and contextual menu triggers.

### Timer & Proctor Bar
- **Bar:** Fixed sticky top bar, 48px height, `#FFFFFF` background with 1px border-bottom `#E2E8F0`.
- **Clock Element:** Tabular monospaced typography, bold weight, neutral `#0F172A` default, shifting to `#DC2626` text with subtle pulse when time drops below 5 minutes.