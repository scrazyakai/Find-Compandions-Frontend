import axios, { AxiosInstance } from "axios";
import { ApiResponse, ApiErrorCode } from '../types/api';

const myAxios: AxiosInstance = axios.create({
    baseURL: 'https://api.findcompanions.xyz/api',
    withCredentials: false // 如果需要 cookie，则为 true
});

myAxios.defaults.withCredentials = true; // 配置为true

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    const data: ApiResponse = response.data;
    if (data?.code === ApiErrorCode.NOT_LOGIN) {
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return data;
}, function (error) {
    console.error('请求错误:', error);
    return Promise.reject(error);
});

export default myAxios;
