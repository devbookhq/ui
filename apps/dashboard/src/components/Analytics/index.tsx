import { App } from 'queries/types'
import FeedbackOverview from './FeedbackOverview'

export interface Props {
  app: App
}

function Analytics({ app }: Props) {
  return (
    <FeedbackOverview app={app} />
  )
}

export default Analytics
