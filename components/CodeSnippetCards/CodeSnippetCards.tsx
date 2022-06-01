import {
  useMemo,
} from 'react'
import { useRouter } from 'next/router'

import { CodeSnippet } from 'types'
import CodeSnippetCard from './Card'


export interface Props {
  codeSnippets: CodeSnippet[]
  onCodeSnippetDeletion: (cs: CodeSnippet) => void
}

function sortSnippets(a: CodeSnippet, b: CodeSnippet) {
  if (a.title < b.title) return -1
  if (a.title > b.title) return 1
  return 0
}

function CodeSnippetCards({
  codeSnippets,
  onCodeSnippetDeletion,
}: Props) {
  const router = useRouter()
  const sorted = useMemo(() => codeSnippets.sort((a, b) => sortSnippets(a, b)), [codeSnippets])

  function openCodeSnippet(cs: CodeSnippet) {
    router.push({
      pathname: '/dashboard/[slug]/edit',
      query: {
        tab: 'code',
        slug: cs.slug,
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
          onDelete={onCodeSnippetDeletion}
        />
      ))}
    </div>
  )
}


export default CodeSnippetCards
