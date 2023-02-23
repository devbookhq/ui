import { CodeEditor, CodeEditorProps } from '@devbookhq/code-editor'

import { supportedLanguages } from 'apps/languages'

function Editor(props: Omit<CodeEditorProps, 'supportedLanguages'>) {
  return <CodeEditor
    {...props}
    supportedLanguages={supportedLanguages}
  />
}

export default Editor
