import {
  forwardRef,
  useRef,
} from 'react'
import { Pencil2Icon } from '@radix-ui/react-icons'

import type { Language } from 'types'
import Output from 'components/Output'
import CodeEditor, { Handler as CodeEditorHandler } from 'components/CodeEditor'
import useSharedSession from 'utils/useSharedSession'
import VerticalResizer from './VerticalResizer'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  function handleEditClick() {
    if (!inputRef || !inputRef.current) return
    inputRef.current.focus()
  }

  return (
    <div className="
      flex
      flex-col
      flex-1
      border
      border-black-700
      rounded-lg
    ">
      <div className="
        flex
        flex-row
        items-center
        space-x-1
        py-1
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
          <Pencil2Icon />
        </div>
        <input
          ref={inputRef}
          className="
            flex-1
            bg-transparent
            text-sm
          "
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>
      <VerticalResizer initHeight={400}>
        <div className="
          rounded-t-lg
          flex-1
          relative
          overflow-hidden
          bg-black-800
        ">
          <CodeEditor
            autofocus={true}
            ref={ref}
            language={language}
            content={code}
            onContentChange={onCodeChange}
            className="absolute inset-0"
          />
        </div>
      </VerticalResizer>
      <div className="
        rounded-t-lg
        flex-1
        relative
        overflow-hidden
      ">
        <Output
          output={session.csOutput}
          className="
            absolute
            inset-0
          "
        />
      </div>
    </div>
  )
})

Code.displayName = 'Code'

export default Code
