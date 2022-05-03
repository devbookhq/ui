import { CodeSnippet } from 'utils/useUser'

interface Props {
  codeSnippet: CodeSnippet
}

function CodeSnippetCard({ codeSnippet: cs }: Props) {
  return (
    <div className="
      w-full
      md:max-w-[300px]
      p-4
      border
      border-black-500
      rounded-lg
    ">
      {cs.id}
    </div>
  )
}


export default CodeSnippetCard
