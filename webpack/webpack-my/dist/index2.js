
            (function(modules) {
                function require(fileName) {
                    const fn = modules[fileName];
        
                    const module = { exports : {} };
        
                    fn(require, module, module.exports);
        
                    return module.exports;
                }
                require('C:\Users\lzx\Desktop\webpackLoader\src\index.js');
            })({'C:\Users\lzx\Desktop\webpackLoader\src\index.js': function (require, module, exports) { "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

var _c = _interopRequireDefault(require("./c.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_a["default"] + _b["default"]); },'./a.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var a = 10;
var _default = a;
exports["default"] = _default; },'./b.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var b = 5;
var _default = b;
exports["default"] = _default; },'./c.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var c = 50;
var _default = c;
exports["default"] = _default; },})
        