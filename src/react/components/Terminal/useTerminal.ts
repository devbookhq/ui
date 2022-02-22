import { useEffect, useState } from 'react'
import { Terminal } from 'xterm'

// https://github.com/xtermjs/xterm.js/
// https://xtermjs.org/
// https://github.com/billchurch/WebSSH2
// https://github.com/mscdex/ssh2#send-a-raw-http-request-to-port-80-on-the-server
// https://github.com/gliderlabs/ssh

export interface Opts {
  sendData: (arg1: any, arg2: any) => void
  onIncomingData: (listener: (data: Uint8Array) => void) => void
}

function useTerminal({
  sendData,
  onIncomingData,
}: Opts) {
  const [terminal, setTerminal] = useState<Terminal>()

  useEffect(() => {
    onIncomingData((data) => {
      if (!terminal) return
      terminal.write(data)
    })
  }, [onIncomingData, terminal])

  useEffect(function init() {
    const term = new Terminal({
    })

    term.onData(sendData)
    setTerminal(term)

    return () => {
      term.dispose()
    }
  }, [sendData])

  return terminal?.element
}

export default useTerminal
