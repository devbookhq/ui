import { useRouter } from 'next/router'
import { useEffect } from 'react'

function GitHubCallback() {
  const router = useRouter()

  useEffect(function message() {
    if (router.query.access_token) {
      if (window && window.opener) {
        window.opener.postMessage({ accessToken: router.query.access_token }, '*')
        window.close()
      }
    }
  }, [router.query.access_token])

  return null
}

export default GitHubCallback
