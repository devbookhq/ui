import cn from 'classnames'
import {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import SpinnerIcon from '../SpinnerIcon'

export interface Props {
  src: string
}

export interface IframeElHandle {
  reload: () => void
}

const IframeEl = forwardRef<IframeElHandle, Props>(({
  src,
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

        border-x
        border-x-gray-300
        dark:border-x-black-650
      "
    >
      <iframe
        key={v}
        className={cn(
          'flex-1',
          'bg-transparent',
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
