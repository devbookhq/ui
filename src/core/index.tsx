import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import {
  CSSProperties,
  ComponentProps,
  ComponentType,
  JSXElementConstructor,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDrag } from 'react-dnd'
import type { XYCoord } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Resizable } from 'react-resizable'

import 'react-resizable/css/styles.css'

import Text from 'components/typography/Text'

import useHasMounted from 'hooks/useHasMounted'

import { BoardBlock } from 'core/EditorProvider/models/board'

import BlockOutline from './BlockOutline'
import { snapToGrid, xStep, yStep } from './EditorProvider/grid'
import { useRootStore } from './EditorProvider/models/RootStoreProvider'

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

export type UIComponentProps = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

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
    defaultSize: {
      width: number
      height: number
    }
  }
}

export interface EditorSetup {
  componentsSetup: UIComponentSetup
}

export function getUIComponents({ componentsSetup }: EditorSetup) {
  // Memoize the block components
  Object.entries(componentsSetup).forEach(([, setup]) => {
    setup.Block = memo(setup.Block)
  })

  function EditorBoardBlock({
    id,
    left,
    top,
    width,
    height,
    componentType,
    props: rawProps,
    isSelected,
  }: BoardBlock & { isSelected: boolean }) {
    const C = componentsSetup[componentType]

    const { board } = useRootStore()

    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: boardBlockType,
        item: {
          id,
          left,
          top,
          width,
          height,
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
      [isDragging, board, id, width, height],
    )

    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    function handleDeleteBlock() {
      board.removeBlock({ id })
    }

    const [size, setSize] = useState(
      width === undefined || height === undefined ? C.defaultSize : { width, height },
    )
    const [isResizing, setIsResizing] = useState(false)

    const styleSize = useMemo(() => {
      const width = snapToGrid(size.width, xStep)
      const height = snapToGrid(size.height, yStep)
      return { width, height }
    }, [size.height, size.width])

    const hasMounted = useHasMounted()
    if (!hasMounted) return null

    if (!C) throw new Error('Unknown block')

    return (
      <Resizable
        axis={'both'}
        className="z-50 text-slate-400 hover:text-slate-600"
        height={size.height}
        resizeHandles={isSelected ? ['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'] : []}
        width={size.width}
        onResize={(_, d) => setSize(d.size)}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={(_, d) => {
          const width = snapToGrid(d.size.width, xStep)
          const height = snapToGrid(d.size.height, yStep)
          setSize(d.size)
          setIsResizing(false)
          board.getBlock(id)?.resize(width, height)
        }}
      >
        <div
          className="z-40 flex cursor-move items-stretch justify-center"
          ref={isResizing ? null : drag}
          style={{ ...getStyles(left, top, isDragging), ...styleSize }}
          onClick={e => {
            e.stopPropagation()
            board.selectBlock(id)
          }}
        >
          <BlockOutline
            isSelected={isSelected}
            label={C.label}
            isEnabled
            onDelete={handleDeleteBlock}
          >
            <C.Block {...props} />
          </BlockOutline>
        </div>
      </Resizable>
    )
  }

  function ViewBoardBlock(block: BoardBlock) {
    const C = componentsSetup[block.componentType]
    const { left, top, props: rawProps, width, height } = block
    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    if (!C) throw new Error('Unknown block')

    const styleSize =
      block.width === undefined || block.height === undefined
        ? C.defaultSize
        : { width, height }

    return (
      <div
        className="flex items-stretch justify-center"
        style={{ ...getStyles(left, top, false), ...styleSize }}
      >
        {/* We use an invisible block outline because the missing outline border would
        otherwise change the block position */}
        <BlockOutline>
          <C.Block {...props} />
        </BlockOutline>
      </div>
    )
  }

  function SidebarIcon({
    componentType,
    className,
  }: {
    componentType: string
    className?: string
  }) {
    const C = componentsSetup[componentType]
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

    if (!C) throw new Error('Unknown block')

    return (
      <div
        ref={drag}
        {...collected}
        className={clsx(
          'group flex cursor-move flex-col items-center space-y-0.5',
          className,
        )}
      >
        <div
          className="
        flex
        h-12
        w-12
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-slate-200
        bg-white
        text-slate-400
        transition-all
        group-hover:border-transparent
        group-hover:bg-amber-50
        group-hover:text-amber-800
        "
        >
          <C.Icon />
        </div>
        <Text
          className="text-slate-400 transition-all group-hover:text-amber-800"
          size={Text.size.S3}
          text={C.label}
        />
      </div>
    )
  }

  function DraggedBoardBlock({
    componentType,
    offset,
    height,
    width,
  }: Omit<BoardBlock, 'props'> & { offset: XYCoord }) {
    const C = componentsSetup[componentType]

    const props = useMemo(
      () => Object.entries(C.props).reduce(parseDefaultProps, {}),
      [C.props],
    )

    if (!C) throw new Error('Unknown block')

    const styleSize =
      width === undefined || height === undefined ? C.defaultSize : { width, height }

    return (
      <div
        className="z-50 flex cursor-move items-stretch justify-center"
        style={{ ...getTransform(offset.x, offset.y), ...styleSize }}
      >
        <BlockOutline
          label={C.label}
          isHovered
          isSelected
        >
          <C.Block {...props} />
        </BlockOutline>
      </div>
    )
  }

  return {
    DraggedBoardBlock: observer(DraggedBoardBlock),
    ViewBoardBlock: observer(ViewBoardBlock),
    EditorBoardBlock: observer(EditorBoardBlock),
    SidebarIcon,
  }
}
