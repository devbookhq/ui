import { ReactNode } from 'react'

import { useAppContext } from '../AppContext'
import RunButton from '../RunButton'
import StopButton from '../StopButton'
import Text from 'components/typography/Text'
import clsx from 'clsx'
import { CurlyBraces } from 'lucide-react'

export interface Props {
  children: ReactNode
  line?: number
}

function Run({
}: Props) {
  const [appCtx] = useAppContext()

  return (
    <div className="inline-flex mr-1 flex-1">
      {!appCtx.Code.isRunning ? (
        <RunButton
          onClick={() => appCtx.Code.run?.()}
        />
      ) : (
        <StopButton
          onClick={() => appCtx.Code.stop?.()}
        />
      )}

      <div
        className={clsx(
          `absolute
        inset-y-0
        -inset-x-2
        rounded-lg`,
        )} />
      <div
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
          hover:text-slate-600
          cursor-pointer
          text-slate-400
          `,
        )
        }
      >
        <div
          className={clsx(`
          bg-white
          p-1
          rounded
          border
          flex
          items-center
          space-x-1
          `,
          )}
        >
          <CurlyBraces size="16px" className="" />
        </div>
        <Text
          className="font-mono"
          size={Text.size.S3}
          text="Code"
        />
      </div>
    </div>
  )
}

export default Run
