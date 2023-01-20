import { App } from 'queries/types'

export interface Props {
  app: App
}

const prismaDashboard1 = 'https://app.posthog.com/embedded/4y9vkAwdqMDSBh-YFuFe2z72UtpChw'
const prismaDashboard2 = 'https://app.posthog.com/embedded/IhjGWmJHyE1Usx26r01voRhGqTJ-ZQ'

function Board({ app }: Props) {
  return (
    <div className="flex flex-1 h-full w-full bg-slate-100">
      {/* <iframe width="100%" height="100%" frameBorder="0" src="https://usedevbook.com"></iframe> */}
      <iframe name="My" width="100%" src="https://app.posthog.com/embedded/4y9vkAwdqMDSBh-YFuFe2z72UtpChw"></iframe>
      {/* <PostHogEmbed url={prismaDashboard1} name="Analytics1" /> */}
      {/* <PostHogEmbed url={prismaDashboard2} name="Analytics2" /> */}
    </div>
  )
}

export default Board
