import { gutter, gutterLineClass, GutterMarker } from "@codemirror/view"
import { StateField, StateEffect, RangeSet } from "@codemirror/state"

export const addGutterHighlight = StateEffect.define<{
  highlight: number[]
}>()

const highlightMarker = new class extends GutterMarker {
  elementClass = 'cm-highlight-gutter-line'
}

export function customGutter() {
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
              add: e.value.highlight.map(l => highlightMarker.range(l)),
              sort: true,
            })
          }
        }
      }
      return set
    }
  })

  return [
    field,
    gutter({
      class: "cm-highlight-gutter",
      markers: v => v.state.field(field),
      initialSpacer: () => highlightMarker,
    }),
  ]
}
