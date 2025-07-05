/**
 * ViaWebkit TypeScript Bridge
 * 提供H5页面与原生应用的交互桥梁
 *
 * @author ping
 * @version 1.0.0
 */

// ======================== 类型定义 ========================

/**
 * 回调结果接口
 */
export interface CallbackResult {
  code: number
  data?: any
  message?: string
}

/**
 * 回调函数类型
 */
export type CallbackFunction = (result: CallbackResult) => void

/**
 * 消息对象接口
 */
interface BridgeMessage {
  handlerName: string
  data?: string
  callbackId?: string
}

/**
 * 原生响应接口
 */
interface NativeResponse {
  responseData: CallbackResult
  responseId: string
}

/**
 * 分享方法枚举
 */
export enum ShareMethod {
  WHATSAPP = 'wkShareWhatsApp',
  SMS = 'wkShareSMS',
  EMAIL = 'wkShareEmail',
  OTHERS = 'wkShareOthers',
  GOBACK = 'wkGoBack',
  INVITE_DATA = 'wkGetInviteData',
  USER_TOKEN = 'wkUserToken',
}

class ViaWebkitBridge {
  private callbacks: { [key: string]: CallbackFunction } = {}
  private callbackId: number = 0
  private readonly TIMEOUT_DURATION = 30000 // 30秒超时

  constructor() {
    this.initBridge()
    this.setupEventListeners()
  }

  /**
   * 初始化桥接
   */
  private initBridge(): void {
    // 创建ViaWebkit全局对象
    window.ViaWebkit = this

    // 设置响应处理器
    this._responseBackFromNative = this._responseBackFromNative.bind(this)
    this._sendEvent = this._sendEvent.bind(this)

    if (window.JSMessageDispatcher) {
      // 扩展JSMessageDispatcher，添加invoke方法
      window.JSMessageDispatcher.invoke = this.invoke.bind(this)
      console.log('ViaWebkit: TypeScript bridge initialized successfully')
    } else {
      console.warn(
        'ViaWebkit: JSMessageDispatcher not found. Make sure WebView is properly configured.'
      )
    }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('ViaWebkit: Page loaded, TypeScript bridge ready')
    })
  }

  /**
   * 生成唯一的回调ID
   */
  private generateCallbackId(): string {
    return `cb_${++this.callbackId}_${Date.now()}`
  }

  /**
   * 主要的invoke方法
   */
  public invoke(methodName: string, ...args: any[]): void {
    let callback: CallbackFunction | undefined
    let data = args[0]

    // 如果最后一个参数是函数，则为 callback
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop()
    }

    const message: BridgeMessage = {
      handlerName: methodName,
      data: data || '',
    }

    // 如果有回调函数，生成回调ID
    if (typeof callback === 'function') {
      const cbId = this.generateCallbackId()
      message.callbackId = cbId
      this.callbacks[cbId] = callback

      // 设置超时清理回调
      setTimeout(() => {
        if (this.callbacks[cbId]) {
          delete this.callbacks[cbId]
          callback({
            code: -1,
            message: 'Request timeout',
          })
        }
      }, this.TIMEOUT_DURATION)
    }

    // 发送消息到原生
    try {
      if (window.JSMessageDispatcher && window.JSMessageDispatcher.onMessage) {
        window.JSMessageDispatcher.onMessage(JSON.stringify(message))
      } else {
        throw new Error('JSMessageDispatcher not available')
      }
    } catch (e) {
      const error = e as Error
      console.error('ViaWebkit: Error sending message to native:', error)
      if (callback) {
        callback({
          code: -1,
          message: `Failed to send message to native: ${error.message}`,
        })
      }
    }
  }

  /**
   * 接收原生返回的数据
   */
  public _responseBackFromNative(encodedData: string): void {
    try {
      const data = decodeURIComponent(encodedData)
      const response: NativeResponse = JSON.parse(data)
      const { responseData, responseId } = response

      // console.log('ViaWebkit: Received native response:', response)
      if (responseId && this.callbacks[responseId]) {
        const callback = this.callbacks[responseId]
        delete this.callbacks[responseId]

        // 执行回调
        callback(responseData)
      }
    } catch (e) {
      console.error('ViaWebkit: Error processing native response:', e)
    }
  }

  /**
   * 接收原生发送的事件
   */
  public _sendEvent(eventName: string, eventData?: string): void {
    try {
      const data = eventData ? JSON.parse(decodeURIComponent(eventData)) : null
      console.log('ViaWebkit: Received event:', eventName, data)

      // 触发自定义事件
      const event = new CustomEvent(`viawebkit:${eventName}`, {
        detail: data,
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('ViaWebkit: Error processing event:', e)
    }
  }

  // ======================== 便捷方法 ========================

  /**
   * 关闭webview
   */
  public goBack(callback?: CallbackFunction): void {
    this.invoke(ShareMethod.GOBACK, callback)
  }

  /**
   * 获取用户token
   */
  public getUserToken(callback?: CallbackFunction): void {
    this.invoke(ShareMethod.USER_TOKEN, callback)
  }

  /**
   * 获取邀请数据
   */
  public getInviteData(callback?: CallbackFunction): void {
    this.invoke(ShareMethod.INVITE_DATA, callback)
  }

  /**
   * WhatsApp分享
   */
  public shareToWhatsApp(message: string, callback?: CallbackFunction): void {
    this.invoke(ShareMethod.WHATSAPP, message, callback)
  }

  /**
   * 发送短信
   */
  public sendSMS(data: { phoneNumber: string; message: string }): void {
    this.invoke(ShareMethod.SMS, data)
  }

  /**
   * 发送邮件
   */
  public sendEmail(data: {
    toEmail: string
    subject: string
    body: string
  }): void {
    this.invoke(ShareMethod.EMAIL, data)
  }

  /**
   * 通用分享
   */
  public shareOthers(text: string): void {
    this.invoke(ShareMethod.OTHERS, text)
  }

  // ======================== 工具方法 ========================

  /**
   * 检查是否在WebView中
   */
  public isInWebView(): boolean {
    return !!(
      window.JSMessageDispatcher && window.JSMessageDispatcher.onMessage
    )
  }

  /**
   * 检查方法是否可用 暂时不使用
   */
  public isMethodAvailable(methodName: string): boolean {
    console.log('isMethodAvailable methodName', methodName)

    return this.isInWebView()
  }

  /**
   * 添加事件监听器
   */
  public addEventListener(
    eventName: string,
    callback: (data: any) => void
  ): void {
    // @ts-ignore
    window.addEventListener(`viawebkit:${eventName}`, (e: CustomEvent) => {
      callback(e.detail)
    })
  }

  /**
   * 移除事件监听器
   */
  public removeEventListener(
    eventName: string,
    callback: (data: any) => void
  ): void {
    window.removeEventListener(
      `viawebkit:${eventName}`,
      callback as EventListener
    )
  }

  /**
   * 获取版本信息
   */
  public getVersion(): string {
    return '1.0.0'
  }

  /**
   * 获取所有可用方法列表
   */
  public getAvailableMethods(): string[] {
    return [...Object.values(ShareMethod)]
  }
}

// ======================== 初始化 ========================

// 创建全局实例
const viaWebkit = new ViaWebkitBridge()

// 导出类型和实例
export default viaWebkit
export { ViaWebkitBridge }

// ======================== 使用示例 ========================

/*
使用示例：

// 1. 基础调用
ViaWebkit.showToast('Hello World!');

// 2. 带回调的调用
ViaWebkit.shareToWhatsApp('分享消息', (result) => {
  if (result.success) {
    console.log('分享成功');
  } else {
    console.error('分享失败:', result.message);
  }
});


// 4. 事件监听
ViaWebkit.addEventListener('userLogin', (data) => {
  console.log('用户登录事件:', data);
});

// 5. 环境检查
if (ViaWebkit.isInWebView()) {
  ViaWebkit.getUserInfo((result) => {
    if (result.success) {
      const userInfo: UserInfo = result.data;
      console.log('用户信息:', userInfo);
    }
  });
} else {
  console.log('不在WebView环境中');
}
*/
