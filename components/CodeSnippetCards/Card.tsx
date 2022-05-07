import {
  useEffect,
  useState,
  useRef,
  RefObject,
  DependencyList,
} from 'react'
import { useRouter } from 'next/router'

import type { CodeSnippet } from 'types'
import Text from 'components/typography/Text'
import CodeEditor from 'components/CodeEditor'
import MoreVerticalIcon from 'components/icons/MoreVertical'
import { showErrorNotif } from 'utils/notification'
import useOnClickOutside from 'utils/useOnClickOutside'

import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

interface Props {
  codeSnippet: CodeSnippet
  onClick?: (e: any) => void
  onDelete?: (cs: CodeSnippet) => void
}

const previewLength = 8

function CodeSnippetCard({
  codeSnippet: cs,
  onClick,
  onDelete,
}: Props) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(cardRef, () => {
    setShowDropdown(false)
  }, [])

  const lines = cs.code?.split('\n') || []
  const previewLines = lines.slice(0, previewLength)

  const shortened = lines.length > previewLength
  ? previewLines.concat(['...']).join('\n')
  : previewLines.join('\n')

  function handleOnMoreClick(e: any) {
    e.stopPropagation()
    setShowDropdown(c => !c)
  }

  async function handleOnDeleteClick(e: any) {
    if (confirm(`Are you sure you want to delete '${cs.title}'? This cannot be reversed.`)) {
      try {
        const { error, ...rest } = await supabaseClient
          .from<CodeSnippet>('code_snippets')
          .delete()
          .eq('id', cs.id)
        if (error) throw error

        onDelete?.(cs)
      } catch(err: any) {
        showErrorNotif(`Error: ${err.message}`)
        setShowDropdown(false)
      }
    }
  }

  return (
    <div
      ref={cardRef}
      className="
        relative
        w-full
        md:max-w-[320px]
    ">
      <div
        ref={cardRef}
        className="
          p-[2px]

          bg-black-700
          cursor-pointer

          hover:bg-green-gradient
          hover:shadow-lg
          hover:shadow-green-500/50

          rounded-lg"
          onClick={onClick}
        >
        <div className="
          flex
          flex-col
          rounded-lg
          bg-black-900
        ">
          <div className="
            bg-black-900
            rounded-lg
          ">
            <CodeEditor
              isReadonly
              className="preview"
              height="174px"
              content={shortened}
            />
          </div>

          <div className="
            flex-1
            flex
            items-center
            justify-between
            bg-black-800
            p-2
            rounded-b-lg
            truncate
          ">
            <Text
              text={cs.title}
            />
            <div
              className="
                p-1
                rounded
                hover:bg-black-700
              "
              onClick={handleOnMoreClick}
            >
              <MoreVerticalIcon/>
            </div>
          </div>


        </div>
      </div>

      {showDropdown && (
        <div
          className="
            absolute
            p-1
            px-2
            z-10
            rounded
            bg-black-700
            hover:bg-[#504E55]
          "
          style={{
            left: 'calc(100% - 53px)',
            top: 'calc(100% - 6px)',
          }}
        >
          <Text
            className="
              cursor-pointer
            "
            text="Delete"
            onClick={handleOnDeleteClick}
          />
        </div>
      )}
    </div>
  )
}


export default CodeSnippetCard
