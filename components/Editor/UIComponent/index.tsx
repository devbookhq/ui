import { CSSProperties, ComponentType, memo, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { BoardBlock } from '../../BuilderProvider/BoardBlock'
import CodeEditor, { Icon as CodeEditorIcon } from './CodeEditor'
import CodeSnippet, { Icon as CodeSnippetIcon } from './CodeSnippet'
import Terminal, { Icon as TerminalIcon } from './Terminal'

export const boardComponentType: UIComponentType = 'boardComponent'
export const sidebarIconType = 'sidebarIcon'

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

function getSidebarStyles(left: number, top: number): CSSProperties {
  const transform = `translate(${left}px, ${top}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

interface DraggedProps {
  offset: XYCoord
}

function asDraggedBoardComponent<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P & BoardBlock & DraggedProps) => {
    return (
      <div style={getSidebarStyles(props.offset.x, props.offset.y)}>
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
  const Wrapped = (props: P & BoardBlock) => {
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
  const Wrapped = (props: P & BoardBlock) => {
    const { id, left, top } = props

    return (
      <div style={getStyles(left, top, false)}>
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
        className="mx-1 flex h-12 w-12 items-center justify-center rounded-sm bg-gray-800 p-1"
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
  [id: string]: UIComponentSetup<BoardBlock, object, BoardBlock & DraggedProps>
}

// Add new board components and their sidebar icons here
const availableComponents = {
  [CodeSnippet.name]: {
    Sidebar: CodeSnippetIcon,
    Board: CodeSnippet,
  },
  [CodeEditor.name]: {
    Sidebar: CodeEditorIcon,
    Board: CodeEditor,
  },
  [Terminal.name]: {
    Sidebar: TerminalIcon,
    Board: Terminal,
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

export function renderBoardItem(item: BoardBlock) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.Board
      key={item.id}
      {...item}
    />
  )
}

export function renderPreviewItem(item: BoardBlock) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.Preview
      key={item.id}
      {...item}
    />
  )
}

export function renderDraggedBoardItem(item: BoardBlock, offset: XYCoord) {
  const C = uiComponentsMap[item.componentType]
  return (
    <C.DraggedBoard
      key={item.id}
      {...item}
      offset={offset}
    />
  )
}
