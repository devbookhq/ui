import { CodeSnippet } from 'utils/useUser'
import Text from 'components/typography/Text'

interface Props {
  codeSnippet: CodeSnippet
}

function CodeSnippetCard({ codeSnippet: cs }: Props) {
  return (
    <div className="
      w-full
      md:max-w-[320px]

      p-[2px]

      bg-black-500
      hover:bg-gradient-to-b
      hover:from-green-200
      hover:to-green-500
      hover:cursor-pointer
      hover:shadow-lg
      hover:shadow-green-500/50

      rounded-lg
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
            whitespace-pre
            line-clamp-10
          ">
            {cs.code}
          </span>
        </div>

        <div className="
          flex-1
          bg-black-800
          p-2
          rounded-b-lg
          truncate
        ">
          <Text
            text="[CHANGE] Code snippet title [CHANGE]"
          />
        </div>
      </div>
    </div>
  )
}


export default CodeSnippetCard

