import { useState } from 'react'
import { useRouter } from 'next/router'

import type { CodeSnippet } from 'types'
import { Tab } from 'utils/newCodeSnippetTabs'
import CodeEditor from 'components/CodeEditor'
import Text from 'components/typography/Text'

interface Props {
  code: string
  title: string
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
}

function NewCodeSnippetContent({
  code,
  title,
  onCodeChange,
  onTitleChange,
}: Props) {
  const router = useRouter()
  const tab = router.query.tab

  switch (tab) {
    case Tab.Code:
      return (
        <div className="
          flex-1
          flex
          flex-col
          items-stretch
          border
          border-black-700
          rounded-lg
        ">

          <div className="
            flex
            py-1.5
            px-2
            rounded-t-lg
            bg-black-700
          ">
            <input
              className="
                flex-1
                bg-transparent
              "
              value={title}
              onChange={e => onTitleChange(e.target.value)}
            />
          </div>
          <div className="
            flex-1
            relative
            overflow-hidden
            bg-black-800
            rounded-b-lg
          ">
            <CodeEditor
              content={code}
              onContentChange={onCodeChange}
              className="
                absolute
                inset-0
              "
            />
          </div>
        </div>
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
