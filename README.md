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

## Deployment: Strapi CMS on Railway, website on Render

### CMS → Railway
1. Railway dashboard → **New Project** → **Deploy from GitHub repo** → pick this repo.
2. On the new service → **Settings** → **Root Directory** → `apps/cms`. `apps/cms/railway.json` sets the build/start commands.
3. Add a **Postgres** database to the project (**New** → **Database** → **PostgreSQL**). Railway injects `DATABASE_URL`.
4. On the CMS service → **Variables**, add:
   - `DATABASE_CLIENT=postgres`
   - `DATABASE_URL` → reference the Postgres plugin's `DATABASE_URL` variable
   - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET` → generate strong random values for each (never reuse the `.env.example` placeholders)
   - `HOST=0.0.0.0` (Railway sets `PORT` itself; `config/server.ts` already reads it)
5. Deploy. Once live, open `https://<your-cms>.up.railway.app/admin` and create the first administrator. The bootstrap seed and public permissions run automatically on first boot (see above).
6. Copy the CMS's public Railway URL — the website needs it next.

### Website → Render
1. Render dashboard → **New** → **Blueprint** → pick this repo. Render reads `render.yaml` at the repo root and creates the `asf-agro-web` service with root directory `apps/web` automatically.
2. On that service → **Environment**, set:
   - `STRAPI_URL` → the CMS's Railway URL from step 6 above
   - `SITE_URL` → this Render service's own public URL (used for the sitemap and Open Graph tags)
3. Deploy. Render runs `npm install && npm run build` then `npm run start`.

If you'd rather deploy without the `render.yaml` blueprint, a plain **Web Service** pointed at root directory `apps/web` with the same build/start commands and env vars works the same way.
