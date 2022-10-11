import { App } from 'types'

import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

export interface Props {
  app: App
}

function Board({ app }: Props) {
  return (
    <div className="bg-black-80 flex flex-1 overflow-hidden">
      <Container app={app} />
      <CustomDragLayer />
    </div>
  )
}

export default Board
