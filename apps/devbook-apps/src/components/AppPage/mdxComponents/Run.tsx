import clsx from 'clsx'
import { Play, Square } from 'lucide-react'
import { ReactNode } from 'react'

import { useAppContext } from '../AppContext'
import Text from 'components/typography/Text'

export interface Props {
  children: ReactNode
  line?: number
}

function Run({
}: Props) {
  const [appCtx] = useAppContext()

  return (
    <div className="relative">
      <div
        onClick={appCtx.Code.isRunning ? () => appCtx.Code.stop?.() : () => appCtx.Code.run?.()}
        className={clsx(`
          left-0
          -ml-5
          -translate-x-full
          flex
          space-x-2
          absolute
          not-prose
          items-center
          py-0.5
          pr-2
          group
          pl-1
          rounded
          cursor-pointer
          `,
        )}
      >
        <div
          className={clsx(`
          rounded
          flex
          p-1
          transition-all
          text-slate-400
          group-hover:text-slate-600
          items-center
          space-x-1
          `,
            {
              'bg-red-600/10': appCtx.Code.isRunning,
              'bg-green-600/10': !appCtx.Code.isRunning,
            }
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
          className="font-normal text-slate-400 group-hover:text-slate-600 transition-all"
          size={Text.size.S3}
          text={appCtx.Code.isRunning ? 'Stop' : 'Run'}
        />
      </div>
    </div>
  )
}

export default Run
