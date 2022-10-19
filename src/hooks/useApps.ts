import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useEffect, useState } from 'react'

import { getApps } from 'utils/queries/queries'
import { App } from 'utils/queries/types'

function useApps(userID?: string) {
  const [apps, setApps] = useState<Required<App>[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    function fetchApps() {
      if (!userID) return
      setError('')
      setIsLoading(true)

      const sub = supabaseClient
        .from<Required<App>>(`apps:creator_id=eq.${userID}`)
        .on('*', p => {
          console.log(p)
          switch (p.eventType) {
            case 'INSERT':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              if (p.new) setApps(a => [...a, p.new])
              break
            case 'UPDATE':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              if (p.new)
                setApps(current => {
                  const idx = current.findIndex(a => a.id === p.new.id)
                  if (idx == -1) return current
                  current[idx] = {
                    ...p.new,
                  }
                  return [...current]
                })
              break
            case 'DELETE':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              setApps(els => els.filter(el => el.id !== p.old.id))
              break
          }
        })
        .subscribe()

      getApps(supabaseClient, userID)
        .then(a => {
          setApps(a)
        })
        .catch((e: Error) => {
          setError(e.message)
        })
        .finally(() => {
          setIsLoading(false)
        })

      return () => {
        sub.unsubscribe()
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
