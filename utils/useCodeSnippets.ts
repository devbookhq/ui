import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  CodeSnippet,
} from 'types'

function useCodeSnippets(userID?: string) {
  const [cs, setCS] = useState<CodeSnippet[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isJobInProcess, setIsJobInProcess] = useState(false)

  useEffect(function fetchCodeSnippets() {
    if (!userID) return
    if (isJobInProcess) return

    setIsJobInProcess(true)
    setIsLoading(true)

    const sub = supabaseClient
      .from<CodeSnippet>(`code_snippets:creator_id=eq.${userID}`)
      .on('INSERT', payload => {
        const { new: cs, errors } = payload
        if (errors) {
          let err = errors.join('\n')
          setError(err)
        }
        if (cs) setCS(c => [...c, cs])
      })
      .on('UPDATE', payload => {
        const { new: cs, errors } = payload
        if (errors) {
          let err = errors.join('\n')
          setError(err)
        }
        if (cs) setCS(current => {
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
        if (cs) setCS(els => els.filter(el => el.id !== cs.id))
      })
      .subscribe()

    supabaseClient
      .from<CodeSnippet>('code_snippets')
      .select('*')
      .eq('creator_id', userID)
      .then(({ data, error: err }) => {
        if (data) setCS(data)
        if (err) setError(err.message)
        setIsJobInProcess(false)
        setIsLoading(false)
      })

    return () => {
      supabaseClient.removeSubscription(sub)
    }
  }, [userID])

  return {
    codeSnippets: cs,
    error,
    isLoading,
  }
}

export default useCodeSnippets
