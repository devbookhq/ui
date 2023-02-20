import { ReactNode } from 'react'
import { useAppContext } from '../AppContext'

export interface Props {
  children?: ReactNode
  lines?: number[]
}

function Explanation({ children, lines }: Props) {
  const [, setAppCtx] = useAppContext()

  return (
    <div
      className="my-2 hover:bg-slate-300 rounded transition-all cursor-pointer border cursor-"
      onMouseEnter={() => {
        if (!lines) return
        setAppCtx(a => ({
          ...a,
          codeEditor: {
            ...a?.codeEditor,
            highlightedLines: lines,
          },
        }))
      }}
      onMouseLeave={() => {
        if (!lines) return
        setAppCtx(a => ({
          ...a,
          codeEditor: {
            ...a?.codeEditor,
            highlightedLines: undefined,
          },
        }))
      }}
    >
      {children}
    </div>
  )
}

export default Explanation
