import { User, useUser as useSupaUser } from '@supabase/supabase-auth-helpers/react'
import { createContext, useContext, useMemo } from 'react'

import useAPIKey from './useAPIKey'

type UserInfoContextType = {
  accessToken: string | null
  user: User | null
  apiKey?: string
  isLoading: boolean
  errors?: string[]
}

export const userInfoContext = createContext<UserInfoContextType | undefined>(undefined)

export interface Props {
  children: React.ReactNode | React.ReactNode[] | null
}

export function UserInfoContextProvider({ children }: Props) {
  const { user, accessToken, isLoading: isLoadingUser } = useSupaUser()

  const {
    error: apiKeyError,
    isLoading: isLoadingAPIKey,
    key: apiKey,
  } = useAPIKey(user?.id)

  const isLoading = isLoadingUser || isLoadingAPIKey

  const errors = useMemo(() => {
    const errs: string[] = []

    if (apiKeyError) {
      errs.push(`error retrieving api key: ${apiKeyError}`)
    }

    return errs.length > 0 ? errs : undefined
  }, [apiKeyError])

  const value = useMemo(
    () => ({
      apiKey,
      user,
      accessToken,
      isLoading,
      errors,
    }),
    [apiKey, user, accessToken, isLoading, errors],
  )

  return <userInfoContext.Provider value={value}>{children}</userInfoContext.Provider>
}

export default function useUserInfo() {
  const ctx = useContext(userInfoContext)
  if (ctx === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoContextProvider.')
  }
  return ctx
}
