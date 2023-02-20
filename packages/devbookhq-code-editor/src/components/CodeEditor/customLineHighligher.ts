import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

export const addLineHighlight = StateEffect.define<{ lines: number[] }>()

export function customLineHighlighter() {
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
            const state = tr.state
            lines = lines.update({
              add: e.value.lines.map(l => lineHighlightMark.range(state.doc.line(l).from)),
            })
          }
        }
      }
      return lines
    },
    provide: (f) => EditorView.decorations.from(f),
  })

  const lineHighlightMark = Decoration.line({
    attributes: { style: 'background-color: yellow' },
  })

  return customLineHighlight
}
