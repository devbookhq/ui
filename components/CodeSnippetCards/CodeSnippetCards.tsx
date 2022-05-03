import { ReactNode } from 'react'

import { CodeSnippet } from 'utils/useUser'
import CodeSnippetCard from './Card'


interface Props {
  codeSnippets: CodeSnippet[]
}

function CodeSnippetCards({ codeSnippets }: Props) {
  return (
    <div className="
      flex
      flex-col
      items-center
      space-y-4

      md:flex-row
      md:flex-wrap
      md:space-y-0
      md:gap-4
    ">
      {codeSnippets.length && codeSnippets.map(cs => (
        <>
        <CodeSnippetCard
          key={cs.id}
          codeSnippet={cs}
        />
        <CodeSnippetCard
          key={cs.id}
          codeSnippet={cs}
        />
        <CodeSnippetCard
          key={cs.id}
          codeSnippet={cs}
        />
        </>
      ))}
    </div>
  )
}


export default CodeSnippetCards
