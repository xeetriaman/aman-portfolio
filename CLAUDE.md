# aman-portfolio

Aman Chhetri's portfolio (Next.js 14, Tailwind, deployed on Vercel). A private `/admin` area is planned.

## Skills to use

Project skills live in `.claude/skills/`. Use them on every UI or code change:

- `design-taste-frontend` (Leonxlnx/taste-skill): art direction. Read the brief first, pick one design language.
- `impeccable` (pbakaus/impeccable): typography, spacing, layout, and a design audit before finishing.
- `emil-design-eng` (emilkowalski/skills): motion and polish. Animate only where it helps.
- `karpathy-guidelines` (multica-ai/andrej-karpathy-skills): simple code, surgical changes, verifiable goals.

## Rules

- Keep code plain and readable: small components, clear names, no dead code, no new dependency without a reason.
- Change only what the task needs. Keep the existing look of the public site unless asked.
- Before pushing UI work: run `npm run build`, then screenshot the changed pages with Playwright (headless Chrome) at 375px and 1440px widths and check them.
- Never commit secrets. Supabase keys go in Vercel environment variables.
- Do not mention AI assistance in READMEs or on the site.
