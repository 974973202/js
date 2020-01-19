import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      method,
      params: method.toUpperCase() === 'GET' ? data : '',
      data: method.toUpperCase() !== 'GET' ? qs.stringify(data) : '',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      resolve(res)
    }, (error) => {
      reject(error)
    })
  })
}
