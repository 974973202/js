// 生成指定范围随机数
export const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 数组乱序
export const arrScrambling = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}

// 数组扁平化
export const flatten = (arr) => {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// 数组中获取随机数
export const sample = arr => arr[Math.floor(Math.random() * arr.length)];

// 生成随机字符串
export const randomString = (len) => {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  let strLen = chars.length;
  let randomStr = '';
  for (let i = 0; i < len; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * strLen));
  }
  return randomStr;
};

// 字符串首字母大写
export const fistLetterUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 手机号中间四位变成*
export const telFormat = (tel) => {
  tel = String(tel);
  return tel.substr(0, 3) + "****" + tel.substr(7);
  //  return tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 驼峰命名转换成短横线命名
export const getKebabCase = (str) => {
  return str.replace(/[A-Z]/g, (item) => '-' + item.toLowerCase())
}

// 短横线命名转换成驼峰命名
export const getCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (i, item) => item.toUpperCase())
}

// 校验身份证号码
export const checkCardNo = (value) => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(value);
};

// 校验是否包含中文
export const haveCNChars = (value) => {
  return /[\u4e00-\u9fa5]/.test(value);
}

// 校验是否为中国大陆的邮政编码
export const isPostCode = (value) => {
  return /^[1-9][0-9]{5}$/.test(value.toString());
}

// 校验是否为IPv6地址
export const isIPv6 = (str) => {
  return Boolean(str.match(/:/g) ? str.match(/:/g).length <= 7 : false && /::/.test(str) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str));
}

// 校验是否为邮箱地址
export const isEmail = (value) => {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
}

// 校验是否为中国大陆手机号
export const isTel = (value) => {
  return /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString());
}

// 获取URL参数列表
export const GetRequest = () => {
  let url = location.search;
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split('='); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })
  return paramsObj;
};

// 检测URL是否有效
export const getUrlState = (URL) => {
  let xmlhttp = new ActiveXObject("microsoft.xmlhttp");
  xmlhttp.Open("GET", URL, false);
  try {
    xmlhttp.Send();
  } catch (e) {
  } finally {
    let result = xmlhttp.responseText;
    if (result) {
      if (xmlhttp.Status == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

// 键值对拼接成URL参数
export const params2Url = (obj) => {
  let params = []
  for (let key in obj) {
    params.push(`${key}=${obj[key]}`);
  }
  return encodeURIComponent(params.join('&'))
}

// 修改URL中的参数
export const replaceParamVal = (paramName, replaceWith) => {
  const oUrl = location.href.toString();
  const re = eval('/(' + paramName + '=)([^&]*)/gi');
  location.href = oUrl.replace(re, paramName + '=' + replaceWith);
  return location.href;
}

// 删除URL中指定参数
export const funcUrlDel = (name) => {
  const baseUrl = location.origin + location.pathname + "?";
  const query = location.search.substr(1);
  if (query.indexOf(name) > -1) {
    const obj = {};
    const arr = query.split("&");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    }
    delete obj[name];
    return baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
  }
}

// 判断是移动还是PC设备
export const isMobile = () => {
  if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
    return 'mobile';
  }
  return 'desktop';
}

// 判断是否是苹果还是安卓移动设备
export const isAppleMobileDevice = () => {
  let reg = /iphone|ipod|ipad|Macintosh/i;
  return reg.test(navigator.userAgent.toLowerCase());
}

// 判断是否是安卓移动设备
export const isAndroidMobileDevice = () => {
  return /android/i.test(navigator.userAgent.toLowerCase());
}

// 判断是Windows还是Mac系统
export const osType = () => {
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  const isWindows = agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0 || agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0;
  if (isWindows) {
    return "windows";
  }
  if (isMac) {
    return "mac";
  }
}

// 判断是否是微信/QQ内置浏览器
export const broswer = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return "weixin";
  } else if (ua.match(/QQ/i) == "qq") {
    return "QQ";
  }
  return false;
}

// 浏览器型号和版本
export const getExplorerInfo = () => {
  let t = navigator.userAgent.toLowerCase();
  return 0 <= t.indexOf("msie") ? { //ie < 11
    type: "IE",
    version: Number(t.match(/msie ([\d]+)/)[1])
  } : !!t.match(/trident\/.+?rv:(([\d.]+))/) ? { // ie 11
    type: "IE",
    version: 11
  } : 0 <= t.indexOf("edge") ? {
    type: "Edge",
    version: Number(t.match(/edge\/([\d]+)/)[1])
  } : 0 <= t.indexOf("firefox") ? {
    type: "Firefox",
    version: Number(t.match(/firefox\/([\d]+)/)[1])
  } : 0 <= t.indexOf("chrome") ? {
    type: "Chrome",
    version: Number(t.match(/chrome\/([\d]+)/)[1])
  } : 0 <= t.indexOf("opera") ? {
    type: "Opera",
    version: Number(t.match(/opera.([\d]+)/)[1])
  } : 0 <= t.indexOf("Safari") ? {
    type: "Safari",
    version: Number(t.match(/version\/([\d]+)/)[1])
  } : {
    type: t,
    version: -1
  }
}

// 滚动到页面顶部
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop;
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, height - height / 8);
  }
}

// 滚动到页面底部
export const scrollToBottom = () => {
  window.scrollTo(0, document.documentElement.clientHeight);
}

// 滚动到指定元素区域
export const smoothScroll = (element) => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  });
};

// 获取可视窗口高度
export const getClientHeight = () => {
  let clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return clientHeight;
}

// 获取可视窗口宽度
export const getPageViewWidth = () => {
  return (document.compatMode == "BackCompat" ? document.body : document.documentElement).clientWidth;
}

// 打开浏览器全屏
export const toFullScreen = () => {
  let element = document.body;
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}

// 退出浏览器全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

// 当前时间
export const nowTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate() >= 10 ? now.getDate() : ('0' + now.getDate());
  const hour = now.getHours() >= 10 ? now.getHours() : ('0' + now.getHours());
  const miu = now.getMinutes() >= 10 ? now.getMinutes() : ('0' + now.getMinutes());
  const sec = now.getSeconds() >= 10 ? now.getSeconds() : ('0' + now.getSeconds());
  return +year + "年" + (month + 1) + "月" + date + "日 " + hour + ":" + miu + ":" + sec;
}

// 格式化时间
export const dateFormater = (formater, time) => {
  let date = time ? new Date(time) : new Date(),
    Y = date.getFullYear() + '',
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return formater.replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}
// dateFormater('YYYY-MM-DD HH:mm:ss')
// dateFormater('YYYYMMDDHHmmss')

// 阻止冒泡事件
export const stopPropagation = (e) => {
  e = e || window.event;
  if (e.stopPropagation) {    // W3C阻止冒泡方法 
    e.stopPropagation();
  } else {
    e.cancelBubble = true; // IE阻止冒泡方法 
  }
}

// 随机获取布尔值
export const getRandomBoolean = () => Math.random() >= 0.5;

// 检查日期是否为周末
export const isWeekend = (date) => [0, 6].indexOf(date.getDay()) !== -1;

// 计算两个日期之间的天数
export const daysDiff = (date, date2) => Math.ceil(Math.abs(date - date2) / 86400000);

//将文字复制到剪贴板
export const copyTextToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

// 判断文件类型是否以.xxx格式结尾
// 1. 'xx.png'.endsWith('.png', 4)    2. 'xx.png'.split('.').slice(-1)[0] === 'png'

// 取小数点后两位
// 1. xxx.toFixed(2)  2. Math.floor(xxx * 100) / 100  3. Number(xxx.toString().match(/^\d+(?:\.\d{0,2})?/))