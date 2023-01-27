import { analytics } from './index'
import {
  useCallback,
  useMemo,
  useRef,
} from 'react'
import debounce from 'lodash.debounce'

function makeID(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function useTerminalOutputAnalytics() {
  const buffer = useRef<string>('')
  const randomID = useRef<string>(makeID(12))

  const debouncedReport = useMemo(() => debounce(() => {
    const currentBuffer = buffer.current
    buffer.current = ''

    analytics.track('terminal output', {
      output: currentBuffer,
      ansi: true,
      terminalID: randomID.current,
    })
  }, 1200, {
    maxWait: 5000,
    trailing: true,
    leading: false,
  }), [])

  const handleOutput = useCallback((out: string) => {
    buffer.current += out
    debouncedReport()
  }, [debouncedReport])

  return { handleOutput }
}

export default useTerminalOutputAnalytics
