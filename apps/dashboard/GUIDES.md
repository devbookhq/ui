# Self-serve guides (DRAFT)


## Why not use separate repos with Vercel deployment for self-serve
- If we need to change something in the guides, we have to update all repos.
- There is a limit of 60 Vercel projects per repository (if we want to deploy everything from one repo).
- User pushing content would probably mean a new deployment on Vercel (takes minutes + limits on Vercel, 2000 per month, 12 concurrent).
- Managing multiple repos could have a high overhead for us.
- We still probably need to store the content data in our DB - connecting our internal deployment repo with the content repo seems too complex.


## Proposed workflow
- One guides site per project.
- Project is created through the CLI or Dashboard.

- There will either be a `projectID` saved somewhere in the content repository or you need to specify it when using the GitHub App/CLI.
- The content and envs will be in the same repository, that is completely controlled by user.
- Managing of envs will be through the CLI - we should improve the workflow so it can be used with CI/CD.
- Content will also be managed with the CLI.
- There will be GitHub App that will internally use the CLI to manage envs and content. We can also easily add GitHub Action workflow that uses the CLI.

- We can improve the id of the envs if we associate the envs in the repo with the project - the `projectID` will be included in all the envs and the only thing you are specifying would be a project specific ID that could look like a path, e.g., `guides/migrations-delete`.

- There would be a `devbook guides/content/?` CLI command, that could be used for jumpstarting the content creation - creating blank guides, adding steps, etc. So the user does not have concern himself with copying the MDX headers, etc. This could also be used for reconfiguring which env the guide uses.
- You would use the CLI to deploy the changes in the guides (or the GitHub App would use in internally).

- Guides' style customization could be also stored in the repo or just in our DB. 

- When you push the guides' content through the CLI this happens:
  - The MDX and configs are processes and serialized to a hydratable format.
  - The serialized content is inserted/updated to our DB.
  
- We handle all the guides internally with a single Vercel deployment.
- This deployment uses [Wildcard domains](https://vercel.com/blog/wildcard-domains) to handle separate projects.
- We use static paths (because of SEO, crawlers, performance) - by default no path are specified, but we use the `fallback: true` option. This way, if a guide is accessed for the first time, if fetches the serialized content from the DB and displays it. Requests for the same guide later are cached. 
  - https://vercel.com/docs/concepts/incremental-static-regeneration/overview
  - https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
- This way we eliminate build time on content deployment and also reduce the redeployment time of our internal project handling the guides, because we dont have to build the static pages on each deploy.
- Updating the content after the guide was already cached is done via revalidation - either in a fixed interval, or by triggering it manually after an insert/update of the content in the DB. We can do this via the Supabase functions triggers. (Vercel deno SDK?)
  - https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation
- We may want to use the edge or serverless runtime Vercel later, so all our trafic is not handled by a single node server - edge runtime do not support incremental regeneration yet though, so probably serverless (check more in-depth).

- To allow a good DX when working with guides/content we can create and package a special build of the internal nextjs project that handles the guides. This build would we downloaded by the CLI (and kept up to date).
- When you work on the content locally you use `devbook guides dev` command. The CLI would then start the built nextjs project and also start watching and serving the serialized guides' content on a predefined endpoint.
- The build project would have a page with server side props that fetch the content from the local endpoint where the CLI serves the guides' content.
- We can also add a mechanism that allows the CLI to force-refresh the served page - the experience creating the MDX content could be better than what we had in prisma-hub - no manual reloading required. The build will be also faster than the dev version we developed with.
- If we allow some basic styling via a file in the repository, that could be handled by the special build too.

- Collecting analytics works alright because we add the projectID (+ we could allow users to selectively enable their own destinations like GA) to the page when it is build.

- We should report deploys (and their errors) through the dashboard/CLI - we can forward the errors from the static props handler (it is server side).
- We should also switch to Node18 and use the Nextjs 13 features because now we can make the switch easier.
