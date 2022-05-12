import axios, {AxiosInstance} from "axios";

/** 浏览器原生 ProgressEvent 的事件处理函数。 */
export type ProgressEventHandler = (event: ProgressEvent) => void;

export type ResponseHeaders = Record<string, string> & {
    "set-cookie"?: string[]
};

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type ResponseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

export interface HTTPRequest<T = any> {
    /** 包含主机名的完整 URL 。 */
    baseURL?: string;

    /** 不包含主机名的 URL 路径。 */
    url?: string;

    /** 请求方法。 */
    method?: Method;

    /** 查询字符串。 */
    params?: URLSearchParams | object | string;

    /** 请求头部。 */
    headers?: { [key: string]: string };

    /** 超时时间，单位毫秒。 */
    timeout?: number;

    /** 跨域请求是否携带 cookie 。 */
    withCredentials?: boolean;

    /** 请求实体。 */
    data?: T;

    /** 响应类型。 */
    responseType?: ResponseType;

    /** 响应编码。 */
    responseEncoding?: ResponseEncoding;

    /** 合法响应状态码的验证函数，返回 true 表示合法。 */
    validateStatus?: (status: number) => boolean;

    /** 是否自动解压已经压缩的响应，同时移除 'content-encoding' 头部字段。 */
    decompress?: boolean;

    /** 浏览器原生上传进度事件处理函数。 */
    onUploadProgress?: ProgressEventHandler

    /** 浏览器原生下载进度事件处理函数。 */
    onDownloadProgress?: ProgressEventHandler
}

export interface HTTPResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: ResponseHeaders;
    config: HTTPRequest;
    request?: any;
}

export class HTTPClient {
    /** 底层 HTTP 客户端驱动。 */
    private readonly driver: AxiosInstance;

    /** 默认请求配置。 */
    public defaults: HTTPRequest = {
        method: "GET",
        timeout: 2000,
        withCredentials: true,
        validateStatus: status => status >= 200 && status < 300 || status === 304,
    };

    constructor(config?: HTTPRequest) {
        this.driver = axios.create(config ?? this.defaults);
    }

    /** 创建一个新的 HTTP 客户端实例。 */
    create(defaultConfig?: HTTPRequest): HTTPClient {
        return new HTTPClient(defaultConfig ?? this.defaults);
    }

    async get(url: string, params?: URLSearchParams, config?: HTTPRequest): Promise<HTTPResponse> {
        return this.driver.get(url, {...config, params});
    }

    async post(url: string, data?: object, config?: HTTPRequest): Promise<HTTPResponse> {
        return this.driver.post(url, data, config ?? this.defaults);
    }

    async put(url: string, data?: object, config?: HTTPRequest): Promise<HTTPResponse> {
        return this.driver.put(url, data, config ?? this.defaults);
    }

    async delete(url: string, params?: URLSearchParams, config?: HTTPRequest): Promise<HTTPResponse> {
        return this.driver.delete(url, {...config, params});
    }

    async options(url: string, params?: URLSearchParams, config?: HTTPRequest): Promise<HTTPResponse> {
        return this.driver.options(url, {...config, params});
    }
}

/** 全局静态 HTTP 客户端单例。 */
export const HTTP = new HTTPClient();