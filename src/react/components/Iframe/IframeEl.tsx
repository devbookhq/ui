import cn from 'classnames'
import {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  src: string
  height: number // in px
}

export interface IframeElHandle {
  reload: () => void
}

const IframeEl = forwardRef<IframeElHandle, Props>(({
  src,
  height,
}, ref) => {
  const [v, setV] = useState(0)

  useImperativeHandle(ref, () => ({
    reload: () => {
      setV(v + 1)
    }
  }))

  return (
    <div
      className="
        flex-1
        flex
        relative
        rounded-b

        border-x
        border-b
      border-gray-300
      dark:border-black-650
      "
    >
      <iframe
        style={{
          height: `${height}px`,
        }}
        key={v}
        className={cn(
          'flex-1',
          'bg-transparent',
          'rounded-b',
          'z-20',
        )}
        src={src}
      />
      <div
        className="absolute z-10"
        style={{
          top: 'calc(50%)',
          left: 'calc(50% - 8px)',
        }}
      >
        <SpinnerIcon />
      </div>
    </div>
  )
})

IframeEl.displayName = 'IframeEl'
export default IframeEl
