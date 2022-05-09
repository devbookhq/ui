import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'


function useAPIKey(userID?: string) {
  const [key, setKey] = useState<string>('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isJobInProcess, setIsJobInProcess] = useState(false)

  useEffect(function fetchAPIKey() {
    if (!userID) return
    if (isJobInProcess) return

    setIsJobInProcess(true)
    setIsLoading(true)

    supabaseClient
      .from<{ api_key: string, owner_id: string }>('api_keys')
      .select('api_key')
      .single()
      .then(({ data, error: err }) => {
        if (data) setKey(data.api_key || '')
        if (err) setError(err.message)
        setIsJobInProcess(false)
        setIsLoading(false)
      })
  }, [userID])

  return {
    key,
    error,
    isLoading,
  }
}


export default useAPIKey
