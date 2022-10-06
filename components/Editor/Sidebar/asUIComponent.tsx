import { ComponentType } from 'react'
import { useDrag } from 'react-dnd'

export function asUIComponent<P extends object>(
  Component: ComponentType<P>,
  dropTarget: string,
) {
  const Wrapped = (props: P) => {
    const [collected, drag] = useDrag(() => ({
      type: dropTarget,
      options: {
        dropEffect: 'copy',
      },
      item: { id: Component.displayName },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }))

    return (
      <div ref={drag} {...collected}>
        <Component {...props} />
      </div>
    )
  }
  Wrapped.displayName = Component.displayName
  return Wrapped
}
