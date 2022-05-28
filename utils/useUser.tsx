import {
  useEffect,
  useState,
  createContext,
  useContext
} from 'react'
import {
  useUser as useSupaUser,
  User
} from '@supabase/supabase-auth-helpers/react'
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  CodeSnippet,
} from 'types'

export interface UserDetails {
  id: string
  full_name?: string
  avatar_url?: string
}

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetails | null
  codeSnippets: CodeSnippet[]
  isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  supabaseClient: SupabaseClient;
  [propName: string]: any;
}
export function UserContextProvider(props: Props) {
  const { supabaseClient: supabase } = props
  const { user, accessToken, isLoading: isLoadingUser } = useSupaUser()
  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([])

  const getUserDetails = () => supabase.from<UserDetails>('users').select('*').single()
  const getCodeSnippets = () => supabase.from<CodeSnippet>('code_snippets').select('*').eq('creator_id', user?.id || '')

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true)
      Promise.allSettled([getUserDetails(), getCodeSnippets()]).then(
        (results) => {
          const userDetailsPromise = results[0]
          const csPromise = results[1]

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data)

          if (csPromise.status === 'fulfilled')
            setCodeSnippets(csPromise.value.data ?? [])

          setIsloadingData(false)
        }
      )
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
    }
  }, [user, isLoadingUser])


  const value = {
    accessToken,
    user,
    userDetails,
    codeSnippets,
    isLoading: isLoadingUser || isLoadingData,
  }
  return <UserContext.Provider value={value} {...props} />
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (ctx === undefined) {
    throw new Error('useUser must be used within a UserContextProvider.')
  }
  return ctx
}
