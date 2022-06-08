import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

export interface UserDetails {
  id: string
  full_name?: string
  avatar_url?: string
}

function useUserDetails(userID?: string) {
  const [details, setDetails] = useState<UserDetails>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isJobInProcess, setIsJobInProcess] = useState(false)

  useEffect(function fetchAPIKey() {
    if (!userID) return
    if (isJobInProcess) return

    setIsJobInProcess(true)
    setIsLoading(true)

    supabaseClient
      .from<UserDetails>('users')
      .select('*')
      .eq('id', userID)
      .single()
      .then(({ data, error: err }) => {
        if (data) setDetails(data)
        if (err) setError(err.message)
        setIsJobInProcess(false)
        setIsLoading(false)
      })

  }, [userID])

  return {
    details,
    error,
    isLoading,
  }
}


export default useUserDetails
