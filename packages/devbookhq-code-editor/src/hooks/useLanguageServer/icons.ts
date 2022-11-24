import folderIcon from '../../../node_modules/@vscode/codicons/src/icons/folder.svg'
import goToFileIcon from '../../../node_modules/@vscode/codicons/src/icons/go-to-file.svg'
import classIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-class.svg'
import colorIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-color.svg'
import enumMemberIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-enum-member.svg'
import enumIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-enum.svg'
import eventIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-event.svg'
import fieldIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-field.svg'
import fileIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-file.svg'
import interfaceIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-interface.svg'
import keywordIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-keyword.svg'
import methodIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-method.svg'
import namespaceIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-namespace.svg'
import operatorIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-operator.svg'
import parameterIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-parameter.svg'
import propertyIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-property.svg'
import rulerIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-ruler.svg'
import snippetIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-snippet.svg'
import textIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-string.svg'
import structureIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-structure.svg'
import variableIcon from '../../../node_modules/@vscode/codicons/src/icons/symbol-variable.svg'
import { CompletionItemKind } from 'vscode-languageserver-protocol'

import { ReversedCompletionItemKindMap } from './languageServerPlugin'
import { htmlToElements } from './md'

function getIcon(type: CompletionItemKind): string {
  switch (type) {
    case CompletionItemKind.Class:
      return classIcon
    case CompletionItemKind.Color:
      return colorIcon
    case CompletionItemKind.Constant:
      return variableIcon
    case CompletionItemKind.Constructor:
      return methodIcon
    case CompletionItemKind.Enum:
      return enumIcon
    case CompletionItemKind.EnumMember:
      return enumMemberIcon
    case CompletionItemKind.Event:
      return eventIcon
    case CompletionItemKind.Field:
      return fieldIcon
    case CompletionItemKind.File:
      return fileIcon
    case CompletionItemKind.Folder:
      return folderIcon
    case CompletionItemKind.Function:
      return methodIcon
    case CompletionItemKind.Interface:
      return interfaceIcon
    case CompletionItemKind.Keyword:
      return keywordIcon
    case CompletionItemKind.Method:
      return methodIcon
    case CompletionItemKind.Module:
      return namespaceIcon
    case CompletionItemKind.Operator:
      return operatorIcon
    case CompletionItemKind.Property:
      return propertyIcon
    case CompletionItemKind.Reference:
      return goToFileIcon
    case CompletionItemKind.Snippet:
      return snippetIcon
    case CompletionItemKind.Struct:
      return structureIcon
    case CompletionItemKind.Text:
      return textIcon
    case CompletionItemKind.TypeParameter:
      return parameterIcon
    case CompletionItemKind.Unit:
      return rulerIcon
    case CompletionItemKind.Value:
      return enumIcon
    case CompletionItemKind.Variable:
      return variableIcon
  }
}

export function createIconImages() {
  const icons = Object.fromEntries(
    Object.entries(ReversedCompletionItemKindMap).map(([key, value]) => {
      const icon = getIcon(value)
      const iconElements = htmlToElements(icon)

      const wrapperEl = document.createElement('div')
      wrapperEl.classList.add('autocomplete-icon', `autocomplete-icon-${key}`)

      wrapperEl.append(...iconElements)

      return [key, wrapperEl]
    }),
  )

  return {
    getImage(type: string) {
      const el = icons[type]
      if (!el) return

      return el.cloneNode(true)
    },
  }
}
