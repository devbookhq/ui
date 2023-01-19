
import { App } from 'queries/types'
import AnalyticsSidebar from './Sidebar'


export interface Props {
  app: App
}

function Analytics({ app }: Props) {
  return (
    <div className="flex flex-1">
      <AnalyticsSidebar />
      <Board />
    </div>
  )
}

export default Analytics
