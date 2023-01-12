import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import { RootInstance } from 'core/EditorProvider/models/RootStoreProvider'

interface EditorControls {
  instance?: RootInstance
  setInstance: (instance: RootInstance | undefined) => any
}

const EditorControlsContext = createContext<EditorControls | null>(null)

function EditorControlsProvider({ children }: PropsWithChildren) {
  const [instance, setInstance] = useState<RootInstance>()

  return (
    <EditorControlsContext.Provider value={{ instance, setInstance }}>
      {children}
    </EditorControlsContext.Provider>
  )
}

export function useEditorControls() {
  const context = useContext(EditorControlsContext)

  const getEditorState = useCallback(
    () => (context?.instance ? getSnapshot(context?.instance) : undefined),
    [context?.instance],
  )

  return {
    getEditorState,
    instance: context?.instance,
    setEditorInstance: context?.setInstance,
  }
}

export default observer(EditorControlsProvider)
