import {
  useState,
  useRef,
} from 'react'
import { useRouter } from 'next/router'
import Splitter, { SplitDirection } from '@devbookhq/splitter'

import type { CodeSnippet } from 'types'
import { Tab } from 'utils/newCodeSnippetTabs'
import CodeEditor from 'components/CodeEditor'
import Text from 'components/typography/Text'
import EditIcon from 'components/icons/Edit'

export interface Props {
  code: string
  title: string
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
  output: Output[]
}

export interface Output {
  type: 'stderr' | 'stdout'
  value: string
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

  function handleEditClick() {
    if (!inputRef || !inputRef.current) return
    inputRef.current.focus()
  }

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
            classes={['flex']}
            initialSizes={[85, 15]}
          >
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
            <div className="
              p-2
              font-mono
              text-sm
              flex
              overflow-auto
              whitespace-pre
              flex-col
            ">
              {output.map((o, i) =>
                <div
                  key={i}
                  className={o.type === 'stderr' ? 'text-red-400' : 'text-white-900'}>
                  {o.value}
                </div>
              )
              }
            </div>
          </Splitter>
        </div>
      )
    case Tab.Env:
      return (
        <div />
      )
    default:
      return <p>Unimplemented tab</p>
  }
}

export default CSEditorContent
