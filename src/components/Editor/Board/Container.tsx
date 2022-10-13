import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { App } from 'utils/queries/types'

import { getGridStyle, xStep, yStep } from 'core/BuilderProvider/grid'
import { useRootStore } from 'core/BuilderProvider/models/RootStoreProvider'

import { canvasClass, useBoard } from '../../../core/BuilderProvider/useBoard'
import { renderBoardBlock } from '../uiComponents'

export interface Props {
  app: App
}

const gridStyle = getGridStyle(xStep, yStep)

function Container({ app }: Props) {
  const { blocks, ref } = useBoard()
  const { board } = useRootStore()

  return (
    <div
      className={clsx('relative', 'flex', 'flex-1', canvasClass)}
      ref={ref}
      style={gridStyle}
      onClick={board.resetBlockSelection}
    >
      {blocks.map(b => renderBoardBlock(b))}
    </div>
  )
}

export default observer(Container)
