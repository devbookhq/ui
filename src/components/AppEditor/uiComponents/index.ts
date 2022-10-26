import { EditorSetup, UIComponentSetup, UIPropType, UIProps, getUIComponents } from 'core'

import { xStep, yStep } from 'core/EditorProvider/grid'

import CodeEditor, { Icon as CodeEditorIcon } from './CodeEditor'
import Logo, { Icon as LogoIcon } from './Logo'
import Terminal, { Icon as TerminalIcon } from './Terminal'
import Text, { Icon as TextIcon } from './Text'

// Add new board components and their sidebar icons here
export const componentsSetup: UIComponentSetup = {
  Text: {
    label: 'Text',
    Icon: TextIcon,
    Block: Text,
    defaultSize: {
      width: 5 * xStep,
      height: 5 * yStep,
    },
    props: {
      text: {
        type: UIPropType.String,
        label: 'Text',
      },
      size: {
        type: UIPropType.String,
        values: [
          { label: 'Large', value: '3xl' },
          { label: 'Normal', value: 'base' },
          { label: 'Small', value: 'xs' },
        ],
        default: 'base',
        label: 'Text',
      },
    } as UIProps<typeof Text>,
  },
  Logo: {
    label: 'Logo',
    Icon: LogoIcon,
    Block: Logo,
    defaultSize: {
      width: 5 * xStep,
      height: 5 * yStep,
    },
    props: {
      src: {
        type: UIPropType.String,
        label: 'Image source',
      },
    } as UIProps<typeof Logo>,
  },
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
        values: [
          { value: 'Bash' },
          { value: 'Go' },
          { value: 'Nodejs' },
          { value: 'Python3' },
          { value: 'Rust' },
          { value: 'Typescript' },
        ],
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
