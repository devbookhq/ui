import { CheckCircle as CheckCircleIcon } from 'lucide-react'
import {
  ReactNode,
  useState,
} from 'react'

import Text from 'components/typography/Text'

export interface Props {
  text?: string,
  hoverText?: string,
  doneText?: string,
  children: ReactNode
  checkID: string
}

function Check({
  text,
  hoverText,
  doneText,
  children,
}: Props) {
  const [isDone, setIsDone] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)

  function handleClick() {
    setIsDone(true)
  }

  return (
    <div className="
      relative
    ">
      {children}
      <div className={`
        absolute
        top-0
        bottom-[40px]
        rounded-full
        left-[-21px]
        w-px
        ${isMouseOver || isDone ? 'bg-green-500/60' : 'bg-gray-800/40'}
        transition-all
      `} />
      <div className={`
        mt-8
        flex
        items-center
        group
        w-full
        group
        transition-all
        relative
      `}
        onClick={handleClick}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <CheckCircleIcon
          className={`
            absolute
            left-[-30px]
            ${isDone ? 'text-green-500' : 'text-gray-500'}
            group-hover:text-green-500
            transition-all
          `}
          size={18}
          strokeWidth={3}
        />
        <div className={`
          ${isDone ? 'bg-gray-800' : 'bg-gray-800/40'}
          hover:bg-gray-800
          ${isDone ? '' : 'cursor-pointer'}
          p-2
          rounded-lg
          w-full
          flex
          items-center
          space-x-2
        `}>
          {isDone &&
            <Text
              className="text-green-500"
              text={doneText || 'Done'}
            />
          }
          {!isDone &&
            <>
              <Text
                className="transition-all text-gray-500 group-hover:text-gray-100"
                text={text || 'Done with the previous segment?'}
              />
              <Text
                className="transition-all opacity-0 group-hover:opacity-100 text-green-500"
                text={hoverText || 'Click here to mark it done!'}
              />
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Check
