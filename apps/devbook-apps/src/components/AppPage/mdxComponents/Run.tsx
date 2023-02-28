import clsx from 'clsx'
import { Play, Square } from 'lucide-react'
import { ReactNode } from 'react'

import { useAppContext } from '../AppContext'
import RunButton from '../RunButton'
import Text from 'components/typography/Text'
import StopButton from '../StopButton'

export interface Props {
  children: ReactNode
  line?: number
}

function Run({
}: Props) {
  const [appCtx] = useAppContext()

  return (
    <div className="flex flex-1 items-center justify-end relative">
      <div
        onClick={appCtx.Code.isRunning ? () => appCtx.Code.stop?.() : () => appCtx.Code.run?.()}
        className={clsx(`
          right-0
          -mr-5
          top-1/2
          -translate-y-1/2
          translate-x-full
          flex
          space-x-2 
          transition-all
          absolute
          not-prose
          items-center
          py-0.5
          pr-2
          pl-1
          rounded
          text-slate-400
          hover:text-slate-600
          cursor-pointer
          `,
          {
            'hover:bg-red-600/10': appCtx.Code.isRunning,
            'hover:bg-green-600/10': !appCtx.Code.isRunning,
          }
        )}
      >
        <div
          className={clsx(`
          rounded
          flex
          p-1
          items-center
          space-x-1
          `,
          )}
        >
          {appCtx.Code.isRunning
            ? <Square
              className="
            text-red-500
            cursor-pointer
          "
              size={16}
            />
            : <Play
              className="
            text-green-500
            cursor-pointer
          "
              size={16}
            />
          }
        </div>
        <Text
          className="font-normal"
          size={Text.size.S3}
          text={appCtx.Code.isRunning ? 'Stop' : 'Run'}
        />
      </div>
    </div>
  )
}

export default Run
