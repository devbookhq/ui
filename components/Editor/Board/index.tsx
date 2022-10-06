import Container from './Container'
import CustomDragLayer from './CustomDragLayer'

export interface Props {

}

function Board() {
  return (
    <div>
      <Container />
      <CustomDragLayer />
    </div>
  )
}

export default Board
