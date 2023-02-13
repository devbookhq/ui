import { Loader as LoaderIcon } from 'lucide-react'
import {
  Terminal,
  TerminalHandler,
  TerminalProcess,
} from '@devbookhq/terminal'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSharedSession } from '@devbookhq/react'

export interface Props {
  port?: number
  isSessionIframe?: boolean
}

function Iframe({
  port,
  isSessionIframe,
}: Props) {
  const { session } = useSharedSession()

  const sessionUrl = useMemo(() => {
    return session?.getHostname(port)
  }, [session, port])

  return (
    <div className="
      flex
      py-4
      flex-col
      flex-1
    ">
      <div className="
        relative
        flex
        flex-1
        h-[300px]
        w-full
        overflow-hidden
        rounded
      ">
        <iframe
          src={sessionUrl}
        />
      </div>
    </div>
  )
}

export default Iframe
