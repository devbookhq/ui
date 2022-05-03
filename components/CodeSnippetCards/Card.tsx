import { CodeSnippet } from 'utils/useUser'
import Text from 'components/typography/Text'
import Edit from 'components/Edit'

interface Props {
  codeSnippet: CodeSnippet
}

const previewLength = 7

function CodeSnippetCard({ codeSnippet: cs }: Props) {
  const lines = cs.code.split('\n')
  const previewLines = lines.slice(0, previewLength)

  const shortened = lines.length > previewLength
  ? previewLines.concat(['...']).join('\n')
  : previewLines.join('\n')


  return (
    <div className="
      max-h-[218px]
      h-full
      w-full
      md:max-w-[320px]

      p-[2px]

      bg-black-700

      hover:bg-green-gradient

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
        <Edit
          initialContent={shortened}
          isReadonly
          height="174px"
        />
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

