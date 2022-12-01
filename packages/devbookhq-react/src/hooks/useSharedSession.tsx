import {
  ReactNode,
  createContext,
  useContext,
} from 'react'
import { Opts as UseSessionOpts, useSession } from './useSession'

interface SharedSessionProviderProps {
  children: ReactNode | ReactNode[] | null
  opts?: UseSessionOpts
  /**
   * If the `session` is defined a new session based on the `opts` is not created
   */
  session?: ReturnType<typeof useSession>
}

export const sharedSessionContext = createContext<ReturnType<typeof useSession> | undefined>(undefined)

export function SharedSessionProvider({
  children,
  opts,
  session: existingSession,
}: SharedSessionProviderProps) {
  const shouldCreateNewSession = !existingSession && !!opts
  const newSession = useSession(shouldCreateNewSession ? opts : {})

  const session = shouldCreateNewSession ? newSession : existingSession
  return (
    <sharedSessionContext.Provider value= { session } >
    {children}
    </sharedSessionContext.Provider>
  )
}

export default function useSharedSession() {
  const ctx = useContext(sharedSessionContext)
  if (ctx === undefined) {
    throw new Error('useSharedSession must be used within the SharedSessionContextProvider.')
  }
  return ctx
}
