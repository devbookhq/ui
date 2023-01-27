import { Square as SquareIcon } from 'lucide-react'

import HooverTooltip from './HooverTooltip'

export interface Props {
  onClick: (e: any) => void
}

function StopButton({ onClick }: Props) {
  return (
    <button
      className="relative group"
      onClick={onClick}
    >
      <SquareIcon
        className="
          p-1
          rounded-md
          text-red-500
          hover:bg-red-600/10
          cursor-pointer
          transition-all
        "
        size={24}
      />

      <HooverTooltip
        text="Stop"
      />
    </button>
  )
}

export default StopButton
