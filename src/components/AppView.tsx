import { UI } from 'components/AppEditor/uiComponents'

import { RootState } from 'core/EditorProvider/models/RootStoreProvider'
import { BoardBlock } from 'core/EditorProvider/models/board'
import ViewProvider from 'core/ViewProvider'

export interface Props {
  state: RootState
}

interface ViewCanvas {
  top: number
  left: number
  width: number
  height: number
}

function getViewCanvas(blocks: BoardBlock[]) {
  return blocks.reduce<ViewCanvas | undefined>((res, block) => {
    if (!res)
      return {
        width: block.left + block.width,
        height: block.top + block.height,
        top: block.top,
        left: block.left,
      }

    if (res.top > block.top) res.top = block.top
    if (res.left > block.left) res.left = block.left

    if (res.height < block.top + block.height) res.height = block.top + block.height
    if (res.width < block.left + block.width) res.width = block.left + block.width

    return res
  }, undefined)
}

function AppView({ state }: Props) {
  const blocks = Object.values(state.board.blocks)
  const viewCanvas = getViewCanvas(blocks)

  if (!viewCanvas) return null

  return (
    <div className="flex flex-1 flex-col bg-[#fbfdfd]">
      <ViewProvider initialState={state}>
        <div
          style={{
            width: viewCanvas.width,
            height: viewCanvas.height,
            top: -viewCanvas.top / 2,
            left: -viewCanvas.left / 2,
          }}
          className="relative m-auto flex"
        >
          {blocks.map(b => (
            <UI.ViewBoardBlock
              key={b.id}
              {...b}
            />
          ))}
        </div>
      </ViewProvider>
    </div>
  )
}

export default AppView
