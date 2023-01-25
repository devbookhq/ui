import { App } from 'queries/types'

import Feedback from './Feedback'

export interface Props {
  app: App
}

function Analytics({ app }: Props) {
  return (
    <Feedback app={app} />
  )
}

export default Analytics
