import { forwardRef, useRef } from 'react'

import EditIcon from 'components/icons/Edit'
import type { Language } from 'types'
import Output from 'components/Output'
import CodeEditor, { Handler as CodeEditorHandler } from 'components/CodeEditor'
import useSharedSession from 'utils/useSharedSession'

export interface Props {
  code: string
  title: string
  language: Language
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
}

const Code = forwardRef<CodeEditorHandler, Props>(({
  code,
  title,
  language,
  onCodeChange,
  onTitleChange,
}, ref) => {
  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  const inputRef = useRef<HTMLInputElement>(null)

  function handleEditClick() {
    if (!inputRef || !inputRef.current) return
    inputRef.current.focus()
  }

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
      <CodeEditor
        autofocus={true}
        ref={ref}
        language={language}
        content={code}
        onContentChange={onCodeChange}
        className="overflow-hidden flex flex-1"
      />
      <Output
        output={session.csOutput}
      />
    </div>
  )
})

Code.displayName = 'Code'

export default Code
