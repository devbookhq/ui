import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useEffect, useState } from 'react'

import { getApps } from 'queries/client'
import { App } from 'queries/db'

function useApps(userID?: string) {
  const [apps, setApps] = useState<Pick<App, 'id' | 'title' | 'created_at'>[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    function fetchApps() {
      if (!userID) return
      setError('')
      setIsLoading(true)

      const sub = supabaseClient
        .from<App>(`apps:creator_id=eq.${userID}`)
        .on('*', p => {
          switch (p.eventType) {
            // We don't subscribe to the UPDATE event because we don't want to receive changes when the apps are edited
            case 'INSERT':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              if (p.new)
                setApps(a => [
                  ...a,
                  { created_at: p.new.created_at, id: p.new.id, title: p.new.title },
                ])
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
          setApps(
            a.map(app => ({
              id: app.id,
              title: app.title,
              created_at: app.created_at,
            })),
          )
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
