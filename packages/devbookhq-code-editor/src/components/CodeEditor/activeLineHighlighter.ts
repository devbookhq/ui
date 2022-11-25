import { Compartment, Extension } from '@codemirror/state'
import { EditorView, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'

/**
 * This extension highlights the active line and line gutter only if there is no (main) active selection in the editor.
 */
export function activeLineHighlighter() {
  const extensionCompartment = new Compartment()

  const enabledCompartmentValue = [
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ]

  const disabledCompartmentValue: Extension = []

  function reconfigureCompartment(view: EditorView, value: Extension) {
    view.dispatch({ effects: extensionCompartment.reconfigure(value) })
  }

  const highlightToggler = EditorView.updateListener.of((update) => {
    const state = update.state

    const compartmentValue = extensionCompartment.get(state)
    const isCompartmnetDisabled = compartmentValue === disabledCompartmentValue

    if (state.selection.main.empty) {
      if (isCompartmnetDisabled) {
        reconfigureCompartment(update.view, enabledCompartmentValue)
      }
    } else {
      if (!isCompartmnetDisabled) {
        reconfigureCompartment(update.view, disabledCompartmentValue)
      }
    }
  })

  return [
    highlightToggler,
    extensionCompartment.of(enabledCompartmentValue),
  ]
}
