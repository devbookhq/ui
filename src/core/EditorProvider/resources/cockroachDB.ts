import { api } from '@devbookhq/sdk'

import { showErrorNotif } from 'utils/notification'

const createCockroachDB = api.path('/prisma-hub/db').method('post').create()

const cacheKey = 'cockroachDB'

export async function getURL(cache?: boolean) {
  let url: string | null | undefined

  if (cache) {
    url = localStorage.getItem(cacheKey)
  }

  if (!url) {
    try {
      const result = await createCockroachDB({})
      url = result.data.dbURL
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error(msg)
      showErrorNotif(msg)
    }
  }

  if (cache) {
    if (url) {
      localStorage.setItem(cacheKey, url)
    }
  } else {
    localStorage.removeItem(cacheKey)
  }

  return url ? url : undefined
}
