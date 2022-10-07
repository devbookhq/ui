import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  App,
} from 'types'

function useApps(userID?: string) {
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isJobInProcess, setIsJobInProcess] = useState(false)

  useEffect(function fetchApps() {
    if (!userID) return
    if (isJobInProcess) return

    setIsJobInProcess(true)
    setIsLoading(true)

    const sub = supabaseClient
      .from<App>(`apps:creator_id=eq.${userID}`)
      .on('INSERT', payload => {
        const { new: cs, errors } = payload
        if (errors) {
          let err = errors.join('\n')
          setError(err)
        }
        if (cs) setApps(c => [...c, cs])
      })
      .on('UPDATE', payload => {
        const { new: cs, errors } = payload
        if (errors) {
          let err = errors.join('\n')
          setError(err)
        }
        if (cs) setApps(current => {
          const idx = current.findIndex(el => el.id === cs.id)
          if (idx == -1) return current
          current[idx] = {
            ...cs,
          }
          return [...current]
        })
      })
      .on('DELETE', payload => {
        const { old: cs, errors } = payload
        if (errors) {
          let err = errors.join('\n')
          setError(err)
        }
        if (cs) setApps(els => els.filter(el => el.id !== cs.id))
      })
      .subscribe()

    supabaseClient
      .from<App>('apps')
      .select('*')
      .eq('creator_id', userID)
      .then(({ data, error: err }) => {
        if (data) setApps(data)
        if (err) setError(err.message)
        setIsJobInProcess(false)
        setIsLoading(false)
      })

    return () => {
      supabaseClient.removeSubscription(sub)
    }
  }, [userID])

  return {
    apps,
    error,
    isLoading,
  }
}

export default useApps