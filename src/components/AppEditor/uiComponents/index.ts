import { EditorSetup, UIComponentSetup, UIPropType, UIProps, getUIComponents } from 'core'

import { xStep, yStep } from 'core/EditorProvider/grid'

import Editor, { Icon as EditorIcon } from './Editor'
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
        default: 'Text',
      },
      weight: {
        label: 'Weight',
        type: UIPropType.String,
        values: [
          { label: 'Normal', value: 'normal' },
          { label: 'Bold', value: 'bold' },
        ],
        default: 'normal',
      },
      size: {
        type: UIPropType.String,
        values: [
          { label: 'Large', value: '3xl' },
          { label: 'Normal', value: 'base' },
          { label: 'Small', value: 'xs' },
        ],
        default: 'base',
        label: 'Size',
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
    Icon: EditorIcon,
    Block: Editor,
    defaultSize: {
      width: 24 * xStep,
      height: 28 * yStep,
    },
    props: {
      files: {
        label: 'Tabs',
        default: [] as {
          name: string
          content: string
          language:
            | 'Nodejs'
            | 'Go'
            | 'Bash'
            | 'Rust'
            | 'Python3'
            | 'Typescript'
            | undefined
        }[],
        nestedLabel: 'Tab',
        nestedType: {
          content: {
            type: UIPropType.String,
            label: 'Content',
            default: '',
          },
          name: {
            type: UIPropType.String,
            label: 'Filename',
            default: '',
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
        },
        type: UIPropType.Array,
      },
      isEditable: {
        type: UIPropType.Boolean,
        label: 'Editable',
        default: true,
      },
    } as UIProps<typeof Editor>,
  },
  Terminal: {
    label: 'Terminal',
    Icon: TerminalIcon,
    Block: Terminal,
    defaultSize: {
      width: 26 * xStep,
      height: 20 * yStep,
    },
    props: {
      cmd: {
        label: 'Execution command',
        type: UIPropType.String,
      },
    } as UIProps<typeof Terminal>,
  },
}

export const editorSetup: EditorSetup = {
  componentsSetup,
}

export const UI = getUIComponents(editorSetup)
