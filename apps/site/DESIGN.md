---
name: theschoonover.net
description: A calm, instrumented operations console for a security platform leader's body of work.
colors:
  signal-blue: "#008fdb"
  signal-blue-foreground: "#f9fafb"
  emerald-ack: "#14b884"
  emerald-ack-dark: "#22c390"
  alert-red: "#c32222"
  alert-red-dark: "#d24141"
  paper: "#fcfcfd"
  paper-secondary: "#f3f5f7"
  paper-muted: "#e7ebee"
  hairline: "#d3d8df"
  ink: "#0a1329"
  ink-secondary: "#1f2b47"
  slate: "#5c6370"
  night: "#0e121b"
  night-secondary: "#23282f"
  night-muted: "#272c35"
  hairline-dark: "#2f3742"
  frost: "#f2f4f8"
  frost-secondary: "#e4e9f1"
  frost-muted: "#a7afbe"
  chart-1: "hsl(203 89% 58%)"
  chart-2: "hsl(195 83% 49%)"
  chart-3: "hsl(160 84% 39%)"
  chart-4: "hsl(222 87% 63%)"
  chart-5: "hsl(269 81% 65%)"
typography:
  display:
    fontFamily: "Space Grotesk Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 2.25rem + 1vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Space Grotesk Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0em"
  title:
    fontFamily: "Space Grotesk Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0em"
  card-title:
    fontFamily: "Space Grotesk Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0em"
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "'liga' 1, 'tnum' 1, 'cv11' 1"
  body-lead:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  body-small:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.2em"
  action:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: "0em"
rounded:
  sm: "7.6px"
  md: "9.6px"
  input: "13.6px"
  badge: "12px"
  panel: "16px"
  panel-lg: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "48px"
  container: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.signal-blue-foreground}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#1a9adf"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.signal-blue}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.paper-muted}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.signal-blue}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.paper-muted}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.paper-secondary}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "44px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel-lg}"
    padding: "40px"
  stat-badge:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.badge}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.paper-secondary}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.input}"
    padding: "0 12px"
    height: "44px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    typography: "{typography.action}"
    padding: "8px"
  nav-link-active:
    textColor: "{colors.ink}"
  eyebrow:
    textColor: "{colors.slate}"
    typography: "{typography.label}"
---

# Design System: theschoonover.net

## Overview

**Creative North Star: "The Operations Console"**

The site reads like the dashboard of a well-run security platform: a cool near-white canvas in daylight, an ink-navy one at night, and a single saturated sky blue that marks every live signal. Surfaces are bordered panels with soft corners, laid out on a generous rhythm, and almost nothing casts a shadow. Each section opens the same way, with a tracked uppercase label and then a geometric display heading, so the page scans like a console whose every pane is labeled. The mood is calm, precise, and credible first, and confident, systematic, and modern second: restraint is the brand, and the one blue is allowed to be assertive because everything around it is quiet.

Density is editorial rather than dense. Panels carry 24 to 48px of internal padding, sections are separated by 48px, and the hero runs centered copy at a wide measure. Light and dark are first-class and tonally symmetric: every neutral has a counterpart, and Signal Blue is the one value that never changes between themes. Translucency and backdrop blur appear only where a layer floats over content (the sticky header, the command palette scrim, the hero stat badges), never as decoration.

Below the large breakpoint (1024px) the header carries no inline navigation by design: the command palette trigger stays visible at every width and is the navigation entry point there, icon-only until 1280px.

**Key Characteristics:**
- One chromatic signal (Signal Blue) on an otherwise neutral, tonal canvas.
- Bordered panels with 16 to 24px corners; pills for every action and chip.
- Eyebrow label plus display heading as the universal section opener.
- Flat, hairline-defined depth; blur reserved for floating layers.
- Light and dark themes with mirrored neutral scales and an unchanged accent.

## Colors

A cool, low-chroma neutral scale in two mirrored themes, with one saturated blue carrying every signal and an emerald held in reserve for acknowledgement.

### Primary
- **Signal Blue** (`{colors.signal-blue}`): The only chromatic color at rest. Links, the primary button fill, the active-nav indicator, focus rings, card titles on hover, the eyebrow over the hero name, and the reading-progress bar. Identical in both themes.
- **Signal Blue Foreground** (`{colors.signal-blue-foreground}`): Text on a Signal Blue fill. Only ever sits on the full-strength blue.

### Secondary
- **Emerald Ack** (`{colors.emerald-ack}`, dark `{colors.emerald-ack-dark}`): The `accent` token. Reserved for success and acknowledgement states; the components barely use it today, and that scarcity is deliberate.

### Tertiary
- **Alert Red** (`{colors.alert-red}`, dark `{colors.alert-red-dark}`): The `destructive` token. Error text and failed states only. The chart islands additionally use a fixed five-step palette (`{colors.chart-1}` through `{colors.chart-5}`) that does not shift with theme.

### Neutral
- **Paper** (`{colors.paper}`): Light-theme page and surface background. Panels sit on it at 80 to 90% alpha so the hero gradient shows through.
- **Paper Secondary** (`{colors.paper-secondary}`): Chip fill, the leadership-arc panel at 50% alpha, the secondary button.
- **Paper Muted** (`{colors.paper-muted}`): Hover fill for ghost buttons, nav items, and footer chips; code-block base at 60%.
- **Hairline** (`{colors.hairline}`): Every border and input stroke in light. Panels use it at full strength; the header and footer use it at 60%.
- **Ink** (`{colors.ink}`): Light-theme foreground: headings, body, selected-chip fill.
- **Ink Secondary** (`{colors.ink-secondary}`): Text on Paper Secondary surfaces (chips, secondary button).
- **Slate** (`{colors.slate}`): Muted text: eyebrows, descriptions, nav links at rest, captions, footer meta.
- **Night** (`{colors.night}`): Dark-theme background. **Night Secondary** (`{colors.night-secondary}`) and **Night Muted** (`{colors.night-muted}`) mirror the Paper Secondary and Paper Muted roles.
- **Hairline Dark** (`{colors.hairline-dark}`): Dark-theme border and input stroke.
- **Frost** (`{colors.frost}`), **Frost Secondary** (`{colors.frost-secondary}`), **Frost Muted** (`{colors.frost-muted}`): Dark-theme foreground, secondary-surface text, and muted text.

### Named Rules
**The One Signal Rule.** Signal Blue is the only hue on a surface at rest. Emerald appears only to acknowledge success; red only to report failure. Do not introduce a third accent.

**The Theme Parity Rule.** Every neutral has a light and a dark value, and the accent does not change. A new surface that works in only one theme is unfinished.

**The Tinted Surface Rule.** Tints of Signal Blue (5 to 15% alpha) are backgrounds for callouts and the hero wash, and text on a tint must be Ink or Frost, never Signal Blue Foreground.

## Typography

**Display Font:** Space Grotesk Variable (with ui-sans-serif, system-ui)
**Body Font:** Inter Variable (with ui-sans-serif, system-ui)
**Math / Code:** KaTeX fonts for formulas; the browser monospace stack inside Shiki code blocks

**Character:** A geometric, slightly technical display face over a neutral humanist body. Headings are always semibold (600) and never heavier; hierarchy comes from size and the eyebrow above, not from weight contrast. Ligatures, tabular numerals, and Inter's `cv11` alternate are switched on site-wide so metrics align in stat rows.

Both faces are self-hosted variable fonts from the `@fontsource-variable` packages, imported in the global stylesheet with `font-display: swap`; no third-party font host is involved.

### Hierarchy
- **Display** (600, 2.25rem rising to 3rem at the small breakpoint, line-height 1.1, tracking -0.025em): The hero title only. Centered from the small breakpoint, left-aligned on phones.
- **Headline** (600, 1.875rem rising to 2.25rem at medium, line-height 1.2): Page `h1` under the header, and the article title on posts and case studies.
- **Title** (600, 1.5rem, line-height 1.33): Section `h2` beneath an eyebrow. Writing-index hero and featured card titles step up to 1.875rem.
- **Card Title** (600, 1.25rem, line-height 1.4): `h3` inside cards, callouts, timeline entries, and patent tiles. Stat badges use 1.5rem.
- **Body** (400, 1rem, line-height 1.5): Default paragraph. **Body Lead** (1.125rem) for hero and page intros. **Body Small** (0.875rem, line-height 1.5) for card descriptions, form fields, nav, and footer. Long-form MDX inherits Tailwind typography's neutral prose scale.
- **Label** (400 or 600, 0.75rem, tracking 0.2em, uppercase): Eyebrows, card eyebrows, chip text, code-block titles, timeline dates. The hero name uses 0.875rem at 0.3em tracking; the writing hero uses 0.35em.
- **Action** (500, 0.875rem): Buttons, nav links, command-palette items.

### Named Rules
**The Eyebrow Rule.** A section opens with a Label in Slate (or Signal Blue at 80% when it sits inside a card), then a display-face heading. No section heading stands alone.

**The Two-Face Rule.** Space Grotesk for headings and the wordmark, Inter for everything else. KaTeX and code are the only exceptions.

**The Semibold Ceiling Rule.** Headings stop at 600. Emphasis inside body text uses 600 as well; 700 is not part of the system.

## Layout

A single centered column, 1152px wide (`max-w-6xl`) with 16px side gutters, holds the header, main, and footer. Main stacks sections in a 48px vertical rhythm with 48px top and bottom padding and a 60vh minimum height. Within sections, content grids use 24px gaps: three columns for case-study and post cards at the medium breakpoint, two columns for stat badges, patent tiles, and post lists, and asymmetric two-column splits (`1.2fr 1fr`, `2fr 1fr`, `1fr auto`) for panel-plus-sidebar compositions. Long-form articles are centered and capped at the prose measure of 65ch (about 656px at the 16px body size), which also bounds the article header and impact callout.

The header is sticky, 64px tall at 16px vertical padding, with the wordmark left, horizontal nav center, and a cluster of command palette, theme toggle, and outline resume button pushed right. The inline nav renders from 1024px; below that the command palette trigger is the navigation entry, icon-only until 1280px. The resume button reads "Resume" below 640px and the wordmark drops to 1rem, and the header wraps rather than overflows down to 375px. The footer mirrors the header's two-ended layout, stacking on mobile.

Spacing steps that recur: 4px (chip vertical), 8px (button vertical, inline gaps), 16px (gutters, header, timeline card padding), 24px (card padding, grid gaps), 40px (large panel padding), 48px (hero padding from the small breakpoint, 24px below it; section gap). The breakpoints used are Tailwind's `sm` (640px) and `md` (768px) for content grids, and `lg` (1024px) and `xl` (1280px) for the header only.

**Touch Floor.** On coarse pointers (Tailwind's `pointer-coarse:` variant) every standalone control grows to at least 44px: the header icon buttons and resume pill, footer channel links, and the writing filter chips. Inline text links are underlined there instead of on hover. Pointer density on desktop is unchanged, and form fields hold a 16px font below the small breakpoint so phones do not zoom on focus.

## Elevation & Depth

Flat and border-defined. Depth comes from a 1px Hairline border and from tonal layering (Paper over Paper, Paper Secondary and Paper Muted for recessed surfaces), not from shadow. The faint `shadow-sm` on cards, callouts, stat badges, and the hero is an ambient hint and never structural; cards respond to hover by translating up 4px without growing their shadow, and the primary button carries a subtle `shadow` only to separate the blue fill from the page. Backdrop blur appears on the sticky header (80% Paper) and the hero stat badges (80% Paper), and the only heavy shadow in the system belongs to the command-palette dialog over its blurred black scrim.

### Shadow Vocabulary
- **Ambient hint** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): Cards, callouts, stat badges, the hero panel, the outline command-palette trigger. Default at rest.
- **Button lift** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): The primary button and the selected chip.
- **Hover growth** (`0 4px 6px -1px rgb(0 0 0 / 0.1)` to `0 10px 15px -3px rgb(0 0 0 / 0.1)`): Writing-index cards only, paired with the 4px lift.
- **Overlay** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): The command-palette dialog.

### Named Rules
**The Hairline Rule.** A surface is defined by its 1px border. If a panel needs more separation, change its tone, not its shadow.

**The Blur Is For Floating Rule.** Backdrop blur marks a layer that sits over scrolling content (sticky header, modal scrim, hero badges on the gradient). Static panels never blur.

## Shapes

Two silhouettes: pills and soft panels. Every action is a full pill (9999px): buttons at 44px tall, chips at 24px, footer channel links, the command-palette trigger, the theme toggle (a 36px circle, 44px on coarse pointers), and the writing-index meta tags. Containers are rounded panels at 16px (`rounded-2xl`) for cards, callouts, code blocks, figures, and the command-palette dialog, stepping up to 24px (`rounded-3xl`) for page-level panels (hero, leadership arc, writing hero, contact form, closing CTA) and down to 12px for stat badges and timeline cards. Form fields use the configured radius of 13.6px (`rounded-lg`), the one place the `--radius` token is visible; the derived md (9.6px) and sm (7.6px) steps exist in config but are not used on any surface today.

Borders are 1px Hairline throughout, dropping to 60% alpha on the header and footer rules and on the code-block title bar. Dashed Hairline marks placeholders (missing contact channels, empty states). The timeline is a 1px left rule with 16px hollow circles outlined in Signal Blue. Images are clipped to the 16px panel radius with a Hairline border.

## Components

Refined and restrained: quiet surfaces, one accent, pills for actions, and state communicated by color and ring rather than motion.

### Buttons
- **Shape:** Full pill (9999px), 44px tall at 24px horizontal padding; small variant 36px tall at 16px; large 48px at 32px. Action typography (500, 0.875rem).
- **Primary:** Signal Blue fill, Signal Blue Foreground text, button-lift shadow. Hover drops the fill to 90% opacity. Used for Contact and form submit.
- **Outline:** Paper fill, 1px Hairline border, Signal Blue text (inherited from the global link rule). Hover fills Paper Muted. Used for the resume download in the header and hero.
- **Ghost:** Transparent, Signal Blue text; hover fills Paper Muted and shifts text to Ink. Used for the GitHub link.
- **Secondary:** Paper Secondary fill, Ink Secondary text; hover drops to 80%. Defined but unused on current pages.
- **Focus:** 2px Signal Blue ring with a 2px Paper offset on every variant. Disabled drops to 50% opacity with pointer events off.

### Chips
- **Style:** Pill, 1px Hairline border, Label typography (0.75rem, uppercase, 0.2em or `tracking-wide`), 4px by 12px padding. Content tags fill Paper Secondary with Ink Secondary text; filter chips and meta tags are transparent with Slate text.
- **State:** A selected filter inverts to an Ink fill with Paper text and the button-lift shadow. Hover on any chip fills Paper Muted. Dashed border marks a placeholder chip.

### Cards / Containers
- **Corner Style:** 16px for cards, 24px for page panels, 12px for stat badges.
- **Background:** Paper at 80 to 90% alpha over the page; page panels may carry a diagonal wash from Paper through 5% Signal Blue or 30 to 40% Paper Muted.
- **Shadow Strategy:** Ambient hint at rest; hover lifts 4px (and restores full Paper). See Elevation.
- **Border:** 1px Hairline.
- **Internal Padding:** 24px for cards, 40px for panels, 48px for the hero; content inside stacks on a 16px gap.
- **Anatomy:** Eyebrow (Signal Blue at 80% or Slate), card title, Body Small description in Slate, then a Signal Blue "Explore →" or "Read →" action line. Title turns Signal Blue on hover.

### Inputs / Fields
- **Style:** 44px tall, 13.6px radius, 1px Hairline stroke, Paper fill, Body Small text, 12px horizontal padding. Labels are Action-weight (500) 0.875rem in Ink above the field with an 8px gap. Textareas keep the same stroke and radius at 8px vertical padding.
- **Focus:** 2px Signal Blue ring, no offset, outline removed. The writing search field instead swaps its border to Signal Blue and adds a 40% blue ring.
- **Error / Disabled:** Not implemented on current surfaces; the contact form shows a warning note (amber tint, amber text) when CAPTCHA is unconfigured.

### Navigation
- **Style:** Horizontal row of Action-weight links in Slate, 8px padding, 8px apart, inside the sticky blurred header. Rendered from 1024px; below that the command palette is the navigation entry point.
- **States:** Hover and focus shift text to Ink and reveal a 2px Signal Blue bar below the label at 75% opacity. The active page shows Ink text and a 2px Signal Blue bar 6.4px above the label at full opacity. Bars are 58% of the link width, capped at 56px, centered, with a 150ms ease.
- **Wordmark:** "theschoonover.net" in Space Grotesk at 1.125rem semibold, Signal Blue via the link rule.

### Eyebrow Label
Label typography in Slate (or Signal Blue at 80% inside cards), uppercase, 0.2em tracking, placed 8px above its heading. The hero name variant is 0.875rem semibold at 0.3em in Signal Blue.

### Stat Badge
12px-rounded Paper panel at 80% alpha with backdrop blur, Hairline border, 24px padding, ambient shadow. A `tracking-wide` uppercase Body Small caption in Slate sits above a 1.5rem Space Grotesk value. Laid out two-up at the small breakpoint.

### Callout
16px-rounded panel, 24px padding, ambient shadow, with a Card Title and Body Small body. Tones: info (Signal Blue border at 40%, 10% blue tint), success (emerald border at 40%, 10% emerald tint, deep emerald text in light; blue tint in dark), warning (amber border and tint). Text is Ink in light and Frost in dark on every tone, per The Tinted Surface Rule.

### Command Palette
A 36px pill trigger visible at every width: a 36px icon circle below 1280px, widening to show the "Search site" label and a bordered `⌘K` keycap from 1280px. Opens, portaled to `body` so the header's blur cannot clip it, a 576px dialog (16px radius, Hairline border, overlay shadow) over a 50% black blurred scrim, with a 40px borderless search row and a list of 12px-rounded items that fill Paper Muted on hover.

### Timeline
Left-ruled list on a 1px Hairline with 16px Signal-Blue-outlined circles; each entry is a 12px-rounded Paper panel at 70% alpha with 16px padding, a Label date, a Card Title, and Body Small bullets.

### Reading Progress
A 4px Signal Blue bar fixed to the top edge, transparent track, 200ms width ease.

## Do's and Don'ts

### Do:
- **Do** open every section with an eyebrow label (0.75rem, uppercase, 0.2em tracking, Slate) followed by a Space Grotesk heading at 600.
- **Do** keep Signal Blue (#008fdb) identical in both themes and use it for links, primary fills, focus rings, active indicators, and progress.
- **Do** build surfaces as 1px Hairline-bordered panels on Paper or Night at 70 to 90% alpha, 16px radius for cards and 24px for page panels.
- **Do** make every action a pill: 44px buttons, 24px chips, 36px icon circles.
- **Do** give every interactive element the 2px Signal Blue focus ring, with a 2px Paper offset on buttons.
- **Do** keep hover feedback to a tone shift or a 4px lift; the 150 to 200ms ease is the only motion vocabulary.
- **Do** put Ink or Frost text on tinted surfaces.
- **Do** ship light and dark values together for any new neutral.

### Don't:
- **Don't** introduce a hue beyond Signal Blue, Emerald Ack for success, and Alert Red for errors.
- **Don't** use shadows as the primary depth cue; a border and a tone change come first.
- **Don't** apply backdrop blur to static panels; it belongs to the sticky header, overlay scrims, and badges floating on the hero wash.
- **Don't** set Signal Blue Foreground text on a 10% tint; the info callout once did and was unreadable in light mode.
- **Don't** use heading weights above 600 or a third typeface outside KaTeX and code.
- **Don't** fall back to square corners; the smallest radius in use is 12px on badges, and only form fields use the 13.6px token.
