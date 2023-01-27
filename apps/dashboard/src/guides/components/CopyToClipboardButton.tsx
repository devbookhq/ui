import { Clipboard as ClipboardIcon } from 'lucide-react'
import {
  useCallback,
  useState,
} from 'react'

import HooverTooltip from './HooverTooltip'

export interface Props {
  onClick: (e: any) => void
}

function CopyToClipboardButton({ onClick }: Props) {
  const [isVisibleAfterClick, setIsVisibleAfterClick] = useState(false)
  const [timeoutID, setTimeoutID] = useState<number>()

  const handleClick = useCallback((e: any) => {
    setIsVisibleAfterClick(true)

    if (timeoutID) clearTimeout(timeoutID)
    const id = setTimeout(() => {
      setIsVisibleAfterClick(false)
    }, 2000) as unknown as number
    setTimeoutID(id)

    onClick?.(e)
  }, [onClick, timeoutID])

  return (
    <button
      className="relative group"
      onClick={handleClick}
    >
      <ClipboardIcon
        className="
          p-1
          text-gray-500
          rounded-md
          hover:text-gray-400
          hover:bg-gray-600/10
          cursor-pointer
          transition-all
        "
        size={24}
      />

      <HooverTooltip
        isVisible={isVisibleAfterClick}
        text={isVisibleAfterClick ? 'Copied' : 'Copy code'}
      />
    </button>
  )
}

export default CopyToClipboardButton
