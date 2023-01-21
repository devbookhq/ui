import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { listAppFeedback } from 'queries'
import { AppFeedback } from 'queries/types'

function useAppFeedback(appId?: string) {
  const [feedback, setFeedback] = useState<AppFeedback[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    function fetchAppFeedback() {
      if (!appId) return
      setError('')
      setIsLoading(true)

      const sub = supabaseClient
        .from<AppFeedback>(`apps_feedback:id=${appId}`)
        .on('*', p => {
          switch (p.eventType) {
            // We don't subscribe to the UPDATE event because we don't want to receive changes when the apps are edited
            case 'INSERT':
              if (p.errors) {
                const err = p.errors.join('\n')
                setError(err)
              }
              if (p.new)
                setFeedback(f => [
                  ...f,
                  p.new,
                ])
              break
          }
        })
        .subscribe()

      listAppFeedback(supabaseClient, appId)
        .then(a => setFeedback(a))
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
    [appId],
  )

  return {
    feedback,
    error,
    isLoading,
  }
}

export default useAppFeedback
