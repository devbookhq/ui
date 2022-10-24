import { EditorSetup, UIComponentSetup, UIPropType, UIProps, getUIComponents } from 'core'

import CodeEditor, { Icon as CodeEditorIcon } from './CodeEditor'
import Terminal, { Icon as TerminalIcon } from './Terminal'

// Add new board components and their sidebar icons here
export const componentsSetup: UIComponentSetup = {
  [CodeEditor.name]: {
    label: 'Editor',
    Icon: CodeEditorIcon,
    Block: CodeEditor,
    defaultSize: {
      width: 450,
      height: 500,
    },
    props: {
      content: {
        type: UIPropType.String,
        label: 'Initial code',
      },
      language: {
        type: UIPropType.String,
        values: ['Bash', 'Go', 'Nodejs', 'Python3', 'Rust', 'Typescript'],
        label: 'Language',
        default: 'Nodejs',
      },
      isReadOnly: {
        type: UIPropType.Boolean,
        label: 'Read-only',
        default: false,
      },
    } as UIProps<typeof CodeEditor>,
  },
  [Terminal.name]: {
    label: 'Terminal',
    Icon: TerminalIcon,
    Block: Terminal,
    defaultSize: {
      width: 450,
      height: 300,
    },
    props: {} as UIProps<typeof Terminal>,
  },
}

export const editorSetup: EditorSetup = {
  componentsSetup,
}

export const UI = getUIComponents(editorSetup)
