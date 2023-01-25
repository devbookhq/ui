import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect } from 'react'

export function usePostHog() {
  const router = useRouter()

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') return
    // This is a public key
    posthog.init('phc_Gs5E0b4K2ANz8GyCkWEZxy6XEtG40yF5PMiEHAzwEWE', { api_host: 'https://app.posthog.com' })

    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])
}
