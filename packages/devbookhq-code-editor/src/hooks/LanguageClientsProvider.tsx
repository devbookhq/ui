import {
  ReactNode,
  createContext,
  useContext,
} from 'react'
import { Session } from '@devbookhq/sdk'

import useExternalLanguageServer from './useLanguageServer/useExternalLanguageServer'
import useLanguageServerClients, { LSClients } from './useLanguageServer/useLanguageServerClients'
import { LanguageSetup } from './useLanguageServer/setup'

export const languageClientsContext = createContext<LSClients | undefined | null>(null)

export interface LanguageClientsProviderProps {
  session?: Session
  rootdir?: string
  children: ReactNode
  supportedLanguages: LanguageSetup[]
  languageServerPort: number
}

export function LanguageClientsProvider({
  children,
  supportedLanguages,
  session,
  languageServerPort,
  rootdir = '/code',
}: LanguageClientsProviderProps) {
  const server = useExternalLanguageServer({
    supportedLanguages,
    session,
    port: languageServerPort,
  })
  const languageClients = useLanguageServerClients({
    rootdir,
    server,
  })

  return (
    <languageClientsContext.Provider value={languageClients}>
      {children}
    </languageClientsContext.Provider>
  )
}

export function useLanguageClients() {
  const ctx = useContext(languageClientsContext)
  if (ctx === null) {
    throw new Error('useLanguageClients must be used within the LanguageClientsProvider')
  }
  return ctx
}