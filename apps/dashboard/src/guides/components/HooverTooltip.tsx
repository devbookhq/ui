import { Triangle as TriangleIcon } from 'lucide-react'

import Text from 'components/typography/Text'

export interface Props {
  isVisible?: boolean
  text: string
}
function HooverTooltip({
  isVisible,
  text,
}: Props) {
  return (
    <div className={`
      absolute
      ${isVisible ? 'inline-block' : 'hidden'}
      group-hover:inline-block
      bottom-full
      left-1/2
      -translate-x-1/2
      mb-2
      px-2
      py-px

      rounded-lg
      bg-gray-700
      whitespace-nowrap
    `}>
      <div className="relative bottom-px">
        <Text
          className="text-gray-200"
          size={Text.size.S3}
          text={text}
        />
        <TriangleIcon
          className="
            absolute
            top-full
            left-1/2
            -mt-1
            ml-[-7px]
            text-gray-700
            fill-gray-700
            rotate-180
          "
          size={14}
        />
      </div>
    </div>
  )
}

export default HooverTooltip
