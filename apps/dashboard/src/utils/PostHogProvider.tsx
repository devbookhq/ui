import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import posthog, { PostHog } from 'posthog-js'

import {
  ReactNode,
  createContext,
} from 'react'

interface PosthogProviderProps {
  children: ReactNode | ReactNode[] | null
  token?: string
}

export const postHogContext = createContext<PostHog | undefined>(undefined)

export function PostHogProvider({
  children,
  token,
}: PosthogProviderProps) {
  const router = useRouter()
  const initialized = useRef<boolean>(false)

  useEffect(() => {
    if (!initialized.current && token) {
      posthog.init(token, { api_host: 'https://app.posthog.com', })
      initialized.current = true
    }
  }, [token])

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

  return (
    <postHogContext.Provider value={undefined}>
      {children}
    </postHogContext.Provider>
  )
}
