# Devbook Dashboard

## Setup
**Node.js 14.x** is preferred for development in this repository.
> **_NOTE:_** Everything will probably work even with Node.js 16, but the latest version of Node.js on *Vercel* is 14.

Run the following command after you clone the repo to **install dependencies**:
```bash
yarn
```

The project uses the following **environment variables**:

1. `SUPABASE_SERVICE_ROLE_KEY` *(required)*

2. `NEXT_PUBLIC_SUPABASE_URL` *(required)*

3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(required)*


## Development
Run the following command to start a **local Next.js server that reloads**:
```bash
yarn dev
```

To automatically lint and fix errors according to ESLint run:
```bash
npm run fix
```

To analyze client and server bundle sizes run:
```bash
npm run analyze
```

## Deployment (Vercel)
The app is **automatically deployed** to production via *Vercel* when you push a new commit to the **master** branch. When you push commit any other branch you can view the preview deployment via *Vercel* too.

The app is deployed on https://dash.usedevbook.com