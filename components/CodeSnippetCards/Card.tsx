import {
  useEffect,
  useState,
  useRef,
  RefObject,
  DependencyList,
} from 'react'
import type { CodeSnippet } from 'types'
import Text from 'components/typography/Text'
import CodeEditor from 'components/CodeEditor'
import MoreVerticalIcon from 'components/icons/MoreVertical'

interface Props {
  codeSnippet: CodeSnippet
  onClick?: (e: any) => void
}

const previewLength = 8

function useOnClickOutside(ref: RefObject<HTMLElement>, cb: (e: MouseEvent) => any, deps: DependencyList = []) {
  useEffect(function listenToMouseDownEvent() {
    function handleMouseDown(e: MouseEvent) {
      if (e.target && !ref.current?.contains(e.target as Node)) {
        cb(e)
      }
    }

    document.addEventListener('mousedown', handleMouseDown, true)
    return () => document.removeEventListener('mousedown', handleMouseDown, true)
  }, [ref, cb, ...deps])
}

function CodeSnippetCard({
  codeSnippet: cs,
  onClick,
}: Props) {
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

  function onMoreClick(e: any) {
    e.stopPropagation()
    setShowDropdown(c => !c)
  }


  return (
    <div
      ref={cardRef}
      className="
        relative
        w-full
        md:max-w-[320px]

        p-[2px]

        bg-black-700

        hover:bg-green-gradient

        hover:cursor-pointer
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
            onClick={onMoreClick}
          >
            <MoreVerticalIcon/>
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
            <p>hello</p>
          </div>
        )}
      </div>
    </div>
  )
}


export default CodeSnippetCard
