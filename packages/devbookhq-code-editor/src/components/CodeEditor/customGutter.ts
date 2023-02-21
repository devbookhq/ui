import { Decoration, EditorView, gutter, GutterMarker } from "@codemirror/view"
import { StateField, StateEffect, RangeSet } from "@codemirror/state"


// const emptyMarker = new class extends GutterMarker {
//   toDOM() { return document.createTextNode("ø") }
// }

// const emptyLineGutter = gutter({
//   lineMarker(view, line) {
//     return line.from == line.to ? emptyMarker : null
//   },
//   initialSpacer: () => emptyMarker
// })



const breakpointEffect = StateEffect.define<{ pos: number, on: boolean }>({
  map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on })
})

// const breakpointState = StateField.define<RangeSet<GutterMarker>>({
//   create() { return RangeSet.empty },
//   update(set, transaction) {
//     set = set.map(transaction.changes)
//     for (let e of transaction.effects) {
//       if (e.is(breakpointEffect)) {
//         if (e.value.on)
//           set = set.update({ add: [breakpointMarker.range(e.value.pos)] })
//         else
//           set = set.update({ filter: from => from != e.value.pos })
//       }
//     }
//     return set
//   }
// })

// function toggleBreakpoint(view: EditorView, pos: number) {
//   let breakpoints = view.state.field(breakpointState)
//   let hasBreakpoint = false
//   breakpoints.between(pos, pos, () => { hasBreakpoint = true })
//   view.dispatch({
//     effects: breakpointEffect.of({ pos, on: !hasBreakpoint })
//   })
// }

// const breakpointMarker = new class extends GutterMarker {
//   toDOM() { return document.createTextNode("💔") }
// }

// const breakpointGutter = [
//   breakpointState,
//   gutter({
//     class: "cm-breakpoint-gutter",
//     markers: v => v.state.field(breakpointState),
//     initialSpacer: () => breakpointMarker,
//     domEventHandlers: {
//       mousedown(view, line) {
//         toggleBreakpoint(view, line.from)
//         return true
//       }
//     }
//   }),
//   EditorView.baseTheme({
//     ".cm-breakpoint-gutter .cm-gutterElement": {
//       color: "red",
//       paddingLeft: "5px",
//       cursor: "default"
//     }
//   })
// ]

export const addGutterHighlight = StateEffect.define<{
  highlight: number[]
  indicate: number[]
}>()


const highlightMarker = new class extends GutterMarker {
  // toDOM() { return document.createTextNode("ø") }
  elementClass = 'cm-highlight-gutter-line'
}

const indicateMarker = new class extends GutterMarker {
  // toDOM() { return document.createTextNode("ø") }
  elementClass = 'cm-highlight-gutter-indicate-line'
}

export function customGutter() {
  const field = StateField.define({
    create() { return RangeSet.empty },
    update(set, transaction) {
      set = set.map(transaction.changes)
      for (let e of transaction.effects) {
        if (e.is(addGutterHighlight)) {
          set = RangeSet.empty
          if (e.value) {
            set = set.update({
              add: [
                ...e.value.highlight.map(l => highlightMarker.range(l)),
                ...e.value.indicate.map(l => indicateMarker.range(l)),
              ],
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
      // domEventHandlers: {
      //   mousedown(view, line) {
      //     toggleBreakpoint(view, line.from)
      //     return true
      //   }
      // }
    }),
    EditorView.baseTheme({
      ".cm-breakpoint-gutter .cm-gutterElement": {
        color: "red",
        paddingLeft: "5px",
        cursor: "default"
      }
    })
  ]
}
