import { gutterLineClass, GutterMarker } from "@codemirror/view"
import { StateField, StateEffect, RangeSet } from "@codemirror/state"

export const addGutterHighlight = StateEffect.define<{
  highlight: number[]
}>()

const baseClass = 'cm-highlight-gutter-line'

const firstHighlightMarker = new class extends GutterMarker {
  elementClass = baseClass + ' ' + 'cm-highlight-gutter-line-first'
}

const highlightMarker = new class extends GutterMarker {
  elementClass = baseClass
}

const lastHighlightMarker = new class extends GutterMarker {
  elementClass = baseClass + ' ' + 'cm-highlight-gutter-line-first'
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
            set = set.update({
              add:

                e.value.highlight.map(l => highlightMarker.range(l)),
              sort: true,
            })
          }
        }
      }
      return set
    }
  })

  return [field]
}
