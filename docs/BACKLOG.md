# Website and admin backlog

One item per week, top first. Tick an item with the date when it ships.
Every item: follow CLAUDE.md, run `npm run build`, screenshot changed pages at 375px and 1440px, respect reduced motion.

- [x] (2026-11-24) **Upgrade to the latest stable Next.js and React.** Follow the official upgrade guide and codemods, fix breaking changes (for example async `params`, `cookies()` and `headers()`), update `@supabase/ssr` if needed, and check every public page and the admin still work.
- [x] (2026-11-24) **Modern project cards on the home and projects pages.** Use Watermelon UI components if they install cleanly through its shadcn registry in TypeScript + Tailwind (check each component's dependencies first); otherwise build the same effect with Tailwind and `motion`. Each card shows the project question, one headline result number from its data JSON, skill tags and a subtle hover. Creative but clean, matching the site's existing design language.
- [x] (2026-11-24) **Admin overview stat cards.** A top row of animated stat cards: applied this week, queued, replies, response rate, jobs closing in the next 3 days, recruiters due a follow-up. Count-up numbers (React Bits or Watermelon UI), all values live from Supabase.
- [x] (2026-11-24) **Admin jobs filters.** Filter and sort jobs by status, board, chance and closing date, with a "closing soon" badge.
- [x] (2026-11-24) **Admin recruiters.** A "follow-up due" list and clear status chips.
- [x] (2026-11-24) **Admin charts.** Already covered: the Pipeline strip on the admin home and the skills-gap bars on the Skills page.
- [ ] **Projects filter by skill** (worth it once there are 8+ data projects; until then the cards are enough) (SQL, Python, forecasting, statistics and so on).
- [x] (2026-11-28) **Home page polish.** One tasteful motion moment in the hero and a clear "what I can do for your team" section. The hero already had its text reveal; added the section, four strengths each linked to the project that proves it.
- [ ] **Performance and accessibility audit.** Run the impeccable audit and Lighthouse on the main pages and fix the top issues.
- [ ] **Resume and contact section polish.** Clear download button, LinkedIn and GitHub links, work rights stated plainly.
