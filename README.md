# Devbook UI
Monorepo for all Devbook's webapps and packages.

## Development

This whole repo is a pnpm **workspace** that has multiple **packages** in the [`apps/`](./apps/) and [`packages/`](./packages) subdirectories.

### Initial installation
In the top directory run `pnpm install` to install deps in all packages.

### Installing dependencies
Run `pnpm install <deps>` in any subdirectory to install the dependencies there.

Run `pnpm install <deps> --filter <package-name-or-regex>` to install dependencies in specified packages.

> https://turbo.build/repo/docs/core-concepts/monorepos/filtering

### Developing
Run `pnpm dev` to start watching and compiling all changes in this monorepo.

### Commands overview
- `pnpm install` - Install dependencies for all packages and app
- `pnpm build` - Build all packages and apps
- `pnpm dev` - Develop all packages and apps
- `pnpm lint` - Lint all packages
- `pnpm changeset` - Generate a changeset (it will guide you)
- `pnpm version-packages` - Create changelog from the changeset and increment packages' versions accordingly
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Deployment
Run `pnpm changeset` to mark packages you want to release then run `pnpm version-packages` and commit the resulting changes. Marked packages will be published when you push to `master`.

**If the deployment fails don't run the previous commands again, just fix the error and push to `master`.**

## Improvement
Check how to handle internal packages
https://github.com/formbricks/formbricks/blob/main/packages/react/package.json
 