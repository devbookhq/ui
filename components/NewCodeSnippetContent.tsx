import { useRouter } from 'next/router'
import { Tab } from 'utils/newCodeSnippetTabs'
import CodeEditor from 'components/CodeEditor'
import Text from 'components/typography/Text'

interface Props {
  code: string
  onContentChange: any
}

function NewCodeSnippetContent({ code, onContentChange }: Props) {
  const router = useRouter()
  const tab = router.query.tab

  switch (tab) {
    case Tab.Code:
      return (
        <>
          <div className="
            flex-1
            relative
            overflow-hidden
            bg-black-800
            border-black-700
            border
            rounded-lg
          ">
            <CodeEditor
              content={code}
              onContentChange={onContentChange}
              className="
                absolute
                inset-0
              "
            />
          </div>
          <div className="
            hidden
            lg:flex
            lg:flex-col
            lg:items-start
            lg:space-y-4
          ">
            <Text
              text="URL will go here"
            />
            <Text
              text="Embed will go here"
            />
          </div>
        </>
      )
    case Tab.Env:
      return (
        <div/>
      )
    default:
      return <p>Unimplemented tab</p>
  }
}

export default NewCodeSnippetContent
