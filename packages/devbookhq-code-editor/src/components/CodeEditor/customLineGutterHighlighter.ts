import { gutterLineClass, GutterMarker } from "@codemirror/view"
import { StateField, StateEffect, RangeSet } from "@codemirror/state"

function getMarker(position: number, length: number) {
  if (position === 0 && length === 1) {
    return combinedHighlightMarker
  }

  if (position === 0 && length > 1) {
    return firstHighlightMarker
  }

  if (position === length - 1) {
    return lastHighlightMarker
  }

  return highlightMarker
}

export const addGutterHighlight = StateEffect.define<{
  sequences: number[][]
}>()

const baseClass = 'cm-highlight-gutter-line'
const firstClass = `${baseClass}-first`
const lastClass = `${baseClass}-last`

/**
 * Marks gutter elements that first in the sequence
 */
const firstHighlightMarker = new class extends GutterMarker {
  elementClass = [baseClass, firstClass].join(' ')
}

/**
 * Marks gutter elements that are in the middle of sequence
 */
const highlightMarker = new class extends GutterMarker {
  elementClass = baseClass
}

/**
 * Marks gutter elements that are last in sequence
 */
const lastHighlightMarker = new class extends GutterMarker {
  elementClass = [baseClass, lastClass].join(' ')
}

/**
 * Marks gutter elements that are first and last in sequence
 */
const combinedHighlightMarker = new class extends GutterMarker {
  elementClass = [baseClass, firstClass, lastClass].join(' ')
}

export function customLineGutterHighlighter() {
  const field = StateField.define({
    create() { return RangeSet.empty },
    provide: p => gutterLineClass.from(p),
    update(set, transaction) {
      set = set.map(transaction.changes)
      for (let e of transaction.effects) {
        if (e.is(addGutterHighlight)) {
          set = RangeSet.empty
          if (e.value) {
            const state = transaction.startState
            set = set.update({
              add: e.value.sequences.flatMap(s => {
                return s.map((l, i, a) => {
                  const marker = getMarker(i, a.length)
                  const offset = state.doc.line(l).from
                  return marker.range(offset)
                })
              })
            })
          }
        }
      }
      return set
    }
  })

  return [field]
}
