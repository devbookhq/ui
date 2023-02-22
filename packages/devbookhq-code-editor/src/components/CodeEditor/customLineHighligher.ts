import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

export const addLineHighlight = StateEffect.define<{
  highlight: number[]
  indicate: number[]
  dim: number[]
}>()


const dimDecoration = Decoration.line({
  attributes: {
    class: 'cm-dim-line',
  },
})

const highlightDecoration = Decoration.line({
  attributes: {
    class: 'cm-highlight-line',
  },
})

const indicateDecoration = Decoration.line({
  attributes: {
    class: 'cm-highlight-line',
  },
})

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
            lines = lines.update({
              add: [
                ...e.value.highlight.map(l => highlightDecoration.range(l)),
                ...e.value.indicate.map(l => indicateDecoration.range(l)),
                ...e.value.dim.map(l => dimDecoration.range(l)),
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
