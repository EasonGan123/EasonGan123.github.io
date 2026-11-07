# Build Prompt: Eason Gan Portfolio

Paste everything below this line into Claude Code, from an empty project folder. Put `Eason_Gan_Resume.pdf` in the folder first.

---

You are a senior creative developer and UI/UX designer (think Awwwards Site of the Day level). Build my personal portfolio website. It must be **simple, professional, and unforgettable**: a recruiter should understand who I am in 10 seconds, and remember the site a week later because of one signature interaction.

Before writing code, read this whole brief, then give me a short build plan (file structure, libraries, phases). Ask me only questions that genuinely block you. Then build it phase by phase.

## 1. Who I am (positioning)

**Eason Gan.** Founder who builds products people actually use, backed by data and business rigor.

* UC Berkeley: B.S. Business Administration (Haas, Spieker Program) and B.A. Data Science, GPA 4.0/4.0, expected May 2030
* Grew up across Shanghai, Hong Kong, London (Westminster School), now Berkeley
* Languages: English, Mandarin, Cantonese (fluent); German, Spanish (conversational)

**Hero one-liner (use as is, or propose 2 alternatives):**
"I build products people show up for. 25,000+ users, zero ad spend."

**Sub line:** Founder · Haas Spieker + Data Science @ UC Berkeley

## 2. Content (source of truth: my resume PDF in this folder)

Store all content in one typed file, `content/site.ts`, so I can edit text without touching components.

### Headline metrics (count up on reveal)
* **25,000+** active users on Pickup Games
* **20M+** views at near zero CAC, no paid ads
* **2,000+** students across 5 countries on HandsOnExams
* **Gold Medal**, Geneva International Exhibition of Inventions (top 10 of 800+)

### Work (case studies, in this order)
1. **Pickup Games**: Co-Founder & CEO, Feb 2025 to present. Two-sided sports marketplace in Hong Kong. 25,000+ users. Sponsors: Red Bull, Li-Ning, Kelme, Passion24. 20M+ views, 5M+ unique accounts via 15+ creators (2.5M+ combined followers), 100% organic. Expanding to U.S., Portugal, Brazil, Australia.
2. **HandsOnExams**: Co-Founder, Oct 2024 to present. All-in-one exam prep (past papers, notes, tutor network, AI study tools). 2,000+ students, 5 countries, +45% retention from 100+ feedback cycles. Partnerships incl. Millie Group.
3. **Tourvista**: Founder, Apr 2023 to Jun 2024. Multimodal AI travel recommender. SOLAR model + custom RL module, +75% accuracy vs baseline, 78% of pilot users rated recs relevant. OFEED Gold Medal for European Innovation, Geneva.
4. **Fine and Rare**: Strategy & Product Consultant, May to Aug 2024. Diagnosed funnel drop off for a luxury wine and spirits retailer; led a 6-person team to prototype an AI conversational assistant; projected +20% online conversion; presented to senior leadership.
5. **Pickup For Good** (Community): Founder, Mar 2025 to present. $9,500+ raised for underserved youth sports; 500+ students; 10+ recurring clinics across 5 cities in HK, Mainland China, Thailand. Partner: Save the Children HK.

Each case study uses the same structure: **Problem → What I did → Result (big number)**. Keep each to under 80 words on the card, longer in the expanded view.

### Skills
Python, SQL, React, Excel, PowerPoint, RAG, Reinforcement Learning.

### Off the clock
Soccer (Inter Milan Academy), Muay Thai, Surfing, Hiking (Dragon's Back, Lion Rock).

### Contact
eason.gan@berkeley.edu · linkedin.com/in/eason-gan · Resume PDF download. **Do not publish my phone number.**

## 3. The signature idea: "Every dot is a person"

The whole site is driven by one living particle field. It is the thread that ties the story together and the thing recruiters will remember. It also quietly signals Data Science without saying it.

1. **Hero:** ~6,000 particles drift in, then assemble into **EASON GAN** in large type. Cursor gently repels particles within a radius; they spring back with easing. On mobile, use device tilt or a slow ambient drift instead of cursor.
2. **Scroll 1, "The journey":** the same particles release from the letters and re-form into a minimal dotted world map. An animated line traces **Shanghai → Hong Kong → London → Berkeley**, with tiny mono labels and years. Then four pulse dots light up for Pickup's expansion markets (U.S., Portugal, Brazil, Australia).
3. **Scroll 2, "Scale":** particles collapse into a dense grid while a counter reads **25,000**. Caption: "Each dot is a Pickup Games player." (Scale visually; it does not need to be literally 25,000 particles.)
4. **Footer:** particles re-form into **Let's talk.** with my email beneath.

Everything between those moments stays calm, white space heavy, and typographic, so the canvas feels special rather than noisy.

**Implementation:** one persistent full-viewport WebGL canvas (three.js `Points` with a custom shader, or OGL) fixed behind the content. Target positions for each "scene" are precomputed (text sampled from an offscreen 2D canvas, map from a small lat/long point set, grid computed). Scroll progress (GSAP ScrollTrigger) interpolates between target sets. Particle count adapts to device (about 6k desktop, 2.5k mobile). Must hold 60fps on a MacBook Air and be smooth on a mid-range iPhone.

## 4. Page structure (single page, plus case study overlays)

1. **Preloader** (max 1.2s): a mono counter `000 → 100`, then splits away. Skip on repeat visits (sessionStorage).
2. **Hero:** particle name, one-liner, sub line, two buttons: `View work` and `Resume ↓`. Small status pill top right: "Open to Summer 2027 internships" (make this editable in `site.ts`).
3. **10-second read:** 4 metric tiles in a row, numbers count up when in view.
4. **Journey:** pinned scroll section with the map scene.
5. **Selected work:** 5 project rows. Each row: big index number (01 to 05), name, role, one-line result. On hover (desktop), the row expands slightly, the result number scrambles in (text decode effect), and a subtle image or abstract preview follows the cursor. Click opens a full-screen case study overlay with shared layout transition (Framer Motion `layoutId`), Problem / What I did / Result, and Esc to close.
6. **Scale moment:** the 25,000 grid scene.
7. **Toolkit & life:** skills as a quiet list; interests as a slow horizontal marquee.
8. **Contact:** particles form "Let's talk."; giant email that copies to clipboard on click with a "Copied" micro toast; LinkedIn and resume links.

Nav: minimal fixed top bar with `EG` monogram left, `Work · About · Contact` right, plus a local time readout ("Berkeley 8:14 PM"). It hides on scroll down, returns on scroll up.

## 5. Visual design system

* **Mood:** editorial, quiet, confident. Swiss grid meets product polish. Not a template, not a dark neon "dev" site.
* **Colors:** background warm off-white `#F4F2EE`, ink `#0E0E0E`, muted text `#6B6B6B`, hairlines `#0E0E0E` at 10% opacity, one accent `#FF4D1A` (signal orange) used sparingly: active states, the route line, the cursor dot. Provide a dark mode (ink `#0E0E0E` background, `#F4F2EE` text, same accent) that respects system preference with a toggle.
* **Type:** `Inter Tight` or `Geist` for UI and headlines (tight tracking, very large display sizes using `clamp()`), `Instrument Serif` italic for 1 or 2 accent words per section (for example "people *show up* for"), `Geist Mono` or `JetBrains Mono` for labels, metrics captions, dates, and coordinates.
* **Layout:** 12-column grid, generous margins, lots of white space. Section labels in mono like `[02] JOURNEY`.
* **Details that signal craft:** custom cursor (small dot that grows into a ring on interactive elements, with "View" text on project rows), magnetic buttons, link underlines that draw in from left, film grain overlay at 3% opacity, smooth scroll via Lenis.

**Style references** (take the spirit, do not copy layouts):
* rauno.me and emilkowal.ski: interaction craft and restraint
* paco.me: minimalism and typography
* brittanychiang.com: recruiter-friendly clarity
* linear.app: product-level polish and motion timing
* lusion.co: how a single WebGL idea can carry a site

## 6. Motion rules

* Easing: custom `cubic-bezier(0.22, 1, 0.36, 1)` for reveals; springs for interactive elements.
* Text reveals: lines slide up from a mask, staggered 40 to 60ms. Never animate more than one big thing at a time.
* Durations: UI 200 to 400ms, section reveals 700 to 900ms, scene morphs tied to scroll.
* `prefers-reduced-motion`: disable particle morphs (show static final states), disable smooth scroll, keep simple fades only.
* Nothing should block reading. Content must be visible and usable even if WebGL fails (fallback to static SVG name and map).

## 7. Tech stack

* Next.js (App Router) + TypeScript + Tailwind CSS
* Framer Motion for UI and layout transitions
* GSAP + ScrollTrigger for scroll-linked scenes, Lenis for smooth scroll
* three.js (or OGL) for the particle field, loaded dynamically, client only
* `next/font` for fonts, `next/og` for a custom Open Graph image (name + one-liner on the off-white background)
* Deploy target: Vercel. Include a `README.md` with run and deploy steps.

## 8. Quality bar (non negotiable)

* Lighthouse: Performance ≥ 90 mobile, Accessibility ≥ 95, SEO 100.
* LCP under 2.0s: the hero text must render as real HTML first; the particle canvas fades in on top.
* Fully responsive at 375, 768, 1280, 1440, 1920 widths. Mobile gets the same story with simplified scenes, not a broken desktop.
* Semantic HTML, keyboard navigable, visible focus states, alt text, color contrast AA.
* Metadata: title "Eason Gan | Founder, UC Berkeley Haas & Data Science", description, OG and Twitter cards, favicon from the `EG` monogram.
* Resume served at `/resume.pdf`.
* No lorem ipsum anywhere. No em dashes in any site copy.

## 9. How to work

1. Plan, then scaffold the project and design tokens.
2. Build static content and layout first (fully readable with zero animation).
3. Add the particle system and its four scenes.
4. Add micro-interactions, cursor, overlays, preloader.
5. Polish: performance, reduced motion, mobile, dark mode.
6. Verify: run the dev server, take Playwright screenshots at mobile and desktop widths for each section, review them yourself, fix anything off, run Lighthouse, and report scores.

After each phase, give me a 3-line summary and what you will do next. At the end, list anything I should personalize (photos, status pill, extra projects like ClearCare or Matchbook).
