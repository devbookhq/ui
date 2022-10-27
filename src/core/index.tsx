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
    values?: { label?: string; value: ComponentProps<C>[key] }[]
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

  function ViewBoardBlock(block: BoardBlock & { outlineEnabled?: boolean }) {
    const C = componentsSetup[block.componentType]
    const { left, top, props: rawProps, width, height } = block
    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    const styleSize =
      block.width === undefined || block.height === undefined
        ? C.defaultSize
        : {
            width,
            height,
          }

    return (
      <div
        className="absolute flex items-stretch justify-center"
        style={{
          ...getTransform(left, top),
          ...styleSize,
        }}
      >
        {/* We use an invisible block outline because the missing outline border would
        otherwise change the block position */}
        <BlockOutline
          isEnabled={block.outlineEnabled}
          isSelected={block.outlineEnabled}
          label={C.label}
        >
          <C.Block {...props} />
        </BlockOutline>
      </div>
    )
  }

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

    const [size, setSize] = useState(
      width === undefined || height === undefined
        ? C.defaultSize
        : {
            width,
            height,
          },
    )

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
          props: rawProps,
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
      board.removeBlock({
        id,
      })
    }

    const [isResizing, setIsResizing] = useState(false)

    const block = board.getBlock(id)

    const styleSize = useMemo(() => {
      // TODO: Update mobx state so the changes to size are visible for everybody
      const width = snapToGrid(size.width, xStep)
      const height = snapToGrid(size.height, yStep)

      block?.resize(width, height)

      return {
        width,
        height,
      }
    }, [size.height, size.width, block])

    const [transform, setTransform] = useState({
      top,
      left,
    })

    // function handleResize(handle: ResizeHandle, size: { width: number; height: number }) {
    //   setSize(s => {
    //     let deltaHeight: number | undefined
    //     let deltaWidth: number | undefined

    //     if (handle === 'n' || handle === 'ne' || handle === 'nw') {
    //       const deltaHeight = s.height - size.height
    //     }

    //     if (handle === 'w' || handle === 'nw' || handle === 'sw') {
    //       const deltaWidth = s.width - size.width
    //     }

    //     // TODO: Snap to grid
    //     // TODO: Set position

    //     // TODO: Update mobx state so the changes to position are visible for everybody
    //   })
    // }

    const hasMounted = useHasMounted()
    if (!hasMounted) return null

    return (
      <Resizable
        axis="both"
        className="z-50 text-slate-400 hover:text-slate-600"
        height={size.height}
        resizeHandles={isSelected ? ['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'] : []}
        width={size.width}
        onResizeStart={() => setIsResizing(true)}
        onResize={(_, d) => {
          setSize(d.size)
        }}
        onResizeStop={(_, d) => {
          setIsResizing(false)
        }}
      >
        <div
          className="absolute z-40 flex cursor-move items-stretch justify-center"
          ref={isResizing ? null : drag}
          style={{
            ...getTransform(left, top),
            ...styleSize,
          }}
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

  function SidebarIcon({
    componentType,
    className,
  }: {
    componentType: string
    className?: string
  }) {
    const C = componentsSetup[componentType]

    const defaultProps = Object.entries(C.props).reduce(parseDefaultProps, {})

    const [collected, drag, preview] = useDrag(() => ({
      type: sidebarIconType,
      options: {
        dropEffect: 'copy',
      },
      item: {
        componentType,
        props: JSON.stringify(defaultProps),
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

  return {
    EditorBoardBlock: observer(EditorBoardBlock),
    ViewBoardBlock,
    SidebarIcon,
  }
}
