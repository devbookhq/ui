import { CodeEditor as CE, withCasing } from '@devbookhq/react'
import { ComponentProps } from 'react'

export function Icon() {
  return <div></div>
}

const CodeEditorWithCasing = withCasing(CE)

function CodeEditor(props: ComponentProps<typeof CE>) {
  return (
    <div className="flex">
      <CodeEditorWithCasing {...props} />
    </div>
  )
}

export default CodeEditor
