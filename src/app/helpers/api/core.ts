import axios, { AxiosRequestConfig } from 'axios'

export const call = function(url: string, config?: AxiosRequestConfig) {
    return axios(url, config);
}