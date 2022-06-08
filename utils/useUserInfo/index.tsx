import {
  createContext,
  useContext,
  useMemo
} from 'react'
import {
  useUser as useSupaUser,
  User
} from '@supabase/supabase-auth-helpers/react'

import useAPIKey from './useAPIKey'
import useUserDetails, { UserDetails } from './useUserDetails'

type UserInfoContextType = {
  accessToken: string | null
  user: User | null
  userDetails?: UserDetails
  apiKey?: string
  isLoading: boolean
  errors?: string[]
}

export const userInfoContext = createContext<UserInfoContextType | undefined>(undefined)

export interface Props {
  children: React.ReactNode | React.ReactNode[] | null
}

export function UserInfoContextProvider({ children }: Props) {
  const {
    user,
    accessToken,
    isLoading: isLoadingUser,
  } = useSupaUser()

  const {
    error: apiKeyError,
    isLoading: isLoadingAPIKey,
    key: apiKey,
  } = useAPIKey(user?.id)

  const {
    error: userDetailsError,
    isLoading: isLoadingUserDetails,
    details: userDetails,
  } = useUserDetails(user?.id)

  const isLoading = isLoadingUser || isLoadingAPIKey || isLoadingUserDetails

  const errors = useMemo(() => {
    const errs: string[] = []

    if (userDetailsError) {
      errs.push(`error retrieving user details: ${userDetailsError}`)
    }

    if (apiKeyError) {
      errs.push(`error retrieving api key: ${userDetailsError}`)
    }

    return errs.length > 0 ? errs : undefined
  }, [userDetailsError, apiKeyError])

  const value = useMemo(() => ({
    apiKey,
    userDetails,
    user,
    accessToken,
    isLoading,
    errors,
  }), [
    apiKey,
    userDetails,
    user,
    accessToken,
    isLoading,
    errors,
  ])

  return (
    <userInfoContext.Provider value={value}>
      {children}
    </userInfoContext.Provider>
  )
}

export default function useUserInfo() {
  const ctx = useContext(userInfoContext)
  if (ctx === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoContextProvider.')
  }
  return ctx
}
