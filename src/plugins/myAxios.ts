import axios, {AxiosInstance} from "axios";
import { ApiResponse, ApiErrorCode } from '../types/api';

const isDev = process.env.NODE_ENV === 'development';

const myAxios: AxiosInstance = axios.create({
    baseURL: isDev ? '/api' : '线上地址',
});

myAxios.defaults.withCredentials = true; // 配置为true

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    const data: ApiResponse = response.data;
    
    // 未登录则跳转到登录页
    if (data?.code === ApiErrorCode.NOT_LOGIN) {
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    
    // 返回响应数据
    return data;
}, function (error) {
    console.error('请求错误:', error);
    return Promise.reject(error);
});

export default myAxios;
