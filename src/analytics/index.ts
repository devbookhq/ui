const url = 'https://api.magicbell.com/notifications'

interface AnalyticsEvent {
  category: string
  title: string
  email: string
  content: {
    project: string
    timestamp?: string
    type: string
    message: string
    action?: string
  },
}

let MAGICBELL_API_KEY: string | undefined
let MAGICBELL_API_SECRET: string | undefined

export function initAnalytics({ apiKey, apiSecret }: { apiKey: string, apiSecret: string }) {
  MAGICBELL_API_KEY = apiKey
  MAGICBELL_API_SECRET = apiSecret
}

async function sendAnalyticsEvent(event: AnalyticsEvent) {
  if (!MAGICBELL_API_KEY || !MAGICBELL_API_SECRET) throw new Error('No Magicbell API key of API secret')

  await fetch(url, {
    method: 'POST',
    headers: {
      'X-MAGICBELL-API-KEY': MAGICBELL_API_KEY,
      'X-MAGICBELL-API-SECRET': MAGICBELL_API_SECRET,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      "notification": {
        "title": "Analytics event",
        "content": JSON.stringify({
          timestamp: new Date().getTime().toString(),
          ...event.content,
        }),
        "category": "analytics_event",
        "recipients": [{
          "email": event.email,
        }],
      }
    })
  })
}


export function sendEvent(content: AnalyticsEvent['content']) {
  return sendAnalyticsEvent({
    email: 'tomas@usedevbook.com',
    category: 'event',
    title: 'New analytics event',
    content,
  })
}
