import { Play as PlayIcon } from 'lucide-react'

import HoverTooltip from './HoverTooltip'

export interface Props {
  onClick: (e: any) => void
}

function RunButton({ onClick }: Props) {
  return (
    <button
      className="relative group"
      onClick={onClick}
    >
      <PlayIcon
        className="
          p-1
          text-green-500
          rounded-md
          hover:bg-green-600/10
          cursor-pointer
          transition-all
        "
        size={24}
      />

      <HoverTooltip
        text="Run"
      />
    </button>
  )
}

export default RunButton
