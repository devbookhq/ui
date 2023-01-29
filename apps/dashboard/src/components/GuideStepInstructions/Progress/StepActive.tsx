import { Unlock as UnlockIcon } from 'lucide-react'

import StepLabelModal from './StepLabelModal'

export interface Props {
  title: string
}

function StepActive({ title }: Props) {
  return (
    <div className="
      relative
      group
    ">
      <div className="
        rounded-full
        w-6
        h-6
        flex
        items-center
        justify-center
        bg-white
        border-2
        border-white
        group
      ">
        <div className="
          transition-all
          w-2.5
          h-2.5
          group-hover:scale-150
          duration-300
          ease-in
          rounded-full
          bg-green-400
          animate-pulse
        "/>
      </div>
      <StepLabelModal
        icon={
          <UnlockIcon
            className="text-green-600"
            size={16}
            strokeWidth={2.5}
          />
        }
        title={title}
      />
    </div>
  )
}

export default StepActive
