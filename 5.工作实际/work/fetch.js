
// [fetch]: https://www.cnblogs.com/libin-1/p/6853677.html
// Fetch 是 Web 提供的一个用于获取资源的接口，如果要终止 fetch 请求，则可以使用 Web 提供的 AbortController 接口。

// 首先我们使用 AbortController() 构造函数创建一个控制器，然后使用 AbortController.signal 属性获取其关联 AbortSignal 对象的引用。
//当一个 fetch request 初始化时，我们把 AbortSignal 作为一个选项传递到请求对象 (如下：{signal}) 。
//这将信号和控制器与获取请求相关联，然后允许我们通过调用 AbortController.abort() 中止请求
// const controller = new AbortController();
// let signal = controller.signal;
//  console.log('signal 的初始状态: ', signal);

// const downloadBtn = document.querySelector('.download');
// const abortBtn = document.querySelector('.abort');

// downloadBtn.addEventListener('click', fetchVideo);

// abortBtn.addEventListener('click', function() {
//   controller.abort();
//  console.log('signal 的中止状态: ', signal);
// });

// function fetchVideo() {
//   //...
//   fetch(url, {signal}).then(function(response) {
//     //...
//   }).catch(function(e) {
//     reports.textContent = 'Download error: ' + e.message;
//   })
// }

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
      let baseUrl = 'http://localhost:3000'
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

