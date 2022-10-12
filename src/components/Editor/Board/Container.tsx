import { observer } from 'mobx-react-lite'

import { App } from 'utils/queries/types'

import { useBoard } from '../../../core/BuilderProvider/useBoard'
import { renderBoardBlock } from '../uiComponents'

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
      {blocks.map(b => renderBoardBlock(b))}
    </div>
  )
}

export default observer(Container)
