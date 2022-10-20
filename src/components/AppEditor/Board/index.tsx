import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

function Board() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Container />
      <CustomDragLayer />
    </div>
  )
}

export default Board
