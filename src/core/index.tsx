import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import {
  CSSProperties,
  ComponentProps,
  ComponentType,
  JSXElementConstructor,
  useEffect,
  useMemo,
} from 'react'
import { useDrag } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import useHasMounted from 'hooks/useHasMounted'

import { BoardBlock } from 'core/BuilderProvider/models/board'

import { useRootStore } from './BuilderProvider/models/RootStoreProvider'

export const boardBlockType = 'boardBlock'
export const sidebarIconType = 'sidebarIcon'

export function parseDefaultProps(
  props: { [name: string]: any },
  [name, { default: def }]: [string, { type: UIPropType; label: string; default: any }],
) {
  if (def !== undefined) {
    props[name] = def
  }
  return props
}

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

export enum UIPropType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
}

type UIComponentProps = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

export type UIProps<C extends UIComponentProps> = {
  [key in keyof ComponentProps<C>]: {
    type: UIPropType
    label: string
    values?: ComponentProps<C>[key][]
    default: ComponentProps<C>[key]
  }
}

export type UIComponentSetup = {
  [id: string]: {
    Block: ComponentType
    Icon: ComponentType
    label: string
    props: UIProps<UIComponentProps>
  }
}

export function getUIComponents(setup: UIComponentSetup) {
  function EditorBoardBlock({
    id,
    left,
    top,
    componentType,
    props: rawProps,
    isSelected,
  }: BoardBlock & { isSelected: boolean }) {
    const C = setup[componentType]

    const { board } = useRootStore()

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

    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    const hasMounted = useHasMounted()
    if (!hasMounted) return null

    return (
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
          className={clsx('flex', 'pointer-events-none', 'w-full', 'h-full', 'absolute', {
            'z-50 rounded opacity-60 outline-dashed outline-lime-600/80': isSelected,
          })}
        ></div>
        <C.Block {...props} />
      </div>
    )
  }

  function PreviewBoardBlock(block: BoardBlock) {
    const C = setup[block.componentType]
    const { left, top, props: rawProps } = block
    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    return (
      <div style={getStyles(left, top, false)}>
        <C.Block {...props} />
      </div>
    )
  }

  function SidebarIcon({ componentType }: { componentType: string }) {
    const C = setup[componentType]
    const [collected, drag, preview] = useDrag(() => ({
      type: sidebarIconType,
      options: {
        dropEffect: 'copy',
      },
      item: {
        componentType,
      },
      collect: monitor => ({
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
        className="flex flex-col items-center"
      >
        <div className="flex h-14 w-14 cursor-move flex-col rounded border border-gray-300 bg-gray-50 p-1 px-1 text-xs hover:bg-gray-400">
          <C.Icon />
        </div>
        <div className="text-sm text-gray-600">{C.label}</div>
      </div>
    )
  }

  function DraggedBoardBlock({
    componentType,
    offset,
  }: Omit<BoardBlock, 'props'> & { offset: XYCoord }) {
    const C = setup[componentType]

    const props = useMemo(
      () => Object.entries(C.props).reduce(parseDefaultProps, {}),
      [C.props],
    )

    return (
      <div style={getTransform(offset.x, offset.y)}>
        <C.Block {...props} />
      </div>
    )
  }

  return {
    DraggedBoardBlock: observer(DraggedBoardBlock),
    PreviewBoardBlock: observer(PreviewBoardBlock),
    EditorBoardBlock: observer(EditorBoardBlock),
    SidebarIcon,
  }
}
