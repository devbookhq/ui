import {
  useEffect,
  useState,
  DependencyList,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  CodeSnippet,
} from 'types'

function useCodeSnippets(userID?: string, deps: DependencyList = []) {
  const [cs, setCS] = useState<CodeSnippet[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [val, setVal] = useState(0)

  function reload() {
    setVal(c => c+1)
  }

  useEffect(function fetchCodeSnippets() {
    if (!userID) return
    if (!isLoading) {
      setIsLoading(true)
      supabaseClient
      .from<CodeSnippet>('code_snippets')
      .select('*')
      .eq('creator_id', userID)
      .then(({ data, error: err }) => {
        if (data) setCS(data)
        if (err) setError(err.message)
        setIsLoading(false)
      })
    }
  }, [userID, val, ...deps])


  return {
    codeSnippets: cs,
    error,
    isLoading,
    reload,
  }
}

export default useCodeSnippets
