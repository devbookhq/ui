import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UrlObject } from 'url'

export interface Props {
  page: string
}

function Navigate({
  page,
}: Props) {
  const [href, setHref] = useState<UrlObject>()

  useEffect(function getLink() {
    setHref(page ? {
      pathname: `${window.location.pathname}/[page]`,
      query: {
        page,
      },
    } : {
      pathname: window.location.pathname
    })
  }, [page])

  return (
    <Link
      href={href || {}}
    >
      {href?.pathname}
    </Link>
  )
}

export default Navigate
