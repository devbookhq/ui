import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { listAppFeedback } from 'queries/client'
import { AppFeedback, appsFeedbackTable } from 'queries/db'

function useAppFeedback(devbookAppID?: string) {
  const [feedback, setFeedback] = useState<Required<AppFeedback>[]>([])
  const [error, setError] = useState('err')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    function fetchAppFeedback() {
      if (!devbookAppID) return
      setError('')
      setIsLoading(true)

      const sub = supabaseClient
        .from<Required<AppFeedback>>(`${appsFeedbackTable}:appId=${devbookAppID}`)
        .on('*', p => {
          switch (p.eventType) {
            // We don't subscribe to the UPDATE event because we don't want to receive changes when the apps are edited
            case 'INSERT':
              if (p.errors) {
                const err = p.errors.join('\n')
                console.error(err)
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

      listAppFeedback(supabaseClient, devbookAppID)
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
    [devbookAppID],
  )

  return {
    feedback,
    error,
    isLoading,
  }
}

export default useAppFeedback
