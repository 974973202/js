
		(function(graph){
			function require(module) { 
				function localRequire(relativePath) {
					return require(graph[module].yilai[relativePath]);
                }
                var exports = {};
				(function(require, exports, code){
					eval(code)
				})(localRequire, exports, graph[module].code);
				return exports;
			};
			require('./src/index.js')
		})({"./src/index.js":{"yilai":{"./a.js":"./src\\a.js","./b.js":"./src\\b.js","./c.js":"./src\\c.js"},"code":"\"use strict\";\n\nvar _a = _interopRequireDefault(require(\"./a.js\"));\nvar _b = _interopRequireDefault(require(\"./b.js\"));\nvar _c = _interopRequireDefault(require(\"./c.js\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nconsole.log(_a[\"default\"] + _b[\"default\"], 'hello webpack');"},"./src\\a.js":{"yilai":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar a = 10;\nvar _default = exports[\"default\"] = a;"},"./src\\b.js":{"yilai":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar b = 5;\nvar _default = exports[\"default\"] = b;"},"./src\\c.js":{"yilai":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar c = 50;\nvar _default = exports[\"default\"] = c;"}});
	