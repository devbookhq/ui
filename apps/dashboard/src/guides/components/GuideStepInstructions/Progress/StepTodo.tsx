import { Lock as LockIcon } from 'lucide-react'

import StepLabelModal from './StepLabelModal'

export interface Props {
  title: string
}

function StepTodo({ title }: Props) {
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
        bg-transparent
        border-2
        border-green-400/50
        hover:border-green-400
        transition-all
        group
      ">
        <div className="
          transition-all
          w-full
          h-full
          scale-0
          group-hover:scale-90
          duration-300
          ease-in
          rounded-full
          bg-green-400
        "/>
      </div>
      <StepLabelModal
        icon={
          <LockIcon
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

export default StepTodo

