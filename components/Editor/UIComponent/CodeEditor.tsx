import { CodeEditor as CE, withCasing } from '@devbookhq/react'

export function Icon() {
  return <div>Editor</div>
}

const CodeEditorWithCasing = withCasing(CE)

function CodeEditor() {
  return (
    <div className="flex">
      <CodeEditorWithCasing content="Test" />
    </div>
  )
}

export default CodeEditor
