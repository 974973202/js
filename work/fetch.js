
// [fetch]: https://www.cnblogs.com/libin-1/p/6853677.html

import { Toast } from 'antd-mobile'

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

/**
 * fetch的请求
 * @param url 请求地址
 * @param data 请求参数
 * @param method 请求方式
 */
export default function request(url = '', data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    method = method.toUpperCase()
    let options = {
      method: method,
      headers: {
        // 'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
    }
    if(method === 'GET') {
      const dataStr = obj2String(data);
      dataStr && ( url += '?' + dataStr );
    } else {
      Object.defineProperty(options, 'body', {
        value: JSON.stringify(data)
      })
    }
    if(process.env.NODE_ENV === 'production') {
      let baseUrl = 'http://localhost:8080'
      url = baseUrl + url;
    }
    // const req = new Request(url, options)
    // fetch(req)
    fetch(url, options)
      .then((response) => {
        if(response.ok) {
          // console.log(response)
          try {
            return response.json()
          }catch(e) {
            console.log(e)
          }
        } else {
          // console.log(response)
          return Toast.info(`${response.status} ${response.statusText}`)
        }
      })
      .then((response) => {
        return resolve(response)
      })
      .catch((error) => {
        return reject(error)
      })
  })
}

