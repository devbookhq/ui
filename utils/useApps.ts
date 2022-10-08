import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useEffect, useState } from 'react'
import type { App } from 'types'

function useApps(userID?: string) {
  const [apps, setApps] = useState<Required<App>[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isJobInProcess, setIsJobInProcess] = useState(false)

  useEffect(
    function fetchApps() {
      if (!userID) return
      if (isJobInProcess) return

      setIsJobInProcess(true)
      setIsLoading(true)

      const sub = supabaseClient
        .from<Required<App>>(`apps:creator_id=eq.${userID}`)
        .on('INSERT', payload => {
          const { new: app, errors } = payload
          if (errors) {
            let err = errors.join('\n')
            setError(err)
          }
          if (app) setApps(a => [...a, app])
        })
        .on('UPDATE', payload => {
          const { new: app, errors } = payload
          if (errors) {
            let err = errors.join('\n')
            setError(err)
          }
          if (app)
            setApps(current => {
              const idx = current.findIndex(a => a.id === app.id)
              if (idx == -1) return current
              current[idx] = {
                ...app,
              }
              return [...current]
            })
        })
        .on('DELETE', payload => {
          const { old: app, errors } = payload
          if (errors) {
            let err = errors.join('\n')
            setError(err)
          }
          if (app) setApps(els => els.filter(el => el.id !== app.id))
        })
        .subscribe()

      supabaseClient
        .from<Required<App>>('apps')
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
    },
    [userID],
  )

  return {
    apps,
    error,
    isLoading,
  }
}

export default useApps
