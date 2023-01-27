import { ReactNode } from 'react'

import Text from 'components/typography/Text'


export interface Props {
  icon: ReactNode
  title: string
}

function StepLabelModal({
  icon,
  title,
}: Props) {
  return (
    <div className="
      transition-all
      duration-200
      ease-in
      opacity-0
      pointer-events-none
      group-hover:pointer-events-auto
      group-hover:opacity-100
      absolute
      h-[40px]
      bottom-[calc(50%-20px)]
      right-[24px]
      py-1
      px-2
      w-auto
      bg-transparent
    ">
      <div className="
        h-full
        w-full
        px-1
        rounded-lg
        border
        bg-gray-100
        border-indigo-200
        shadow-lg
        shadow-indigo-300/20
        text-gray-800
        flex
        items-center
        justify-center
      ">
        {icon}
        <Text
          className="mx-2 whitespace-nowrap"
          text={title}
        // typeface={Text.typeface.InterMedium}
        />
      </div>
    </div>
  )
}

export default StepLabelModal
