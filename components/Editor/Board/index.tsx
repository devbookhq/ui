import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

export interface Props {}

function Board() {
  return (
    <div className="flex flex-1 overflow-hidden bg-black-800">
      <Container />
      <CustomDragLayer />
    </div>
  )
}

export default Board
