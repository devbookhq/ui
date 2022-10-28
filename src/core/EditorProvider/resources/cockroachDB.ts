import { api } from '@devbookhq/sdk'

const createCockroachDB = api.path('/prisma-hub/db').method('post').create()

const cacheKey = 'cockroachDB'

export async function getURL(cache?: boolean) {
  const url = cache ? localStorage.getItem(cacheKey) : (await createCockroachDB({})).url

  if (!url) {
    throw new Error('CockroachDB URL from server was empty')
  }

  if (cache) {
    localStorage.setItem(cacheKey, url)
  }

  return url
}
