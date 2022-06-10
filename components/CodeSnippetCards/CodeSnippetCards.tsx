import {
  useMemo,
} from 'react'
import { useRouter } from 'next/router'

import { CodeSnippet } from 'types'
import CodeSnippetCard from './Card'


export interface Props {
  codeSnippets: CodeSnippet[]
}

function CodeSnippetCards({
  codeSnippets,
}: Props) {
  console.log({ codeSnippets })
  const router = useRouter()
  const sorted = useMemo(() => codeSnippets.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [codeSnippets],
  )

  function openCodeSnippet(cs: CodeSnippet) {
    const slug = `${cs.title}-${cs.id}`
    router.push({
      pathname: '/dashboard/[slug]/edit',
      query: {
        tab: 'code',
        slug: slug,
      },

    })
  }

  return (
    <div className="
      flex
      flex-col
      items-start
      justify-start
      space-y-4

      md:flex-row
      md:flex-wrap
      md:space-y-0
      md:gap-4
    ">
      {codeSnippets.length && sorted.map(cs => (
        <CodeSnippetCard
          key={cs.id}
          codeSnippet={cs}
          onClick={() => openCodeSnippet(cs)}
        />
      ))}
    </div>
  )
}


export default CodeSnippetCards
