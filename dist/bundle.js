/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Loading.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Loading.ts":
/*!************************!*\
  !*** ./src/Loading.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Main_1 = __webpack_require__(/*! ./Main */ \"./src/Main.ts\");\nwindow.onload = function () {\n    var main = new Main_1.default();\n    var imgSrcArr = [\n        \"./resource/up.jpg\",\n        \"./resource/down.jpg\",\n        \"./resource/left.jpg\",\n        \"./resource/right.jpg\",\n        \"./resource/attack.jpg\",\n    ];\n    var total = imgSrcArr.length;\n    var current = 0;\n    var name;\n    for (var i = 0; i < total; i++) {\n        var path = imgSrcArr[i];\n        name = path.substring(path.lastIndexOf(\"/\") + 1, path.lastIndexOf(\".\"));\n        main.images[name] = new Image();\n        main.images[name].src = imgSrcArr[i];\n        main.images[name].style.width = \"54px\";\n        main.images[name].style.height = \"54px\";\n        main.images[name].onload = function () {\n            current++;\n            if (current === total) {\n                main.createScene();\n            }\n        };\n    }\n};\n\n\n//# sourceURL=webpack:///./src/Loading.ts?");

/***/ }),

/***/ "./src/Main.ts":
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Role_1 = __webpack_require__(/*! ./Role */ \"./src/Role.ts\");\nvar Main = /** @class */ (function () {\n    function Main() {\n        this.canvasHeight = 600;\n        this.canvasWidth = 800;\n        this.images = {};\n        this.canvas = document.createElement(\"canvas\");\n        this.canvas.height = this.canvasHeight;\n        this.canvas.width = this.canvasWidth;\n        document.getElementById(\"display\").appendChild(this.canvas);\n        this.ctx = this.canvas.getContext(\"2d\");\n        this.map = [];\n        this.roles = [];\n    }\n    Main.prototype.createScene = function () {\n        var data = {\n            width: 54,\n            height: 54,\n            x: 0,\n            y: this.canvasHeight - 54,\n            maxHealthPoint: 100,\n            attackPower: 3,\n            moveSpeed: 6,\n            jumpSpeed: 10,\n        };\n        this.roles[0] = new Role_1.default(data);\n        this.roles[0].images = this.images;\n        this.roles[0].canvas = this.canvas;\n        this.roles[0].ctx = this.ctx;\n        this.roles[0].render();\n    };\n    return Main;\n}());\nexports.default = Main;\n\n\n//# sourceURL=webpack:///./src/Main.ts?");

/***/ }),

/***/ "./src/Role.ts":
/*!*********************!*\
  !*** ./src/Role.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Role = /** @class */ (function () {\n    function Role(data) {\n        // element properties\n        this.selfHeight = data.height;\n        this.selfWidth = data.width;\n        this.selfX = data.x;\n        this.selfY = data.y;\n        // basic properties\n        this.selfStatus = \"left\";\n        this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;\n        this.attackPower = data.attackPower;\n        this.moveSpeed = data.moveSpeed;\n        this.jumpSpeed = data.jumpSpeed;\n    }\n    Object.defineProperty(Role.prototype, \"x\", {\n        // element properties setter & getter\n        get: function () {\n            return this.selfX;\n        },\n        set: function (x) {\n            this.selfX = x;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Role.prototype, \"y\", {\n        get: function () {\n            return this.selfY;\n        },\n        set: function (y) {\n            this.selfY = y;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Role.prototype, \"height\", {\n        get: function () {\n            return this.selfHeight;\n        },\n        set: function (height) {\n            this.selfHeight = height;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Role.prototype, \"width\", {\n        get: function () {\n            return this.selfWidth;\n        },\n        set: function (width) {\n            this.selfWidth = width;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Role.prototype, \"status\", {\n        get: function () {\n            return this.selfStatus;\n        },\n        set: function (status) {\n            this.selfStatus = status;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    // rendering\n    Role.prototype.render = function () {\n        this.ctx.drawImage(this.images[this.selfStatus], this.selfX, this.selfY, this.selfWidth, this.selfHeight);\n    };\n    return Role;\n}());\nexports.default = Role;\n\n\n//# sourceURL=webpack:///./src/Role.ts?");

/***/ })

/******/ });