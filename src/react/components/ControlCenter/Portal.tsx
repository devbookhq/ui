import {
  ReactNode,
  useEffect,
  useMemo,
} from 'react'
import ReactDOM from 'react-dom'

export interface Props {
  rootNode: HTMLElement
  children: ReactNode
}

function Portal({ rootNode, children }: Props) {
  const element = useMemo(() => {
    const el = document.createElement('div')
    el.style.height = '100%'
    el.style.width = '100%'
    return el
  }, [])

  useEffect(function initElement() {
    const root = rootNode.appendChild(element)
    return () => {
      root.removeChild(element)
    }
  }, [])

  return ReactDOM.createPortal(children, element)
}

export default Portal
