import clsx from 'clsx'
import { ColumnsIcon } from 'lucide-react'
import React, {
  ReactNode, useState,
} from 'react'

export interface Props {
  children: ReactNode
}

enum Mode {
  Code,
  Text,
  Both,
}

function Columns({
  children,
}: Props) {
  const [first, ...rest] = React.Children.toArray(children)
  const [mode, setMode] = useState(Mode.Both)

  function cycleMode() {
    setMode(m => {
      switch (m) {
        case Mode.Both:
          return Mode.Text
        case Mode.Code:
          return Mode.Both
        case Mode.Text:
          return Mode.Code
      }
    })
  }

  return (
    <>
      <div className="fixed bottom-0">
        <div className="p-2">
          <ColumnsIcon
            size="18px"
            className="
            text-slate-400
            hover:text-slate-600
            cursor-pointer
          "
            onClick={cycleMode}
          />
        </div>
      </div>
      <div
        className="
        h-full
        max-h-full
        max-w-[100vw]
        flex
        items-start
        justify-center
      "
      >
        <div
          key="first"
          className={clsx(
            `self-stretch
          w-full
          max-w-[calc(100%-5/12*100vw)]
          max-h-full
          p-4
          scroller
          overflow-auto
          `,
            {
              'hidden': mode === Mode.Code,
              'max-w-[calc(100%-5/12*100vw)]': mode === Mode.Both
            }
          )}
        >
          <div className="
          prose
          prose-sm
          prose-slate
          mx-auto
        ">
            {first}
          </div>
        </div>

        <div
          key="rest"
          className={clsx(
            `self-stretch
          w-full
          
          max-h-full
          flex
          overflow-auto
          `,
            {
              'hidden': mode === Mode.Text,
              'max-w-[calc(100%-7/12*100vw)]': mode === Mode.Both,
            }
          )}>
          {rest}
        </div>
      </div>
    </>
  )
}

export default Columns
