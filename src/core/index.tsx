import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { Resizable } from 're-resizable'
import { CSSProperties, ComponentType, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { BoardBlock } from 'core/BuilderProvider/models/board'

import { useRootStore } from './BuilderProvider/models/RootStoreProvider'

export const boardBlockType = 'boardBlock'
export const sidebarIconType = 'sidebarIcon'

function getStyles(left: number, top: number, isDragging: boolean): CSSProperties {
  return {
    position: 'absolute',
    ...getTransform(left, top),
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

function getTransform(left: number, top: number): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

interface DraggedProps {
  offset: XYCoord
}

function asDraggedBoardBlock<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P & BoardBlock & DraggedProps) => {
    return (
      <div style={getTransform(props.offset.x, props.offset.y)}>
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName
  return observer(Wrapped)
}

function asBoardBlock<P extends object>(
  Component: ComponentType<P>,
  componentType: string,
) {
  const Wrapped = (props: P & BoardBlock) => {
    const { id, left, top } = props

    const { board } = useRootStore()

    const block = board.getBlock(id)

    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: boardBlockType,
        item: {
          id,
          left,
          top,
          componentType,
        },
        collect: monitor => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [id, left, top],
    )

    useEffect(
      function changePreview() {
        preview(getEmptyImage())
      },
      [preview],
    )

    useEffect(
      function selectOnDrag() {
        if (isDragging) {
          board.selectBlock(id)
        }
      },
      [isDragging, board, id],
    )

    const isSelected = board.selectedBlock?.id === id

    if (!block) return null

    return (
      <Resizable>
        <div
          className="flex flex-1"
          ref={drag}
          style={getStyles(left, top, isDragging)}
          onClick={e => {
            e.stopPropagation()
            board.selectBlock(id)
          }}
        >
          <div
            className={clsx(
              'flex',
              'pointer-events-none',
              'w-full',
              'h-full',
              'absolute',
              {
                'z-80 rounded-sm opacity-60 outline-dashed outline-offset-4 outline-green-600':
                  isSelected,
              },
            )}
          ></div>
          <Component {...block.props} />
        </div>
      </Resizable>
    )
  }

  Wrapped.displayName = Component.displayName
  return observer(Wrapped)
}

function asPreviewBlock<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P & BoardBlock) => {
    const { left, top } = props

    return (
      <div style={getStyles(left, top, false)}>
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName
  return observer(Wrapped)
}

function asSidebarIcon<P extends object>(
  Component: ComponentType<P>,
  componentType: string,
) {
  const Wrapped = (props: P) => {
    const [collected, drag, preview] = useDrag(() => ({
      type: sidebarIconType,
      options: {
        dropEffect: 'copy',
      },
      item: {
        componentType,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0 : 1,
      }),
    }))

    useEffect(
      function changePreview() {
        preview(getEmptyImage())
      },
      [preview],
    )

    return (
      <div
        ref={drag}
        {...collected}
        className="flex h-14 w-14 cursor-move items-center justify-center rounded-sm border border-black-700 bg-black-800 p-1 px-1 text-xs hover:bg-black-700"
      >
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName
  return Wrapped
}

type UIComponent<
  T extends BoardBlock,
  I extends object,
  L extends BoardBlock & DraggedProps,
> = {
  Board: ComponentType<T>
  Sidebar: ComponentType<I>
  DraggedBoard: ComponentType<L>
  Preview: ComponentType<T>
}

type UIComponentMap = {
  [id: string]: UIComponent<BoardBlock, object, BoardBlock & DraggedProps>
}

type UIComponentSetup<T extends BoardBlock, I extends object> = {
  [id: string]: {
    Board: ComponentType<T>
    Sidebar: ComponentType<I>
  }
}

export function getUIComponents(setup: UIComponentSetup<BoardBlock, object>) {
  const uiComponentsList = Object.entries(setup).map(([id, { Sidebar, Board }]) => {
    return {
      id,
      Sidebar: asSidebarIcon(Sidebar, id),
      Board: asBoardBlock(Board, id),
      DraggedBoard: asDraggedBoardBlock(Board),
      Preview: asPreviewBlock(Board),
    }
  })

  const uiComponentsMap = uiComponentsList.reduce<UIComponentMap>((prev, curr) => {
    prev[curr.id] = {
      Sidebar: curr.Sidebar,
      Board: curr.Board,
      DraggedBoard: curr.DraggedBoard,
      Preview: curr.Preview,
    }
    return prev
  }, {})

  function renderBoardBlock(block: BoardBlock) {
    const C = uiComponentsMap[block.componentType]
    return (
      <C.Board
        key={block.id}
        {...block}
      />
    )
  }

  function renderPreviewBoardBlock(block: BoardBlock) {
    const C = uiComponentsMap[block.componentType]
    return (
      <C.Preview
        key={block.id}
        {...block}
      />
    )
  }

  function renderDraggedBoardBlock(block: BoardBlock, offset: XYCoord) {
    const C = uiComponentsMap[block.componentType]
    return (
      <C.DraggedBoard
        key={block.id}
        {...block}
        offset={offset}
      />
    )
  }

  return {
    uiComponentsList,
    uiComponentsMap,
    renderBoardBlock,
    renderPreviewBoardBlock,
    renderDraggedBoardBlock,
  }
}
