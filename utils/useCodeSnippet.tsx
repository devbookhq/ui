import {
  useEffect,
  useState,
} from 'react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import type {
  CodeSnippet,
} from 'types'

function useCodeSnippet({ slug, id }: { slug?: string, id?: string }) {
  const [cs, setCS] = useState<CodeSnippet | undefined>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(function fetchCodeSnippet() {
    if (!slug && !id) return
    if (isLoading) return

    setIsLoading(true)

    let key = ''
    let val = ''
    if (slug) {
      key = 'slug'
      val = slug
    }

    if (id) {
      key = 'id'
      val = id
    }

    supabaseClient
      .from<CodeSnippet>('code_snippets')
      .select('*')
      .eq(key, val)
      .single()
      .then(({ data, error: err }) => {
        if (data) setCS(data)
        if (err) setError(err.message)
        setIsLoading(false)
      })

  }, [slug, id])

  return {
    codeSnippet: cs,
    error,
    isLoading,
  }
}

export default useCodeSnippet
