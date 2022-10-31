import clsx from 'clsx'
import { useState } from 'react'

import { UI } from 'components/AppEditor/uiComponents'

import { RootState } from 'core/EditorProvider/models/RootStoreProvider'
import { BoardBlock } from 'core/EditorProvider/models/board'
import ViewProvider from 'core/ViewProvider'

import { headerBoardHeight } from './AppEditor/Board'
import Text from './typography/Text'

export interface Props {
  state: RootState
}

interface ViewCanvas {
  top: number
  left: number
  width: number
  height: number
}

const sidebarWidth = 160

function getBoundingRectangle(blocks: BoardBlock[]) {
  return (
    blocks.reduce<ViewCanvas | undefined>((res, block) => {
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
    }, undefined) || { top: 0, left: 0, width: 0, height: 0 }
  )
}

function AppView({ state }: Props) {
  const [selectedPage, setSelectedPage] = useState(state.selectedPage)

  const board = state.pages[selectedPage]
  const blocks = Object.values(board.blocks)

  // We use header from the first page on every other page
  const firstPageBlocks = Object.values(state.pages[0].blocks)

  const headerBlocks = firstPageBlocks.filter(b => b.top < headerBoardHeight)
  const contentBlocks = blocks.filter(b => b.top >= headerBoardHeight)

  const contentCanvas = getBoundingRectangle(contentBlocks)
  const headerCanvas = getBoundingRectangle(headerBlocks)

  const canvasWidth = Math.max(contentCanvas.width, headerCanvas.width)
  const canvasCenter = canvasWidth / 2

  const remappedHeaderBlocks = headerBlocks.map(b => {
    const blockCenter = b.left + b.width / 2
    return {
      ...b,
      side: blockCenter > canvasCenter ? 'right' : 'left',
    }
  })

  const leftHeaderBlocks = remappedHeaderBlocks.filter(b => b.side === 'left')
  const rightHeaderBlocks = remappedHeaderBlocks.filter(b => b.side === 'right')

  const leftHeaderCanvas = getBoundingRectangle(leftHeaderBlocks)
  const rightHeaderCanvas = getBoundingRectangle(rightHeaderBlocks)

  return (
    <div className="flex flex-1 flex-col bg-[#fbfdfd]">
      <ViewProvider initialState={state}>
        {headerCanvas && (
          <div
            className="flex justify-between border-b bg-[#fefeff]"
            style={{ width: '100%' }}
          >
            <div
              style={{
                width: leftHeaderCanvas.width,
                height: headerCanvas.height,
                top: -headerCanvas.top / 2,
              }}
              className="relative flex"
            >
              {leftHeaderBlocks.map(b => (
                <UI.ViewBoardBlock
                  key={b.id}
                  {...b}
                />
              ))}
            </div>
            <div
              style={{
                width: rightHeaderCanvas.width,
                height: headerCanvas.height,
                right: leftHeaderCanvas.left,
                top: -headerCanvas.top / 2,
              }}
              className="relative flex"
            >
              {rightHeaderBlocks.map(b => (
                <UI.ViewBoardBlock
                  key={b.id}
                  {...b}
                />
              ))}
            </div>
          </div>
        )}
        {state.pages.length > 1 && (
          <div
            style={{
              top: headerCanvas.height,
              width: sidebarWidth,
            }}
            className="absolute h-full items-center justify-center space-y-2 px-6 py-8"
          >
            {state.pages.map((p, i) => (
              <Text
                key={i}
                className={clsx(
                  'cursor-pointer border-l-2 border-transparent py-1 px-3 font-normal transition-all',
                  {
                    'border-green-600 text-slate-500': selectedPage === i,
                    'border-slate-300 text-slate-300 hover:border-green-500 hover:text-slate-500':
                      selectedPage !== i,
                  },
                )}
                text={p.name || `Page ${i + 1}`}
                onClick={() => setSelectedPage(i)}
              />
            ))}
          </div>
        )}
        {contentCanvas && (
          <div
            style={{
              width: contentCanvas.width,
              height: contentCanvas.height,
              top: -(contentCanvas.top + headerBoardHeight) / 2,
              left: -contentCanvas.left / 2,
            }}
            className="relative m-auto flex"
          >
            {contentBlocks.map(b => (
              <UI.ViewBoardBlock
                key={b.id}
                {...b}
              />
            ))}
          </div>
        )}
      </ViewProvider>
    </div>
  )
}

export default AppView
