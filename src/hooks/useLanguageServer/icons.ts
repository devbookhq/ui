// import * as folderIcon from '@vscode/codicons/src/icons/folder.svg'
// import * as referencesIcon from '@vscode/codicons/src/icons/references.svg'
// import * as classIcon from '@vscode/codicons/src/icons/symbol-class.svg'
// import * as colorIcon from '@vscode/codicons/src/icons/symbol-color.svg'
// import * as enumMemberIcon from '@vscode/codicons/src/icons/symbol-enum-member.svg'
// import * as enumIcon from '@vscode/codicons/src/icons/symbol-enum.svg'
// import * as eventIcon from '@vscode/codicons/src/icons/symbol-event.svg'
// import * as fieldIcon from '@vscode/codicons/src/icons/symbol-field.svg'
// import * as fileIcon from '@vscode/codicons/src/icons/symbol-file.svg'
// import * as interfaceIcon from '@vscode/codicons/src/icons/symbol-interface.svg'
// import * as keywordIcon from '@vscode/codicons/src/icons/symbol-keyword.svg'
// import * as methodIcon from '@vscode/codicons/src/icons/symbol-method.svg'
// import * as namespaceIcon from '@vscode/codicons/src/icons/symbol-namespace.svg'
// import * as operatorIcon from '@vscode/codicons/src/icons/symbol-operator.svg'
// import * as propertyIcon from '@vscode/codicons/src/icons/symbol-property.svg'
// import * as rulerIcon from '@vscode/codicons/src/icons/symbol-ruler.svg'
// import * as snippetIcon from '@vscode/codicons/src/icons/symbol-snippet.svg'
// import * as textIcon from '@vscode/codicons/src/icons/symbol-string.svg'
// import * as structureIcon from '@vscode/codicons/src/icons/symbol-structure.svg'
// import * as variableIcon from '@vscode/codicons/src/icons/symbol-variable.svg'
// import { CompletionItemKind } from 'vscode-languageserver-protocol'

// import { ReversedCompletionItemKindMap } from './languageServerPlugin'
// import { htmlToElements } from './md'

// function getIcon(type: CompletionItemKind): { default: 'string' } {
//   switch (type) {
//     case CompletionItemKind.Class:
//       return classIcon
//     case CompletionItemKind.Color:
//       return colorIcon
//     case CompletionItemKind.Constant:
//       return variableIcon
//     case CompletionItemKind.Constructor:
//       return methodIcon
//     case CompletionItemKind.Enum:
//       return enumIcon
//     case CompletionItemKind.EnumMember:
//       return enumMemberIcon
//     case CompletionItemKind.Event:
//       return eventIcon
//     case CompletionItemKind.Field:
//       return fieldIcon
//     case CompletionItemKind.File:
//       return fileIcon
//     case CompletionItemKind.Folder:
//       return folderIcon
//     case CompletionItemKind.Function:
//       return methodIcon
//     case CompletionItemKind.Interface:
//       return interfaceIcon
//     case CompletionItemKind.Keyword:
//       return keywordIcon
//     case CompletionItemKind.Method:
//       return methodIcon
//     case CompletionItemKind.Module:
//       return namespaceIcon
//     case CompletionItemKind.Operator:
//       return operatorIcon
//     case CompletionItemKind.Property:
//       return propertyIcon
//     case CompletionItemKind.Reference:
//       return referencesIcon
//     case CompletionItemKind.Snippet:
//       return snippetIcon
//     case CompletionItemKind.Struct:
//       return structureIcon
//     case CompletionItemKind.Text:
//       return textIcon
//     case CompletionItemKind.TypeParameter:
//       return classIcon
//     case CompletionItemKind.Unit:
//       return rulerIcon
//     case CompletionItemKind.Value:
//       return enumIcon
//     case CompletionItemKind.Variable:
//       return variableIcon
//   }
// }

export function createIconImages() {
  // const icons = Object.fromEntries(
  //   Object.entries(ReversedCompletionItemKindMap).map(([key, value]) => {
  //     const icon = getIcon(value)

  //     const iconElements = htmlToElements(icon.default)

  //     const wrapperEl = document.createElement('div')
  //     wrapperEl.classList.add('autocomplete-icon', `autocomplete-icon-${key}`)

  //     wrapperEl.append(...iconElements)

  //     return [key, wrapperEl]
  //   }),
  // )

  const icons: any = {}

  return {
    getImage(type: string) {
      const el = icons[type]
      if (!el) return

      return el.cloneNode(true)
    },
  }
}
