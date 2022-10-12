import { App } from 'utils/queries/types'

import { useBoard } from '../../BuilderProvider/useBoard'
import { renderBoardItem } from '../UIComponent'

export interface Props {
  app: App
}

function Container({ app }: Props) {
  const { blocks, ref } = useBoard()

  return (
    <div
      className="board relative flex flex-1"
      ref={ref}
    >
      {blocks.map(b => renderBoardItem(b))}
    </div>
  )
}

export default Container
