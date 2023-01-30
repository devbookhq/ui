import { useRouter } from 'next/router'
import { useMemo } from 'react'
import JSONCrush from 'jsoncrush'

import AppPage from 'components/AppPage'
import { Guide } from 'guides/content/Guide'

function useDevPageProps() {
  const router = useRouter()

  const guide = useMemo(() => {
    if (!router.query.guide) return
    if (typeof router.query.guide !== 'string') return

    return JSON.parse(JSONCrush.uncrush(router.query.guide)) as Guide
  }, [router.query.guide])

  return {
    guide,
  }
}

function DevPage() {
  const { guide } = useDevPageProps()
  if (!guide) {
    return <div>Loading...</div>
  }

  return <AppPage guide={guide} />
}

export default DevPage
