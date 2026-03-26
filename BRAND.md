# Skill Shope Brand Guidelines

## Identity

**Name:** Skill Shope
**Tagline:** Where builders share the tools that make AI work
**Mascot:** Bunny (logo)
**Founded:** 2026

## Voice & Tone

- **Warm and community-focused** — we're builders helping builders
- **Direct, not salesy** — state value clearly, don't oversell
- **Security-first** — every mention of tools includes the trust angle
- **Inclusive** — free and paid, original and community, beginner and expert
- Never say "get paid" or lead with monetization — lead with quality and community

## Colors

### Dark Mode (default)
- Background: `#0a0a0a`
- Secondary: `#111111`
- Card: `#161616`
- Text: `#D1D2BD` (warm sage)
- Text secondary: `#888888`
- Accent: `#4a5d4f` (olive green)
- Accent hover: `#303A34`
- Border: `#222222`

### Light Mode
- Background: `#EFEDE5`
- Secondary: `#E5E3DB`
- Card: `#F5F4EE`
- Text: `#1a1e1b`
- Text secondary: `#4a4e4b`
- Accent: `#3a4d3e`
- Border: `#D5D3CA`

## Typography

- **Hero headings:** Jacques Francois (serif)
- **Everything else:** Space Grotesk (sans-serif)
- System fallback: `system-ui, -apple-system, sans-serif`

## Logo

- Dark mode: `logo-dark.svg` (sage/light colored)
- Light mode: `logo-light.svg` (dark colored)
- Always use SVG for clarity at any size
- On dark accent backgrounds (buttons), always use dark mode logo

## UI Patterns

- Rounded corners: `rounded-xl` for cards, `rounded-lg` for buttons/inputs
- Border style: `border-[var(--border)]` — subtle, not heavy
- Hover: border shifts to accent color at 40% opacity
- Cards: `bg-[var(--bg-card)]` with border
- Accent-soft background: `rgba(accent, 0.15-0.2)` for badges and highlights
- Security shields: green (90+), yellow (70-89), red (<70)

## Animation

- Aurora effect in hero section (olive green waves)
- No starfield — clean, minimal motion
- Transitions: `transition-colors` on interactive elements
- No aggressive animations — subtle and purposeful

## Content Rules

- Every skill page has a security section
- Every card shows a security shield
- Community skills always credited to original author
- "Verified" badge = admin reviewed. "Security shield" = automated scan.
- Footer always includes security disclaimer
