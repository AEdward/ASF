# ASF Agro Industry — Next.js + TypeScript + Tailwind + Strapi

A production-oriented starter for the ASF Agro Industry website.

## Stack
- Next.js + TypeScript
- Tailwind CSS v4
- Strapi 5 CMS for dashboard/content management
- SQLite for local Strapi development

## Project structure
```
apps/web  # public website
apps/cms  # Strapi admin + API
```

## 1. Start Strapi
```bash
cd apps/cms
cp .env.example .env
# Put secure random values into .env
npm install
npm run develop
```
Open `http://localhost:1337/admin` and create the first administrator.

On first boot, `apps/cms/src/index.ts` seeds Site Settings, Products and Articles with
the real ASF company-profile content, and opens public read access (`find`/`findOne`)
on those three content types so the website can render without any API token. Both
steps are idempotent — they skip themselves once content already exists.

Edit any of that content from the admin dashboard at any time; the website picks up
changes within 60 seconds (ISR revalidation).

## 2. Start Next.js
```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000`. If Strapi isn't running, pages fall back to the same
real content baked into `apps/web/lib/content.ts`, so the site still renders correctly.

## CMS models
- **Article** — blog posts, categories, excerpt, rich text and cover image.
- **Product** — products/services, status, description, details and image.
- **Site Settings** — company contacts, addresses, hero copy, mission/vision and
  production stats shown on the homepage.

Home, About, Products, Blog and Contact all fetch live from these three content
types via `apps/web/lib/strapi.ts`.

## Deployment
Deploy `apps/web` to Vercel or another Node host. Deploy `apps/cms` to a Node-compatible server or managed Strapi host. Set `STRAPI_URL` (and `SITE_URL`, for sitemap/OG tags) on the Next.js deployment to the public URLs. For production, switch Strapi from SQLite to PostgreSQL and use strong generated secrets.
