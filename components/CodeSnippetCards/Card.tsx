import { CodeSnippet } from 'utils/useUser'

interface Props {
  codeSnippet: CodeSnippet
}

function CodeSnippetCard({ codeSnippet: cs }: Props) {
  return (
    <div className="
      w-full
      md:max-w-[300px]

      p-[2px]

      bg-black-500
      hover:bg-gradient-to-b
      hover:from-green-200
      hover:to-green-500
      hover:cursor-pointer
      hover:shadow-lg
      hover:shadow-green-500/50


      rounded-lg
      select-none
    ">
      <div className="
        flex
        flex-col
        rounded-lg
        bg-black-900
      ">
        <div className="p-2">
          <span className="
            font-mono
            text-sm
          ">
            {cs.code}
          </span>
        </div>

        <div className="
          flex-1
          bg-black-800
          p-2
          rounded-lg
        ">
          <span clasName="">Code snippet title</span>
        </div>
      </div>
    </div>
  )
}


export default CodeSnippetCard

