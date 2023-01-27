import { Check as CheckIcon } from 'lucide-react'

import StepLabelModal from './StepLabelModal'

export interface Props {
  title: string
}

function StepDone({ title }: Props) {
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
        group
      ">
        <CheckIcon
          className="
            text-green-400
            group-hover:animate-wiggle
          "
          size={16}
          strokeWidth={3}
        />
      </div>
      <StepLabelModal
        icon={
          <CheckIcon
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

export default StepDone
