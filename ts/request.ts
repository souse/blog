export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT'

export interface RequestOptions {
  baseUrl?: string
  path?: string
  method?: HttpMethod
  headers?: Record<string, string>
  data?: BodyInit
  params?: Record<string, any>
  timeout?: number
  loginToken?: string
}

type Mode = 'cors' | 'no-cors' | 'same-origin'

interface HttpOptions extends RequestOptions {
  mode?: Mode
  errorPromptFn?: (message: string) => void
}

interface HttpResponse<T> {
  code: number
  result: T
  message: string
}

// class InterceptorManager<T> {} 拦截器功能待完善

class HttpError extends Error {
  response: Response

  constructor(response: Response) {
    super(`HTTP error ${response.status} ${response.statusText}`)

    this.name = 'HTTPError'
    this.response = response
  }
}

class HttpRequest {
  private baseUrl: string
  private timeout: number
  private headers: HeadersInit = { 'Content-Type': 'application/json;charset=UTF-8' }

  constructor(options: HttpOptions = {}) {
    this.baseUrl = options.baseUrl || ''
    this.timeout = options.timeout || 10000
    this.headers = { ...this.headers, ...(options.headers ?? {}) }
  }

  private request = <T = any>(path: string, options: RequestOptions): Promise<HttpResponse<T>> => {
    const { baseUrl, method = 'GET', data, timeout, headers = {} } = options
    const url = new URL(path, baseUrl ?? this.baseUrl)
    const requestOptions: RequestInit = {
      method,
      headers: { ...this.headers, ...headers },
      body: data ? JSON.stringify(data) : undefined,
    }

    if (options.params) url.search = new URLSearchParams(options.params).toString()

    return new Promise((resolve, reject) => {
      const controller = new AbortController()
      const { signal } = controller
      const timeId = setTimeout(() => {
        controller.abort()
      }, timeout ?? this.timeout)

      fetch(url, { ...requestOptions, signal })
        .then((res: Response) => {
          clearTimeout(timeId)

          if (!res.ok) throw new HttpError(res)
          resolve(res.json())
        })
        .catch((error) => {
          clearTimeout(timeId)
          debugger
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            error = new Error('NetworkError: Failed to fetch')
          } else if (error instanceof DOMException && error.name === 'AbortError') {
            error = new Error('Request timed out')
          }
          console.error(`Request failed: ${error.message}`, error)
          // 进行错误提示，并且抛出错误
          reject(error)
        })
    })
  }

  get = <T = any>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> =>
    this.request(path, { ...options, method: 'GET' })

  post = <T = any>(path: string, options: RequestOptions): Promise<HttpResponse<T>> =>
    this.request(path, { ...options, method: 'POST' })
}
