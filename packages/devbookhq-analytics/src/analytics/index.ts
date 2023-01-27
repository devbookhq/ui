import { originalSourcePlugin } from '@analytics/original-source-plugin'
import Analytics from 'analytics'

export const editFileDebounce = 3_000 // 3s

export function init(appID: string, debug?: boolean) {
  const analytics = Analytics({
    app: appID,
    debug,
    plugins: [
      originalSourcePlugin(),
    ],
  })

  function getUser() {
    const userId: string | undefined = analytics.user('userId')
    const anonymousId: string | undefined = analytics.user('anonymousId')

    return {
      userId,
      anonymousId,
    }
  }

  // Add the current URL to the track event
  analytics.on('trackStart', (data) => {
    const search = window.location.search
    data.payload.properties = {
      ...data.payload.properties,
      $url_path: window.location.pathname,
      $url_search: search && search.length > 0 ? search : undefined,
    }
  })

  return {
    analytics,
    getUser,
  }
}
