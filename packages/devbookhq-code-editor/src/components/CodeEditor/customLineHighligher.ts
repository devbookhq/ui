import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

export const addLineHighlight = StateEffect.define<{
  highlight: number[]
  indicate: number[]
}>()

export function customLineHighlighter({ highlightDecoration, indicateDecoration }: { highlightDecoration?: Decoration, indicateDecoration?: Decoration }) {
  const customLineHighlight = StateField.define({
    create() {
      return Decoration.none
    },
    update(lines, tr) {
      lines = lines.map(tr.changes)
      for (let e of tr.effects) {
        if (e.is(addLineHighlight)) {
          lines = Decoration.none
          if (e.value) {
            lines = lines.update({
              add: [
                ...(highlightDecoration ? e.value.highlight.map(l => highlightDecoration.range(l)) : []),
                ...(indicateDecoration ? e.value.indicate.map(l => indicateDecoration.range(l)) : []),
              ],
              sort: true,
            })
          }
        }
      }
      return lines
    },
    provide: (f) => EditorView.decorations.from(f),
  })


  return customLineHighlight
}
