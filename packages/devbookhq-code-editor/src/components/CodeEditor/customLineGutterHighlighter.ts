import { gutterLineClass, GutterMarker } from "@codemirror/view"
import { StateField, StateEffect, RangeSet } from "@codemirror/state"

function getIndicateMarker(position: number, length: number) {
  if (position === 0 && length === 1) {
    return combinedIndicateMarker
  }

  if (position === 0 && length > 1) {
    return firstIndicateMarker
  }

  if (position === length - 1) {
    return lastIndicateMarker
  }

  return indicateMarker
}

function getHighlightMarker(position: number, length: number) {
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
  highlightSequences: number[][]
  indicateSequences: number[][]
  dim: number[]
}>()

const highlightClass = 'cm-highlight-gutter-line'
const indicateClass = 'cm-indicate-gutter-line'

const baseClass = 'cm-custom-gutter-line'
const firstClass = `${baseClass}-first`
const lastClass = `${baseClass}-last`

/**
 * Marks gutter elements that first in the sequence
 */
const dimGutterMarker = new class extends GutterMarker {
  elementClass = 'cm-dim-gutter-line'
}

// Indication markers

/**
 * Marks gutter elements that first in the sequence
 */
const firstIndicateMarker = new class extends GutterMarker {
  elementClass = [indicateClass, firstClass].join(' ')
}

/**
 * Marks gutter elements that are in the middle of sequence
 */
const indicateMarker = new class extends GutterMarker {
  elementClass = indicateClass
}

/**
 * Marks gutter elements that are last in sequence
 */
const lastIndicateMarker = new class extends GutterMarker {
  elementClass = [indicateClass, lastClass].join(' ')
}

/**
 * Marks gutter elements that are first and last in sequence
 */
const combinedIndicateMarker = new class extends GutterMarker {
  elementClass = [indicateClass, firstClass, lastClass].join(' ')
}


// Highlight markers

/**
 * Marks gutter elements that first in the sequence
 */
const firstHighlightMarker = new class extends GutterMarker {
  elementClass = [highlightClass, firstClass].join(' ')
}

/**
 * Marks gutter elements that are in the middle of sequence
 */
const highlightMarker = new class extends GutterMarker {
  elementClass = highlightClass
}

/**
 * Marks gutter elements that are last in sequence
 */
const lastHighlightMarker = new class extends GutterMarker {
  elementClass = [highlightClass, lastClass].join(' ')
}

/**
 * Marks gutter elements that are first and last in sequence
 */
const combinedHighlightMarker = new class extends GutterMarker {
  elementClass = [highlightClass, firstClass, lastClass].join(' ')
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
              sort: true,
              add: [
                ...e.value.dim.map(l => dimGutterMarker.range(l)),
                ...e.value.highlightSequences.flatMap(s => {
                  return s.map((l, i, a) => {
                    const marker = getHighlightMarker(i, a.length)
                    const offset = state.doc.line(l).from
                    return marker.range(offset)
                  })
                }),
                ...e.value.indicateSequences.flatMap(s => {
                  return s.map((l, i, a) => {
                    const marker = getIndicateMarker(i, a.length)
                    const offset = state.doc.line(l).from
                    return marker.range(offset)
                  })
                }),
              ]
            })
          }
        }
      }
      return set
    }
  })

  return field
}
