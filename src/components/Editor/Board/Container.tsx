import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { App } from 'utils/queries/types'

import { canvasClass, useBoard } from '../../../core/BuilderProvider/useBoard'
import { renderBoardBlock } from '../uiComponents'

export interface Props {
  app: App
}

function Container({ app }: Props) {
  const { blocks, ref } = useBoard()

  return (
    <div
      className={clsx('board', 'relative', 'flex', 'flex-1', canvasClass)}
      ref={ref}
    >
      {blocks.map(b => renderBoardBlock(b))}
    </div>
  )
}

export default observer(Container)
