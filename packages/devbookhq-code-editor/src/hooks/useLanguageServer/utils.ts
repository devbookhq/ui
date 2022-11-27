import { Completion } from '@codemirror/autocomplete'
import { ChangeSet, ChangeSpec, Text } from '@codemirror/state'
import path from 'path-browserify'
import * as LSP from 'vscode-languageserver-protocol'
import { Position, Range as LSRange } from 'vscode-languageserver-protocol'

// Offset should be calculated with UTF-16 (JS uses UTF-16 strings by default)
export function posToOffset(doc: Text, pos: Position) {
  if (pos.line >= doc.lines) return doc.length

  const offset = doc.line(pos.line + 1).from + pos.character
  if (offset > doc.length) return doc.length

  return offset
}

export function offsetToPos(doc: Text, offset: number) {
  const line = doc.lineAt(offset)
  return {
    line: line.number - 1,
    character: offset - line.from,
  }
}

export function formatContents(
  contents: LSP.MarkupContent | LSP.MarkedString | LSP.MarkedString[] | string,
): string {
  if (Array.isArray(contents)) {
    return contents.map(formatContents).join('\n\n')
  } else if (typeof contents === 'string') {
    return contents
  } else {
    return contents.value
  }
}

const autocompletionToken = '\\w'

function toSet(chars: Set<string>) {
  let preamble = ''
  let flat = Array.from(chars).join('')
  const words = new RegExp(autocompletionToken).test(flat)
  if (words) {
    preamble += autocompletionToken

    flat = flat.replace(new RegExp(autocompletionToken, 'g'), '')
  }
  return `[${preamble}${flat.replace(new RegExp(`[^${autocompletionToken}\\s]`, 'g'), '\\$&')}]`
}


// function toSet(chars: Set<string>) {
//   console.log('')
//   let preamble = ''
//   let flat = Array.from(chars).join('')
//   const words = /\w/.test(flat)
//   if (words) {
//     preamble += '\\w'
//     flat = flat.replace(/\w/g, '')
//   }
//   return `[${preamble}${flat.replace(/[^\w\s]/g, '\\$&')}]`
// }

export function prefixMatch(options: Completion[]) {
  const first = new Set<string>()
  const rest = new Set<string>()

  for (const { label } of options) {
    const [initial, ...restStr] = label
    first.add(initial)
    for (const char of restStr) {
      rest.add(char)
    }
  }

  const source = toSet(first) + toSet(rest) + '*$'
  return [new RegExp('^' + source), new RegExp(source)]
}

export type OffsetRange = { from: number, to: number }

export function areOffsetsOverlapping(range: OffsetRange, otherRange: OffsetRange) {
  if (otherRange.from < range.from) {
    return otherRange.to > range.from
  } else {
    return otherRange.from < range.to
  }
}

export function posToOffsetRange(doc: Text, range: LSRange): OffsetRange {
  return {
    from: posToOffset(doc, range.start),
    to: posToOffset(doc, range.end),
  }
}

export function offsetToPosRange(doc: Text, range: OffsetRange): LSRange {
  return {
    start: offsetToPos(doc, range.from),
    end: offsetToPos(doc, range.to),
  }
}

export function arePositionsOverlapping(doc: Text, range: LSRange, otherPos: LSRange) {
  const offsetRange = posToOffsetRange(doc, range)
  const otherOffsetRange = posToOffsetRange(doc, otherPos)

  return areOffsetsOverlapping(offsetRange, otherOffsetRange)
}

export function applyChanges(text: string, changes: ChangeSpec[]) {
  let offset = 0
  return changes.reduce((text, change) => {
    if (change instanceof ChangeSet || Array.isArray(change) || !('from' in change)) {
      throw new Error('This function does not support ChangeSet or nested ChangeSpec')
    }

    const start = offset + change.from
    const end = offset + (change?.to || 0)
    const replacement = change.insert || ''

    offset += replacement.length - (end - start)
    return text.slice(0, start) + replacement + text.slice(end)
  }, text)
}

export function getFileURI(filepath: string) {
  if (!path.isAbsolute(filepath)) {
    throw new Error('filepath must be absolute')
  }
  return `file://${filepath}`
}

export function getRootURI(dirpath: string) {
  const root = dirpath.endsWith('/') ? dirpath : dirpath + '/'
  return getFileURI(root)
}
