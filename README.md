# Chen Judy's Personal Website

🔗 **https://witch-judy.github.io/chenjudy.dev/**

My personal website, built with [Astro](https://astro.build/) and deployed on GitHub Pages.

## About

I'm Chen Judy (陈小爷) — builder, influencer, and co-founder of ILLUCIO. I live at the intersection of technology, product, and growth.

This website hosts my portfolio, creative works, and blog.

## Project Structure

```
├── public/               # Static assets (images, photos)
│   └── assets/          # Personal photos
├── src/
│   ├── assets/          # Icons and images
│   ├── components/      # UI components (Hero, Projects, Contact, etc.)
│   ├── data/blog/       # Blog posts in Markdown
│   ├── i18n/            # Bilingual support (EN/中文)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes and pages
│   └── styles/          # Global styles
├── astro.config.ts      # Astro configuration
└── package.json         # Dependencies and scripts
```

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the build locally |

## Deployment

Deployed on GitHub Pages. Pushes to `main` trigger automatic builds via GitHub Actions.

## Special Thanks

Special thanks to [Sat Naing](https://satnaing.dev/) for creating the excellent [AstroPaper](https://github.com/satnaing/astro-paper) theme that served as the foundation for this website.
