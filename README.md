# Devbook UI
Monorepo for all Devbook's webapps and packages.

## Development
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
 