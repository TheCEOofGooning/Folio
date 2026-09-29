# Folio

A fast, typography-first publishing platform built for **Next.js App Router + Vercel + Neon PostgreSQL**. Folio includes custom Web Crypto authentication, Markdown publishing, drafts, discovery, likes, bookmarks, comments, creator analytics, reading progress, responsive dark mode, and a zero-ORM data layer.

## Architecture

```text
Browser
  ├─ React Server Components (most pages; almost no browser JS)
  ├─ Server Actions (auth and publishing)
  └─ tiny client islands (theme, editor, reading controls)
         │
Next.js on Vercel
  ├─ HTTP-only HMAC session cookie
  ├─ Web Crypto PBKDF2 password hashing
  └─ parameterized raw SQL
         │ HTTPS
Neon serverless PostgreSQL (stateless HTTP driver; no connection pool exhaustion)
```

No ORM, auth SDK, Node crypto package, or persistent database connection is used. `@neondatabase/serverless` sends parameterized SQL over HTTP and is safe for Vercel's elastic runtime.

## Directory map

```text
app/
├── (auth)/login, register       # auth pages
├── (main)/dashboard             # post metrics and management
├── (main)/settings              # creator profile
├── (main)/write                 # editor / edit existing post
├── api/posts/[id]/              # likes, bookmarks, comments, views
├── api/search                   # cached lightweight search endpoint
├── p/[slug]                     # distraction-free reader
├── actions.ts                   # validated server mutations
├── globals.css, layout.tsx      # design system and shell
└── page.tsx                     # feed, tags, search
components/                      # focused server/client UI components
db/schema.sql                    # idempotent PostgreSQL schema
db/migrate.mjs                   # tiny migration runner
lib/auth.ts                      # PBKDF2 + signed sessions
lib/db.ts                        # one zero-ORM query utility
lib/posts.ts                     # feed query and graceful demo content
```

## Run locally — step by step

### 1. Install the tools

Install [Node.js 20 or newer](https://nodejs.org/) and Git. In a terminal, check them:

```bash
node --version
git --version
```

### 2. Download and install

```bash
git clone https://github.com/TheCEOofGooning/Folio.git
cd Folio
npm install
```

### 3. Create a free Neon database

1. Visit [console.neon.tech](https://console.neon.tech), create an account, and click **New project**.
2. Any region and the default PostgreSQL version work.
3. On the project dashboard, click **Connect**.
4. Copy the connection string. It starts with `postgresql://` and ends in `sslmode=require`.

### 4. Add secrets

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` in any text editor. Paste the Neon connection string after `DATABASE_URL=`. Generate an authentication secret:

```bash
openssl rand -base64 32
```

Paste its output after `AUTH_SECRET=`. Your file should resemble:

```dotenv
DATABASE_URL=postgresql://alex:secret@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=a-long-random-value-that-nobody-else-knows
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never publish this file or put its values in GitHub. It is already ignored by Git.

### 5. Create the tables

The migration command reads `.env.local` only when loaded into the shell. The easiest cross-platform option is to paste `db/schema.sql` into Neon's **SQL Editor** and press **Run**.

Alternatively, run this command on macOS, Windows, or Linux:

```bash
npm run db:migrate
```

You should see `Folio database ready`.

### 6. Start Folio

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account, open **Write**, and publish your first story. The homepage includes sample editorial cards when a database is unavailable or has no posts so the visual experience is never blank.

## Deploy on Vercel — beginner-friendly

1. Push the project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), choose **Import Git Repository**, and select Folio.
3. Keep **Framework Preset: Next.js** and all build settings at their defaults.
4. Expand **Environment Variables** and add:
   - `DATABASE_URL` — the full Neon connection string.
   - `AUTH_SECRET` — a newly generated 32+ character secret. Do not reuse a password.
   - `NEXT_PUBLIC_APP_URL` — initially `https://your-project-name.vercel.app`.
5. Apply each variable to Production, Preview, and Development, then click **Deploy**.
6. If the tables were not created in step 5 above, open Neon’s SQL Editor, paste `db/schema.sql`, and run it once.
7. After Vercel provides the final URL, correct `NEXT_PUBLIC_APP_URL` in **Project → Settings → Environment Variables** if needed and redeploy.

That is all—there is no always-on API server to configure and no database pool sizing required.

## Production checklist

- Use separate Neon branches/databases for preview and production deployments.
- Keep `AUTH_SECRET` stable after launch; changing it signs everyone out.
- Enable Vercel Web Analytics if desired (it is intentionally not bundled here).
- Add a custom domain, then set `NEXT_PUBLIC_APP_URL` to that HTTPS domain.
- Neon automatically requires TLS. Never expose `DATABASE_URL` through a `NEXT_PUBLIC_` variable.
- Run `npm run typecheck && npm run build` before pushing.

## Security and performance notes

- Passwords use PBKDF2-SHA-256 with 210,000 iterations and a unique 128-bit salt.
- Sessions are signed with HMAC-SHA-256 and stored in Secure, HTTP-only, SameSite=Lax cookies.
- Every SQL value is parameterized. Mutations verify ownership server-side.
- Pages use Server Components by default; Framer Motion and Radix load only in small interactive islands.
- Variable Inter and Playfair Display fonts are self-hosted with Fontsource; images are optimized by `next/image`.
- Feed/API caching uses Vercel-compatible cache headers while personalized pages are dynamically rendered.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | local development |
| `npm run typecheck` | strict TypeScript validation |
| `npm run build` | production build test |
| `npm run start` | run the built app |
| `npm run db:migrate` | apply the idempotent SQL schema from `.env.local` |
