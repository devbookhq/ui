const delimiter = '-'

export function getID(slug: string) {
  const last = slug.lastIndexOf(delimiter)
  const id = slug.substring(last + 1, slug.length)
  return id
}

export function getSlug(id: string, title: string) {
  return `${title}${delimiter}${id}`
}
