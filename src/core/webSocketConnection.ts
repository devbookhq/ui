import stringify from '../utils/stringify'
import Logger from '../utils/Logger'
import wait from '../utils/wait'
import * as rws from '../common-ts/RunnerWebSocket'
import { runner as consts } from './constants'

interface Handler {
  onMessage: (msg: rws.BaseMessage) => void
  onOpen: () => void
}

export class WebSocketConnection {
  private readonly url = `wss://${consts.REMOTE_RUNNER_HOSTNAME}`
  sessionID?: string
  private client?: WebSocket
  private logger = new Logger('WebSocketConnection')

  private handlers: Handler[] = []

  get state() {
    return this.client?.readyState
  }

  subscribeHandler(handler: Handler) {
    this.handlers.push(handler)

    return () => {
      this.handlers = this.handlers.filter(h => h !== handler)
    }
  }

  connect(sessionID?: string) {
    if (
      this.client
      && (
        this.client.readyState === this.client.CONNECTING
        || this.client.readyState === this.client.OPEN
      )
    ) return

    if (!sessionID && !this.sessionID) {
      this.logger.error('Cannot connect, no session ID passed to the function and no session ID saved from the previous session')
      return
    }

    if (sessionID) {
      this.logger.log(`Will try to connect to session "${sessionID}"`)
      this.sessionID = sessionID
    } else if (!sessionID && this.sessionID) {
      this.logger.log(`Will try to connect to previous session "${this.sessionID}"`)
    }

    this.client = new WebSocket(`${this.url}/session/ws/${this.sessionID}`)
    this.client.onopen = () => this.handleOpen()
    this.client.onmessage = msg => {
      this.logger.log('Received (raw)', { msg })
      this.handleMessage(msg)
    }
    this.client.onerror = event => this.handleError(event)
    this.client.onclose = event => this.handleClose(event)
  }

  send(msg: rws.BaseMessage) {
    if (!this.client || this.client.readyState !== this.client.OPEN) {
      this.logger.warn(
        'Trying to send a message while not being in the `OPEN` state or without established connection, message will be discarded',
        msg,
      )
      return
    }

    this.logger.log('Send', msg)
    this._send(msg)
  }

  close() {
    this.logger.log('Closing connection')
    // 1000 - Normal Closure
    // See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    this.client?.close(1000)
  }

  private handleOpen() {
    this.logger.log('Connection opened', { readyState: this.client?.readyState })
    this.handlers.forEach(h => {
      h.onOpen()
    })
  }

  // Private version of the `send()` method that doesn't check if a client is ready
  // or if we have any pending messages.
  private _send(msg: rws.BaseMessage) {
    this.client?.send(stringify(msg))
  }

  private async handleClose(event: CloseEvent) {
    this.logger.log('Connection closed', event)

    this.logger.log(`Will try to reconnect in ${consts.WSCONN_RESTART_PERIOD / 1000}s`)
    await wait(consts.WSCONN_RESTART_PERIOD)
    this.connect()
  }

  private handleError(event: Event) {
    this.logger.error('Connection error', event)
    this.client?.close()
  }

  private handleMessage(msg: MessageEvent) {
    if (!msg.data) {
      this.logger.error('Message has empty data field', msg)
      return
    }

    const data = JSON.parse(msg.data)
    if (!data.type) {
      this.logger.error('Message has no type', data)
      return
    }

    const baseMsg = data as rws.BaseMessage

    if (
      !Object.values(rws.MessageType.RunningEnvironment).includes(baseMsg.type as rws.TRunningEnvironment)
      &&
      !Object.values(rws.MessageType.Runner).includes(baseMsg.type as rws.TRunner)
      &&
      !Object.values(rws.MessageType.CodeCell).includes(baseMsg.type as rws.TCodeCell)
    ) {
      this.logger.error('Message "type" field has unexpected value', baseMsg)
      return
    }

    if (baseMsg.type === rws.MessageType.Runner.Error) {
      this.logger.error('Runner error', baseMsg)
      return
    }

    this.logger.log('Received (parsed)', baseMsg)
    this.handlers.forEach(h => {
      h.onMessage(baseMsg)
    })
  }
}
