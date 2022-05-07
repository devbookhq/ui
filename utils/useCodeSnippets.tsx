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
  const [val, setVal] = useState(0)

  function reload() {
    setVal(c => c+1)
  }

  useEffect(function fetchCodeSnippets() {
    if (!userID) return
    if (isJobInProcess) return

    setIsJobInProcess(true)
    setIsLoading(true)

    supabaseClient
      .from<CodeSnippet>('code_snippets')
      .select('*')
      .eq('creator_id', userID)
      .then(({ data, error: err }) => {
        if (data) setCS(data)
        if (err) setError(err.message)
      })
      .catch((err: any) => {
        setError(err.message)
      })
      .finally(() => {
        setIsJobInProcess(false)
        setIsLoading(false)
      })
  }, [userID, val])

  return {
    codeSnippets: cs,
    error,
    isLoading,
    reload,
  }
}

export default useCodeSnippets
