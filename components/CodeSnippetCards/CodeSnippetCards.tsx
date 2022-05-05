import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter }  from 'next/router'

import { CodeSnippet } from 'types'
import CodeSnippetCard from './Card'


interface Props {
  codeSnippets: CodeSnippet[]
}

function CodeSnippetCards({ codeSnippets }: Props) {
  const router = useRouter()

  function openCodeSnippet(cs: CodeSnippet) {
    router.push(`/${cs.slug}/edit?tab=code`)
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
      {codeSnippets.length && codeSnippets.map(cs => (
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
