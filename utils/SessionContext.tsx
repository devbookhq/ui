import {
  createContext,
  useContext,
} from 'react'
import useSession, { Opts as UseSessionOpts } from './useSession'

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[] | null
  opts?: UseSessionOpts
  /**
   * If the `session` is defined a new session based on the `opts` is not created
   */
  session?: ReturnType<typeof useSession>
}

export const sessionContext = createContext<ReturnType<typeof useSession> | undefined>(undefined)

export function SessionProvider({
  children,
  opts,
  session: existingSession,
}: SessionProviderProps) {
  const shouldCreateNewSession = !existingSession && !!opts
  const newSession = useSession(shouldCreateNewSession ? opts : {})

  const session = shouldCreateNewSession ? newSession : existingSession
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  )
}

export const useSharedSession = () => useContext(sessionContext)
