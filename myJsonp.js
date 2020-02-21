function jsonp({ url, params, cb }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    let p = { ...params, cb };
    let arrs = []
    for (let prop in p) {
      arrs.push(`${prop}=${p[prop]}`)
    }
    script.src = `${url}?prod=pc&${arrs.join("&")}`;
    window[cb] = function (data) {
      resolve(data)
      document.body.removeChild(script)
    }
    document.body.appendChild(script);
  })
}

jsonp({
  url: `https://pic.sogou.com/pics?query=钢铁侠&len=40`,
  params: {},
  cb: "show"
}).then(data=>console.log(data));