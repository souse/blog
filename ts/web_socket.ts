interface WebSocketOptions {
  /** WebSocket服务器URL */
  url: string

  /** WebSocket协议类型 */
  protocols?: string | string[]

  /** 保持心跳间隔-毫秒 */
  keepAliveInterval?: number

  /** 重连次数 */
  reconnectAttempts?: number

  /** 重连间隔-毫秒 */
  reconnectInterval?: number

  /** 连接成功回调 */
  onConnectFn?: () => void

  /**  */
  onDisconnectFn?: () => void

  onErrorFn?: (error: Event) => void

  onMessageFn?: (data: any) => void
}

class WebSocketClient {
  private socket: WebSocket | null = null

  private readonly url: string
  private readonly protocols?: string | string[]

  private reconnectCount = 0
  private reconnectTimer: number | null = null
  private readonly reconnectAttempts: number
  private readonly reconnectInterval: number

  private readonly messageListeners: ((message: string) => void)[] = []

  private readonly keepAliveInterval: number
  private readonly heartbeatInterval: number
  // private heartbeatTimer: NodeJS.Timer | null = null
  private heartbeatTimer = null

  private closeByUser: boolean = false
  private readyState: number = WebSocket.CLOSED

  constructor(options: WebSocketOptions) {
    this.url = options.url
    this.protocols = options.protocols
    this.keepAliveInterval = options.keepAliveInterval || 30000
    this.reconnectAttempts = options.reconnectAttempts || Infinity
    this.reconnectInterval = options.reconnectInterval || 1000
    this.heartbeatInterval = Math.max(this.keepAliveInterval / 2, 1000)
  }

  connect() {
    if (this.readyState !== WebSocket.CLOSED) return

    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => this.onOpen()
    this.socket.onclose = () => this.onClose()
    this.socket.onmessage = (event) => this.onMessage(event)
    this.socket.onerror = (error) => this.onError(error)
  }

  disConnect() {
    this.closeByUser = true
    this.socket?.close()
  }

  private send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }

  private onOpen() {
    console.log('WebSocket connected')
    this.readyState = WebSocket.OPEN
    this.reconnectCount = 0

    this.startHeartbeat()
    // if (this.options.onConnectFn) this.options.onConnectFn()
  }

  private onClose() {
    if (this.closeByUser) return

    this.readyState = WebSocket.CLOSED
    this.stopHeartbeat()

    if (this.closeByUser) return
    if (this.reconnectCount < this.reconnectAttempts) {
      this.reconnectCount++
      console.log(`WebSocket closed, retrying in ${this.reconnectInterval}ms...`)

      this.reconnectTimer = setTimeout(() => {
        this.connect()
      }, this.reconnectInterval)
    } else {
      console.error('WebSocket closed and reached max reconnect attempts')
      // if (this.onDisconnectFn) this.onDisconnectFn()
    }
  }

  private onMessage(event: MessageEvent) {
    console.log(`Received message: ${event.data}`)
  }

  private onError(error) {}

  private startHeartbeat() {
    if (this.heartbeatTimer) return

    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, this.heartbeatInterval)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}
