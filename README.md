# Aman Chhetri – Portfolio

Personal portfolio site for Aman Chhetri, Master of Data Science student at Macquarie University: data analysis (Python, SQL, R) and full-stack web development.

## Tech stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS with shadcn/ui-style components (Radix Slot, class-variance-authority)
- next-themes for light and dark mode, lucide-react icons
- Deployed on Vercel

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Editing content

All text lives in `data/profile.ts`: profile, skills, experience, projects, education and certifications. Add a new project to the top of the `projects` array and redeploy.

## Project structure

```
app/            layout, page and global styles
components/     header, theme toggle, notebook cell, section wrapper
components/ui/  button, card and badge components
data/           site content
public/         resume PDF
```
