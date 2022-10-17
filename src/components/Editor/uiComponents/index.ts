import { UIComponentSetup, UIPropType, UIProps, getUIComponents } from 'core'

import CodeEditor, { Icon as CodeEditorIcon } from './CodeEditor'
import Terminal, { Icon as TerminalIcon } from './Terminal'

// Add new board components and their sidebar icons here
export const uiComponentsSetup: UIComponentSetup = {
  [CodeEditor.name]: {
    label: 'Code editor',
    Icon: CodeEditorIcon,
    Block: CodeEditor,
    props: {
      content: {
        type: UIPropType.string,
        label: 'Content',
        default: '<code>',
      },
      language: {
        type: UIPropType.string,
        values: ['Bash', 'Go', 'Nodejs', 'Python3', 'Rust', 'Typescript'],
        label: 'Language',
        default: 'Nodejs',
      },
      isReadOnly: {
        type: UIPropType.boolean,
        label: 'Read-only',
        default: false,
      },
    } as UIProps<typeof CodeEditor>,
  },
  [Terminal.name]: {
    label: 'Terminal',
    Icon: TerminalIcon,
    Block: Terminal,
    props: {} as UIProps<typeof Terminal>,
  },
}

export const { EditorBoardBlock, DraggedBoardBlock, PreviewBoardBlock, SidebarIcon } =
  getUIComponents(uiComponentsSetup)
