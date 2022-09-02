import React, {
  createContext,
  useContext,
} from 'react'

import useSession, { Opts as UseSessionOpts } from '../hooks/useSession'

interface SharedSessionProviderProps {
  children: React.ReactNode | React.ReactNode[] | null
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
    <sharedSessionContext.Provider value={session}>
      {children}
    </sharedSessionContext.Provider>
  )
}

export default function useSharedSession() {
  const ctx = useContext(sharedSessionContext)
  if (!ctx) {
    throw new Error('Cannot find provided Devbook session')
  }
  return ctx
}
