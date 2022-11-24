import { Registry } from 'vscode-textmate'
import {
  useEffect,
  useState,
} from 'react'

import { initializeTextMateRegistry } from './textMateRegistry'

export function useTextMateRegistry() {
  const [registry, setRegistry] = useState<Promise<Registry>>()

  useEffect(function initialize() {
    const reg = initializeTextMateRegistry()
    setRegistry(reg)

    return () => {
      reg.then(r => r.dispose())
      setRegistry(r => r === reg ? undefined : r)
    }
  }, [])

  return registry
}

export default useTextMateRegistry
