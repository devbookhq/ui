import { CSSProperties, ComponentType, memo, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { snapToGrid, xStep, yStep } from '../Board/snapToGrid'
import CodeSnippet, { Icon as CodeSnippetIcon } from './CodeSnippet'
import Placeholder, { Icon as PlaceholderIcon } from './Placeholder'

export const boardComponentType: UIComponentType = 'boardComponent'
export const sidebarIconType = 'sidebarIcon'

export interface BoardItem {
  top: number
  id: string
  left: number
  componentType: string
}

function getStyles(left: number, top: number, isDragging: boolean): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  offset: XYCoord | null,
) {
  if (offset) {
    const transform = `translate(${offset.x}px, ${offset.y}px)`
    return {
      transform,
      WebkitTransform: transform,
    }
  }

  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset

  x -= initialOffset.x
  y -= initialOffset.y

  x = snapToGrid(x, xStep)
  y = snapToGrid(y, yStep)

  x += initialOffset.x
  y += initialOffset.y

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

interface DraggedProps {
  initialOffset: XYCoord | null
  currentOffset: XYCoord | null
  offset: XYCoord | null
}

function asDraggedBoardComponent<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P & BoardItem & DraggedProps) => {
    return (
      <div style={getItemStyles(props.initialOffset, props.currentOffset, props.offset)}>
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName

  return memo(Wrapped)
}

function asBoardComponent<P extends object>(
  Component: ComponentType<P>,
  componentType: string,
) {
  const Wrapped = (props: P & BoardItem) => {
    const { id, left, top } = props

    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: boardComponentType,
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

    useEffect(() => {
      preview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }, [])

    return (
      <div
        className="bg-gray-300"
        ref={drag}
        style={getStyles(left, top, isDragging)}
      >
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName

  return memo(Wrapped)
}

function asPreviewComponent<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P & BoardItem) => {
    const { id, left, top } = props

    return (
      <div
        className="bg-gray-300"
        style={getStyles(left, top, false)}
      >
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName

  return memo(Wrapped)
}

function asSidebarIcon<P extends object>(
  Component: ComponentType<P>,
  componentType: string,
) {
  const Wrapped = (props: P) => {
    const [collected, drag] = useDrag(() => ({
      type: sidebarIconType,
      options: {
        dropEffect: 'copy',
      },
      item: {
        componentType,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }))

    return (
      <div
        ref={drag}
        {...collected}
        className="p-1 mx-1 bg-gray-800 rounded-sm flex h-12 w-12 justify-center items-center"
      >
        <Component {...props} />
      </div>
    )
  }

  Wrapped.displayName = Component.displayName

  return Wrapped
}

type UIComponentType = string

type UIComponentSetup<
  T extends BoardItem,
  I extends object,
  L extends BoardItem & DraggedProps,
> = {
  Board: ComponentType<T>
  Sidebar: ComponentType<I>
  DraggedBoard: ComponentType<L>
  Preview: ComponentType<T>
}

type UIComponentMap = {
  [id: string]: UIComponentSetup<BoardItem, object, BoardItem & DraggedProps>
}

// Add new board components and their sidebar icons here
const availableComponents = {
  [Placeholder.name]: {
    Sidebar: PlaceholderIcon,
    Board: Placeholder,
  },
  [CodeSnippet.name]: {
    Sidebar: CodeSnippetIcon,
    Board: CodeSnippet,
  },
}

export const uiComponentsList = Object.entries(availableComponents).map(
  ([id, { Sidebar, Board }]) => {
    return {
      id,
      Sidebar: asSidebarIcon(Sidebar, id),
      Board: asBoardComponent(Board, id),
      DraggedBoard: asDraggedBoardComponent(Board),
      Preview: asPreviewComponent(Board),
    }
  },
)

export const uiComponentsMap = uiComponentsList.reduce<UIComponentMap>((prev, curr) => {
  prev[curr.id] = {
    Sidebar: curr.Sidebar,
    Board: curr.Board,
    DraggedBoard: curr.DraggedBoard,
    Preview: curr.Preview,
  }
  return prev
}, {})

export function renderBoardItem(item: BoardItem) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.Board
      key={item.id}
      {...item}
    />
  )
}

export function renderPreviewItem(item: BoardItem) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.Preview
      key={item.id}
      {...item}
    />
  )
}

export function renderDraggedBoardItem(
  item: BoardItem,
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  isSidebarItem: boolean,
  offset: XYCoord | null,
) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.DraggedBoard
      key={item.id}
      {...item}
      initialOffset={initialOffset}
      currentOffset={currentOffset}
      offset={isSidebarItem ? offset : null}
    />
  )
}
