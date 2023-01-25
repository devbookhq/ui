import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect } from 'react'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_6XVN4bgb5toqA4ZqbBDBDkLAiNR3K5MwS9dfTW9ZOXP', { api_host: 'https://app.posthog.com' })
  }

  return posthog
}

export function usePostHog() {
  const router = useRouter()

  useEffect(() => {
    // Init for auto capturing
    const posthog = initPostHog()

    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        posthog.capture('$pageview')
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
