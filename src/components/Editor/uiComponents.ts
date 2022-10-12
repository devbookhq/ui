import { getUIComponents } from 'core'

import CodeEditor, { Icon as CodeEditorIcon } from './UIComponent/CodeEditor'
import CodeSnippet, { Icon as CodeSnippetIcon } from './UIComponent/CodeSnippet'
import Terminal, { Icon as TerminalIcon } from './UIComponent/Terminal'

// Add new board components and their sidebar icons here
const availableComponents = {
  [CodeSnippet.name]: {
    Sidebar: CodeSnippetIcon,
    Board: CodeSnippet,
  },
  [CodeEditor.name]: {
    Sidebar: CodeEditorIcon,
    Board: CodeEditor,
  },
  [Terminal.name]: {
    Sidebar: TerminalIcon,
    Board: Terminal,
  },
}

export const {
  renderBoardBlock,
  renderDraggedBoardBlock,
  renderPreviewBoardBlock,
  uiComponentsList,
  uiComponentsMap,
} = getUIComponents(availableComponents)
