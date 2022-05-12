/** 实用函数。 */
import {HTTPClient, HTTPRequest, HTTPResponse, ProgressEventHandler} from "./core.js";

export const HTTPUtils = {
    /** 将二进制文件放置到 FormData 对象中，以 'multipart/form-data' 格式上传。 */
    async postFileAsFormData(driver: HTTPClient, url: string,
                             data: Blob,
                             onUploadProgress?: ProgressEventHandler,
                             config?: HTTPRequest
    ): Promise<HTTPResponse> {
        const fd = new FormData();
        fd.append("file", data);

        return driver.post(url, data, {
            ...config,
            headers: {...(config?.headers), 'Content-Type': 'multipart/form-data'},
            onUploadProgress
        });
    },

    /** 下载文件，返回二进制 Blob 对象。 */
    async getFileBlob(driver: HTTPClient, url: string,
                      params?: URLSearchParams,
                      onDownloadProgress?: ProgressEventHandler,
                      config?: HTTPRequest
    ): Promise<Blob> {
        return (await driver.get(url, params, {
            ...config,
            onDownloadProgress,
            responseType: "blob"
        })).data;
    },
};
