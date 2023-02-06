import { originalSourcePlugin } from '@analytics/original-source-plugin'
import Analytics from 'analytics'

import { AppFeedback, appFeedbackEndpoint } from './feedback'

export const editFileDebounce = 3_000 // 3s

export function init(appID: string, debug?: boolean) {
  const analytics = Analytics({
    app: appID,
    debug,
    plugins: [
      originalSourcePlugin(),
    ],
  })

  async function saveUserFeedback(properties: AppFeedback['properties'], feedback?: string) {
    const user = getUser()

    const body: AppFeedback = {
      appId: appID,
      feedback,
      properties: {
        ...user,
        ...properties,
      },
    }

    await fetch(appFeedbackEndpoint, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      cache: 'no-cache',
      mode: 'no-cors',
      body: JSON.stringify(body),
    })
  }

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
    saveUserFeedback,
  }
}
