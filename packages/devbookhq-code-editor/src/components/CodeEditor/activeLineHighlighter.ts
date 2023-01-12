import { Compartment, Extension } from '@codemirror/state'
import { EditorView, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'

/**
 * This extension highlights the active line and line gutter only if there is no (main) active selection in the editor.
 */
export function activeLineHighlighter() {
  const compartment = new Compartment()

  const enabledCompartmentValue = [
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ]

  const disabledCompartmentValue: Extension = []

  function configureCompartment(view: EditorView, enable: boolean) {
    view.dispatch({ effects: compartment.reconfigure(enable ? enabledCompartmentValue : disabledCompartmentValue) })
  }

  const highlightToggler = EditorView.updateListener.of((update) => {
    const state = update.state

    const compartmentValue = compartment.get(state)
    const isCompartmnetDisabled = compartmentValue === disabledCompartmentValue

    if (state.selection.main.empty) {
      if (isCompartmnetDisabled) configureCompartment(update.view, true)
    } else {
      if (!isCompartmnetDisabled) configureCompartment(update.view, false)
    }
  })

  return [
    highlightToggler,
    compartment.of(enabledCompartmentValue),
  ]
}
