import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useEffect, useState } from 'react'

import { getEnvs } from 'queries'
import { Env } from 'queries/types'

function useEnvs(userID?: string) {
  const [envs, setEnvs] = useState<Pick<Env, 'id' | 'title' | 'created_at' | 'template'>[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    function fetchEnvs() {
      if (!userID) return
      setError('')
      setIsLoading(true)

      const sub = supabaseClient
        .from<Env>(`envs:creator_id=eq.${userID}`)
        .on('*', p => {
          switch (p.eventType) {
            // We don't subscribe to the UPDATE event because we don't want to receive changes when the envs are edited
            case 'INSERT':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              if (p.new)
                setEnvs(a => [
                  ...a,
                  { created_at: p.new.created_at, id: p.new.id, title: p.new.title, template: p.new.template },
                ])
              break
            case 'DELETE':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              setEnvs(els => els.filter(el => el.id !== p.old.id))
              break
          }
        })
        .subscribe()

      getEnvs(supabaseClient, userID)
        .then(a => {
          setEnvs(
            a.map(env => ({
              id: env.id,
              title: env.title,
              created_at: env.created_at,
              template: env.template,
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
    envs,
    error,
    isLoading,
  }
}

export default useEnvs
