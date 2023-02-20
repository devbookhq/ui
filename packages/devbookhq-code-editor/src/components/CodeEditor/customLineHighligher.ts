import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

export const addLineHighlight = StateEffect.define()

export function customLineHighlighter(style: string) {
  const customLineHighlight = StateField.define({
    create() {
      return Decoration.none
    },
    update(lines, tr) {
      lines = lines.map(tr.changes)
      for (let e of tr.effects) {
        if (e.is(addLineHighlight)) {
          lines = Decoration.none
          lines = lines.update({ add: [lineHighlightMark.range(e.value)] })
        }
      }
      return lines
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  const lineHighlightMark = Decoration.line({
    attributes: { style },
  })

  return customLineHighlight
}
