import { useRouter } from 'next/router'
import { useEffect } from 'react'
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) throw new Error('Missing "NEXT_PUBLIC_POSTHOG_KEY"')
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
}

export function usePostHog() {
  const router = useRouter()

  useEffect(() => {
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
