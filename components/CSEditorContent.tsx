import {
  useState,
  useRef,
} from 'react'
import { useRouter } from 'next/router'
import Splitter, { SplitDirection } from '@devbookhq/splitter'

import { Tab } from 'utils/newCodeSnippetTabs'
import { CodeSnippetOutput } from 'utils/useCodeSnippetSession'
import CodeEditor from 'components/CodeEditor'
import EditIcon from 'components/icons/Edit'
import Output from 'components/Output'
import Deps from 'components/Deps'

export interface Props {
  code: string
  title: string
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
  output: CodeSnippetOutput[]
}

function CSEditorContent({
  code,
  title,
  output,
  onCodeChange,
  onTitleChange,
}: Props) {
  const router = useRouter()
  const tab = router.query.tab
  const inputRef = useRef<HTMLInputElement>(null)
  const [sizes, setSizes] = useState<number[]>([85, 15])

  function handleEditClick() {
    if (!inputRef || !inputRef.current) return
    inputRef.current.focus()
  }

  switch (tab) {
    case Tab.Code:
      return (
        <div className="
          flex
          flex-1
          flex-col
          overflow-hidden
          border
          border-black-700
          rounded-lg
        ">
          <div className="
            flex
            flex-row
            space-x-1
            py-1.5
            px-2
            rounded-t-lg
            bg-black-700
          ">
            <div
              className="
                p-1
                rounded
                cursor-pointer
                text-white-900/50
                hover:text-white-900
              "
              onClick={handleEditClick}
            >
              <EditIcon />
            </div>
            <input
              ref={inputRef}
              className="
                flex-1
                bg-transparent
              "
              value={title}
              onChange={e => onTitleChange(e.target.value)}
            />
          </div>
          <Splitter
            direction={SplitDirection.Vertical}
            classes={['flex overflow-hidden min-h-0', 'flex overflow-hidden']}
            initialSizes={sizes}
            onResizeFinished={(_, sizes) => setSizes(sizes)}
          >
            <div className="flex flex-1 overflow-hidden">
              <CodeEditor
                content={code}
                onContentChange={onCodeChange}
                className="flex flex-1 overflow-hidden"
              />
            </div>
            <Output
              output={output}
            />
          </Splitter>
        </div>
      )
    case Tab.Deps:
      return (
        <Deps/>
      )
    default:
      return <p>Unimplemented tab</p>
  }
}

export default CSEditorContent
