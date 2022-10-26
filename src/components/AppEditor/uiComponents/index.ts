import { EditorSetup, UIComponentSetup, UIPropType, UIProps, getUIComponents } from 'core'

import { xStep, yStep } from 'core/EditorProvider/grid'

import CodeEditor, { Icon as CodeEditorIcon } from './CodeEditor'
import Terminal, { Icon as TerminalIcon } from './Terminal'

// Add new board components and their sidebar icons here
export const componentsSetup: UIComponentSetup = {
  Editor: {
    label: 'Editor',
    Icon: CodeEditorIcon,
    Block: CodeEditor,
    defaultSize: {
      width: 30 * xStep,
      height: 32 * yStep,
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
  Terminal: {
    label: 'Terminal',
    Icon: TerminalIcon,
    Block: Terminal,
    defaultSize: {
      width: 30 * xStep,
      height: 20 * yStep,
    },
    props: {} as UIProps<typeof Terminal>,
  },
}

export const editorSetup: EditorSetup = {
  componentsSetup,
}

export const UI = getUIComponents(editorSetup)
