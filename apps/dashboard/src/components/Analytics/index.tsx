
import { App } from 'queries/types'
import Board from './Board'
import AnalyticsSidebar from './Sidebar'


export interface Props {
  app: App
}

function Analytics({ app }: Props) {
  return (
    <div className="flex flex-1">
      <AnalyticsSidebar />
      <Board app={app}></Board>
    </div>
  )
}

export default Analytics
