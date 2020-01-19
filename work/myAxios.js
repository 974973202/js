const urlLib = require('url');

export function assert(exp, msg = 'assert faild') {
  if (!exp) {
    throw new Error(msg);
  }
}

function createResponse(xhr) {
  let arr = xhr.getAllResponseHeaders().split('\r\n');
  let headers = {};

  arr.forEach(str => {
    if (!str) return;
    let [name, val] = str.split(': ');
    headers[name] = val;
  });

  return {
    ok: true,
    status: xhr.status,
    statusText: xhr.statusText,
    data: xhr.response,
    headers,
    xhr,
  };
}

export function merge(dest, src) {
  for (let name in src) {
    if (typeof src[name] == 'object') {
      if (!dest[name]) {
        dest[name] = {};
      }

      merge(dest[name], src[name]);
    } else {
      dest[name] = src[name];
    }
  }
}

function deepClone(target, obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (Object.prototype.toString.call(obj[prop]) === "[object Object]") {
        // target[prop] = deepClone(obj[prop])
        deepClone(target[prop], obj[prop])
      } else {
        target[prop] = obj[prop]
      }
    }
  }
}

class Interceptor {
  constructor() {
    this._list = [];
  }

  use(fn) {
    this._list.push(fn);
  }

  list() {
    return this._list;
  }
}

function request(options) {
  console.error(options);
  let xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url, true);

  for (let name in options.headers) {
    xhr.setRequestHeader(
      encodeURIComponent(name),
      encodeURIComponent(options.headers[name]),
    );
  }

  xhr.send(options.data);

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 ** xhr.status < 300) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      }
    };
  });
}

const _default = {
  method: 'get',
  baseUrl: "",
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
    delete: {},
  },
};

class Axios {
  constructor() {
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor(),
    };

    let _this = this;
    return new Proxy(request, {
      set(data, name, val) {
        _this[name] = val;

        return true;
      },
      get(data, name) {
        return _this[name];
      },
      apply(fn, thisArg, args) {
        let options = _this._preprocessArgs(undefined, args);
        if (!options) {
          if (args.length == 2) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' &&
              args[1] &&
              args[1].constructor == Object,
              'args[1] must is JSON',
            );

            options = {
              ...args[1],
              url: args[0],
            };
            _this.request(options);
          } else {
            assert(false, 'invaild args');
          }
        }
      }
    })
  }

  _preprocessArgs(method, args) {
    let options;
    if (args.length === 1 && typeof args[0] == 'string') {
      options = { method, url: args[0] };
      this.request(options);
    } else if (args.length === 1 && args[0].constructor === Object) {
      options = {
        ...args[0],
        method,
      };
      this.request(options);
    } else {
      // console.error(args.length, args)
      return undefined;
    }
    console.log('options', options);
    return options;
  }

  request(options) {
    // 1. 合并头
    let _headers = this.default.headers;
    delete this.default.headers;
    merge(options, this.default);
    this.default.headers = _headers;

    // this.default.headers.common -> this.default.headers.get -> options
    let headers = {};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);

    options.headers = headers;
    console.log(options);

    // 2. 检测参数是否正确
    assert(options.method, 'no method');
    assert(typeof options.method == 'string', 'method must be string');
    assert(options.url, 'no url');
    assert(typeof options.url == 'string', 'url must be string');

    // 3. baseUrl 合并请求
    options.url = urlLib.resolve(options.baseUrl, options.url);
    delete options.baseUrl;

    // 4. 变换一下请求
    const { transformRequest, transformResponse } = options;
    delete options.transformRequest;
    delete options.transformResponse;

    if (transformRequest) options = transformRequest(options);

    let list = this.interceptors.request.list();
    list.forEach(fn => {
      options = fn(options);
    });

    // 5. 正式调用request(options)
    return new Promise((resolve, reject) => {
      return request(options).then(
        xhr => {
          let res = createResponse(xhr);
          if (transformResponse) res = transformResponse(res);

          let list = this.interceptors.response.list();
          list.forEach(fn => {
            res = fn(res);
          });
          resolve(res);
        },
        xhr => {
          let err = { ok: false }
          reject(err);
        },
      );
    });
  }

  get(...args) {
    let options = this._preprocessArgs('get', args);

    if (!options) {
      if (args.length === 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[1] == 'object' &&
          args[1] &&
          args[1].constructor === Object,
          'args[1] must is JSON',
        );

        options = {
          ...args[1],
          url: args[0],
          method: 'get',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild args');
      }
    }
  }

  post(...args) {
    let options = this._preprocessArgs('post', args);

    if (!options) {
      if (args.length == 2) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        options = {
          url: args[0],
          data: args[1],
          method: 'post',
        };

        return this.request(options);
      } else if (args.length == 3) {
        assert(typeof args[0] == 'string', 'args[0] must is string');
        assert(
          typeof args[2] == 'object' &&
          args[2] &&
          args[2].constructor == Object,
          'args[2] must is JSON',
        );
        options = {
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
        return this.request(options);
      } else {
        assert(false, 'invaild argments');
      }
    }
  }

  delete(...args) {
    let options = this._preprocessArgs('delete', args);

    if (!options) {
      assert(typeof args[0] == 'string', 'args[0] must is string');
      assert(
        typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
        'args[1] must is JSON',
      );

      options = {
        ...args[1],
        url: args[0],
        method: 'get',
      };

      return this.request(options);
    }
  }
}

Axios.create = Axios.prototype.create = function (options = {}) {
  let axios = new Axios();

  // axios.default = {
  //   ...JSON.parse(JSON.stringify(_default)),
  //   ...options,
  // }

  let res = { ...JSON.parse(JSON.stringify(_default)) };

  // merge(res, options);
  deepClone(res, options);

  axios.default = res;

  return axios;
};

// let axios = new Axios();

// export default axios;

export default Axios.create();