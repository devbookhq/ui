import { App } from 'types'

import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

export interface Props {
  app: App
}

function Board({ app }: Props) {
  return (
    <div className="flex flex-1 overflow-hidden bg-black-800">
      <Container app={app} />
      <CustomDragLayer />
    </div>
  )
}

export default Board
