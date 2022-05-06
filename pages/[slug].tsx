import { useEffect } from 'react'
import { useRouter } from 'next/router'

import useCodeSnippet from 'utils/useCodeSnippet'

function CodeSnippet() {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    console.log({ query: router.query })
  }, [router.query])

  const {
    codeSnippet: cs,
    error,
    isLoading,
  } = useCodeSnippet({ slug })

  console.log({ cs, error, isLoading })

  return (
    <div>Public view of code snippet</div>
  )
}

export default CodeSnippet
