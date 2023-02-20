import { useContext, useState } from 'react'

import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'

interface AppContextProviderProps {
  children: ReactNode | ReactNode[] | null
}


export interface AppContext {
  Code: {
    hoveredLines?: number
  }[]
  Explanation: {
    highlightLines?: string
  }[]
}

type AppContextState = [AppContext | undefined, Dispatch<SetStateAction<AppContext | undefined>>]

export const appContext = createContext<AppContextState | undefined>(undefined)

export function AppContextProvider({
  children,
}: AppContextProviderProps) {
  const state = useState<AppContext>()
  return (
    <appContext.Provider value={state}>
      {children}
    </appContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(appContext)
  if (ctx === undefined) {
    throw new Error('useAppContext must be used within the AppContextProvider.')
  }
  return ctx
}
