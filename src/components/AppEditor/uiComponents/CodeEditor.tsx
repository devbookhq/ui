import { CodeEditor as CE } from '@devbookhq/react'
import { Code } from 'lucide-react'
import { ComponentProps } from 'react'

export function Icon() {
  return <Code size="18px" />
}

function CodeEditor(props: ComponentProps<typeof CE>) {
  return (
    <div
      className="
    m-0.5
    flex
    flex-1
    flex-col
    overflow-hidden
    rounded-lg
  "
    >
      <CE
        {...props}
        className="flex flex-1"
      />
    </div>
  )
}

export default CodeEditor
