# Devbook Builder

## Setup

**Node.js 16.x** is preferred for development in this repository.

Run the following command after you clone the repo to **install dependencies**:

```bash
yarn
```

The project uses the following **environment variables**:

1. `SUPABASE_SERVICE_ROLE_KEY` _(required)_

2. `NEXT_PUBLIC_SUPABASE_URL` _(required)_

3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` _(required)_

## Development

Run the following command to start a **local Next.js server that reloads**:

```bash
yarn dev
```

To automatically lint and fix errors according to ESLint run:

```bash
yarn fix
```

To analyze client and server bundle sizes run:

```bash
yarn analyze
```

## Deployment (Vercel)

The app is **automatically deployed** to production via _Vercel_ when you push a new commit to the **master** branch. When you push commit any other branch you can view the preview deployment via _Vercel_ too.
