import {
  useEffect,
  DependencyList,
} from 'react'

function useEventListener<K extends keyof DocumentEventMap>(event: K, handler: (e: DocumentEventMap[K]) => any, deps: DependencyList = []) {
  useEffect(function listenToEvent() {
    document.addEventListener(event, handler)
    return () => document.removeEventListener(event, handler)
  }, [event, handler, ...deps])
}

export default useEventListener
