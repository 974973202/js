
(function (graph) {
	function require(module) {
		function localRequire(relativePath) {
			return require(graph[module].yilai[relativePath]);
		}
		var exports = {};

		(function (require, exports, code) {
			eval(code)
		})(localRequire, exports, graph[module].code);
		
		return exports;
	};
	require('./src/index.js')
})({ "./src/index.js": { "yilai": { "./a.js": "./src\\a.js", "./b.js": "./src\\b.js" }, "code": "\"use strict\";\n\nvar _a = _interopRequireDefault(require(\"./a.js\"));\n\nvar _b = _interopRequireDefault(require(\"./b.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_a[\"default\"] + _b[\"default\"]);" }, "./src\\a.js": { "yilai": {}, "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar a = 10;\nvar _default = a;\nexports[\"default\"] = _default;" }, "./src\\b.js": { "yilai": {}, "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar b = 5;\nvar _default = b;\nexports[\"default\"] = _default;" } });
