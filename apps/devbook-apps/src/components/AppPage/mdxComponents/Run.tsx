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
          space-x-0.5
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
          {
            'bg-red-600/10': appCtx.Code.isRunning,
            'bg-green-600/10': !appCtx.Code.isRunning,
          }
        )}
      >
        <div
          className={clsx(`
          rounded
          flex
          p-1
          transition-all
          items-center
          space-x-1
          `,
            {
              'text-red-400 group-hover:text-red-600': appCtx.Code.isRunning,
              'text-green-500 group-hover:text-green-600': !appCtx.Code.isRunning,
            }
          )}
        >
          {appCtx.Code.isRunning
            ? <Square
              className="
            cursor-pointer
          "
              size={16}
            />
            : <Play
              className="
            cursor-pointer
          "
              size={16}
            />
          }
        </div>
        <Text
          className={clsx(`
          font-normal
          transition-all
          `,
            {
              'text-red-400 group-hover:text-red-600': appCtx.Code.isRunning,
              'text-green-500 group-hover:text-green-600': !appCtx.Code.isRunning,
            }
          )
          }
          size={Text.size.S3}
          text={appCtx.Code.isRunning ? 'Stop' : 'Run'}
        />
      </div>
    </div>
  )
}

export default Run
