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

import Text from 'components/typography/Text'

import useHasMounted from 'hooks/useHasMounted'
import useMousePosition from 'hooks/useMousePosition'

import { BoardBlock } from 'core/EditorProvider/models/board'

import BlockOutline from './BlockOutline'
import { snapToGrid, xStep, yStep } from './EditorProvider/grid'
import { useRootStore } from './EditorProvider/models/RootStoreProvider'
import {
  DraggedBoardBlock,
  DraggedSidebarBlock,
  getCanvasCoordinates,
} from './EditorProvider/useBoard'

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
  Array = 'array',
}

export type UIComponentProps = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

export interface UIProp<T> {
  type: UIPropType
  label: string
  values?: { label?: string; value: T }[]
  default: T
}

export type UIProps<C extends UIComponentProps> = {
  [key in keyof ComponentProps<C>]: UIProp<ComponentProps<C>[key]> & {
    nestedLabel?: string
    nestedType?: {
      [name: string]: UIProp<any>
    }
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

  function ViewBoardBlock({
    componentType,
    left,
    top,
    props: rawProps,
    width,
    height,
    outlineEnabled,
  }: Pick<BoardBlock, 'componentType' | 'left' | 'props' | 'width' | 'height' | 'top'> & {
    outlineEnabled?: boolean
  }) {
    const C = componentsSetup[componentType]
    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    return (
      <div
        className="absolute flex items-stretch justify-center"
        style={{
          ...getTransform(left, top),
          width,
          height,
        }}
      >
        {/* We use an invisible block outline because the missing outline border would
        otherwise change the block position */}
        <BlockOutline
          isEnabled={outlineEnabled}
          isSelected={outlineEnabled}
          label={C.label}
        >
          <C.Block
            {...props}
            isInEditor={false}
          />
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
    const props = useMemo(() => JSON.parse(rawProps), [rawProps])

    const [{ isDragging }, drag, preview] = useDrag<
      DraggedBoardBlock,
      undefined,
      { isDragging: boolean }
    >(
      () => ({
        type: boardBlockType,
        item: {
          id,
          left,
          top,
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

    const { board } = useRootStore()

    const [isResizing, setIsResizing] = useState(false)

    useEffect(
      function selectOnChange() {
        if (isDragging) {
          board.selectBlock(id)
        }
      },
      [board, id, isDragging],
    )

    const [localSize, setLocalSize] = useState({
      width,
      height,
    })

    const mousePosition = useMousePosition(true, !isResizing)

    const block = board.getBlock(id)
    const hasMounted = useHasMounted()
    if (!hasMounted) return null

    console.log('p', props)

    return (
      <Resizable
        handleSize={[15, 15]}
        onResize={(_, d) => {
          const canvas = getCanvasCoordinates()
          let newTop = top
          let newLeft = left
          let newHeight = height
          let newWidth = width

          if (d.size.height !== localSize.height) {
            if (d.handle === 'n' || d.handle === 'ne' || d.handle === 'nw') {
              const y = mousePosition ? mousePosition.y - canvas.y : top
              newTop = snapToGrid(y, yStep)
              if (newTop !== top) {
                newHeight = snapToGrid(height + top - newTop, yStep)
              }
            } else {
              const y = mousePosition ? mousePosition.y - canvas.y : top + height
              newHeight = snapToGrid(y - top, yStep)
            }
          }

          if (d.size.width !== localSize.width) {
            if (d.handle === 'w' || d.handle === 'nw' || d.handle === 'sw') {
              const x = mousePosition ? mousePosition.x - canvas.x : left
              newLeft = snapToGrid(x, xStep)
              if (newLeft !== left) {
                newWidth = snapToGrid(width + left - newLeft, xStep)
              }
            } else {
              const x = mousePosition ? mousePosition.x - canvas.x : left + width
              newWidth = snapToGrid(x - left, xStep)
            }
          }

          block?.reposition({
            width: newWidth,
            height: newHeight,
            top: newTop,
            left: newLeft,
          })

          setLocalSize(d.size)
        }}
        onResizeStop={() => setIsResizing(false)}
        width={localSize.width}
        height={localSize.height}
        resizeHandles={isSelected ? ['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'] : []}
        onResizeStart={() => setIsResizing(true)}
      >
        <div
          className={clsx('absolute flex cursor-move items-stretch justify-center', {
            'z-40': isSelected,
          })}
          onClick={e => {
            e.stopPropagation()
            board.selectBlock(id)
          }}
          ref={isResizing ? null : drag}
          style={{
            ...getTransform(left, top),
            height,
            width,
          }}
        >
          <BlockOutline
            isSelected={isSelected}
            label={C.label}
            onDelete={() =>
              board.removeBlock({
                id,
              })
            }
            isEnabled
          >
            <C.Block
              {...props}
              isInEditor={true}
            />
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
    const rawProps = JSON.stringify(defaultProps)

    const [, drag, preview] = useDrag<DraggedSidebarBlock>(
      () => ({
        type: sidebarIconType,
        options: {
          dropEffect: 'copy',
        },
        item: {
          componentType,
          props: rawProps,
          height: C.defaultSize.height,
          width: C.defaultSize.width,
        },
      }),
      [componentType, rawProps, C.defaultSize.width, C.defaultSize.height],
    )

    useEffect(
      function removePreview() {
        preview(getEmptyImage())
      },
      [preview],
    )

    return (
      <div
        className={clsx(
          'group flex cursor-move flex-col items-center space-y-0.5',
          className,
        )}
        ref={drag}
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
    ViewBoardBlock: memo(ViewBoardBlock),
    SidebarIcon: memo(SidebarIcon),
  }
}
