import {
  useEffect,
} from 'react'

function useListenMessage(callback: (event: any) => void, deps: any[]) {
  useEffect(function register() {
    window.addEventListener('message', callback)
    return () => {
      window.removeEventListener('message', callback)
    }
  }, [callback, ...deps])
}

export default useListenMessage
