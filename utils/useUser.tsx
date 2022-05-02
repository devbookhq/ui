
import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  User
} from '@supabase/supabase-auth-helpers/react'
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

export interface UserDetails {
  id: string /* primary key */
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
}

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetails | null
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

  const getUserDetails = () => supabase.from<UserDetails>('users').select('*').single()

   useEffect(() => {
     if (user && !isLoadingData && !userDetails) {
       setIsloadingData(true);
       Promise.allSettled([getUserDetails()]).then(
         (results) => {
           const userDetailsPromise = results[0]

           if (userDetailsPromise.status === 'fulfilled')
             setUserDetails(userDetailsPromise.value.data)

           setIsloadingData(false)
         }
       );
     } else if (!user && !isLoadingUser && !isLoadingData) {
       setUserDetails(null)
     }
   }, [user, isLoadingUser])

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
  }
  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (ctx === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return ctx
}


