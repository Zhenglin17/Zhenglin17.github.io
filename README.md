# Zhenglin Zhang — Personal Website

Source for [zhenglin17.github.io](https://zhenglin17.github.io).

- **TL;DR** (`/tldr`) — a quick overview of my projects and skills.
- **Full Story** (`/story`) — my life drawn as a mountain climb, from elementary school to today.

## Tech stack

Next.js (App Router, static export) · React · TypeScript · Tailwind CSS v4 · Framer Motion

## Development

```bash
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static export to out/
npm run lint
```

The site is fully static: `npm run build` writes plain HTML/CSS/JS to `out/`, so there is no Node server at runtime (`npm start` is not used).

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages.
