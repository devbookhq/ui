import { useImmer, ImmerHook } from 'use-immer'
import { useContext } from 'react'

import {
  ReactNode,
  createContext,
} from 'react'

interface AppContextProviderProps {
  children: ReactNode | ReactNode[] | null
}

export interface AppContext {
  Code: {
    hoveredLine?: number
  }
  Explanation: {
    [id: number]: {
      highlightLines: number[]
      enabled: boolean
    } | undefined
  }
}

export const appContext = createContext<ImmerHook<AppContext> | undefined>(undefined)

export function AppContextProvider({
  children,
}: AppContextProviderProps) {
  const state = useImmer<AppContext>({
    Code: {},
    Explanation: {},
  })

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
