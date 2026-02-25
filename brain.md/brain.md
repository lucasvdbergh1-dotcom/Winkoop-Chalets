# 🧠 CORE BRAIN - High-Precision Web Engine
> Focus: Pixel-perfect reconstruction, portable code, and self-correcting workflows.

## 1. Core Philosophy: "Zero-Waste Code"
- **Cleanliness:** Every class and every line of JS must serve a purpose. Remove redundant code immediately.
- **Portability:** HTML must be fully 'self-contained' (inline styles/scripts) for maximum compatibility with platforms like GHL or WordPress.
- **Integrity:** Match the reference exactly. "Improving" it is forbidden, unless explicitly requested.

## 2. The "Self-Correction" Loop (Agentic Workflow)
Use the following steps for EVERY component you build:

1. **Plan & Build:** Use Stitch MCP to generate `index.html` with Tailwind CDN.
2. **Visual Check (The Loop):** 
   - Take a screenshot with Puppeteer (`npx puppeteer screenshot index.html --fullpage`).
   - Compare this screenshot with the source image on: spacing (px), font weights, colors (HEX), and alignment.
   - **Fix & Repeat:** Correct mismatches and repeat the check at least 2 times.
3. **Clean-Up (Self-cleaning):** 
   - Run a pass to remove unused Tailwind classes.
   - Sort Tailwind classes according to the standard (Layout -> Flex/Grid -> Spacing -> Sizing -> Typography).
   - Minimize DOM nesting; keep the structure as flat as possible.

## 3. Technical Requirements & Validation
- **Stack:** HTML5, Tailwind CSS (via Play CDN), Vanilla JavaScript.
- **Responsive:** Mobile-first is mandatory. Test breakpoints via Puppeteer if necessary.
- **Images:** Use `https://placehold.co/` for missing assets.
- **Linting:** Manually check for syntax errors or unclosed tags before delivery.

## 4. Instructions for the AI
- Always use a `<thought>` block to analyze the comparison between the screenshot and the original. Be specific (e.g., "Button padding is 12px, should be 16px").
- After every successful correction round, update the `memory/progress.md`.
- Do not archive old code versions in the active file; keep `index.html` clean and up-to-date.