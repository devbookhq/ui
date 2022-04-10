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
  },
}

const MAGICBELL_API_KEY = '6bf4652df6d418a88992859dd9d59b4942c770b3'
const MAGICBELL_API_SECRET = 'gkvvO5aB575RrD8BYJ/D//vdRR9dxcH8k1zJZz14'

export async function sendAnalyticsEvent(event: AnalyticsEvent) {
  const response = await fetch(url, {
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
        "custom_attributes": {
          "order": {
            "id": "1202983",
            "title": "A title you can use in your templates"
          }
        }
      }
    })
  })

  return response.json()
}
