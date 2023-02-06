import { AnalyticsInstance } from 'analytics'
import { logger } from '../logger'

type PayloadType = 'track' | 'identify' | 'page'

export interface Payload {
  type: PayloadType
  event?: string
  traits?: any
  properties?: any
  options?: any
  context?: any
  userId?: string
  anonymousId?: string
  meta: {
    appId: string
    rid: string
    ts: number
    hasCallback: never
  }
}

export type AnalyticsFunc<C> = (data: { payload: Payload, config: C }) => any

interface Config {
  appID: string
  writeKey?: string
  debug?: boolean
  url?: string
  dry?: boolean
}

/**
 * We want to add autocapture like PostHog -
 * https://github.com/PostHog/posthog-js/blob/master/src/autocapture.ts
 * so there is no need to set up custom events by default.
 * Autocapture could work really well with embedded Devbook guides/examples.
 *
 * We also want to add batching here and batch processing to backend analysis service
 * https://github.com/DavidWells/analytics/tree/master/packages/analytics-util-queue
 *
 */
export class DevbookPlugin implements Record<string, unknown> {
  readonly name = 'devbook'
  readonly NAMESPACE = this.name
  readonly defaultURL = 'https://ingest-7d2cl2hooq-uc.a.run.app/in'
  readonly url: string

  // eslint-disable-next-line no-undef
  [analyticsKey: string]: any;

  private transformPayload(payload: Payload) {
    delete payload.meta['hasCallback']
    payload.meta.appId = this.config.appID
    // Convert nanoseconds timestamp to microseconds timestamp
    payload.meta.ts = Math.floor(payload.meta.ts / 1000)

    const info = this.analytics.getState()

    payload.context = {
      os: info?.context?.os?.name,
      sessionId: info?.context?.sessionId,
      locale: info?.context?.locale,
      referrer: info?.context?.referrer,
      timezone: info?.context?.timezone,
      userAgent: info?.context?.userAgent,
    }

    return payload
  }

  private async send(payload: Payload) {
    const transformedPayload = this.transformPayload(payload)

    if (this.config.debug) {
      this.log(JSON.stringify(transformedPayload, null, 2))
    }

    if (this.config.dry) return

    try {
      await fetch(this.url, {
        method: 'POST',
        cache: 'no-cache',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.writeKey ? { 'Authorization': `Basic ${this.config.writeKey}` } : {},
        },
        body: JSON.stringify(transformedPayload),
      })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : JSON.stringify(err)
      this.log(errMessage)
    }
  }

  constructor(readonly config: Config, private readonly log = logger('Devbook Analytics'), private readonly analytics: AnalyticsInstance) {
    this.url = config.url || this.defaultURL
  }

  initialize: AnalyticsFunc<Config> = (data) => {
    if (data.config.debug) {
      this.log('Initialize')
    }
  }
  page: AnalyticsFunc<Config> = (data) => {
    return this.send(data.payload)
  }
  identify: AnalyticsFunc<Config> = (data) => {
    return this.send(data.payload)
  }
  loaded: AnalyticsFunc<Config> = (data) => {
    return true
  }
  track: AnalyticsFunc<Config> = (data) => {
    return this.send(data.payload)
  }
  ready: AnalyticsFunc<Config> = (data) => {
    if (data.config.debug) {
      this.log('Ready')
    }
  }
}

// {
//   "type": "track",
//   "event": "Open link",
//   "properties": {
//     "url": "https://www.prisma.io/docs/getting-started/quickstart?utm_source=devbook"
//   },
//   "options": {},
//   "userId": "userID",
//   "anonymousId": "a228a47a-1657-4466-926c-a8c2361dce89",
//   "meta": {
//     "rid": "217b1b81-1b20-47bb-a1fe-15e9e5cef561",
//     "ts": 1670883537706,
//     "hasCallback": true
//   }
// }

// {
//   "type": "identify",
//   "userId": "userID",
//   "traits": {},
//   "options": {},
//   "anonymousId": "a228a47a-1657-4466-926c-a8c2361dce89",
//   "meta": {
//     "rid": "d0445344-b8ac-4c4d-aa24-5face745252b",
//     "ts": 1670883503508,
//     "hasCallback": true
//   }
// }

// {
//   "type": "page",
//   "properties": {
//     "title": "Developer Hub | Prisma",
//     "url": "https://3000-devbookhq-prismahub-5bn7w61tk3k.ws-eu78.gitpod.io/",
//     "path": "/",
//     "hash": "",
//     "search": "",
//     "width": 1406,
//     "height": 764,
//     "referrer": "https://devbookhq-prismahub-5bn7w61tk3k.ws-eu78.gitpod.io/"
//   },
//   "options": {},
//   "userId": null,
//   "anonymousId": "a228a47a-1657-4466-926c-a8c2361dce89",
//   "meta": {
//     "rid": "3a334a71-96bf-45a0-856a-9ffc3afe386e",
//     "ts": 1670883455273,
//     "hasCallback": true
//   }
// }
