"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var get_jsend_1 = require("../helpers/get-jsend");
var mocker_1 = require("../mocker/mocker");
var buffer_1 = require("../buffer/buffer");
var methods_consts_1 = require("../consts/methods-consts");
var CreateMockerHandler = /** @class */ (function () {
    function CreateMockerHandler(portsRange) {
        this.usedPorts = [];
        this.hostname = '127.0.0.1';
        this.portsRange = portsRange;
        this.buffer = new buffer_1["default"]();
    }
    CreateMockerHandler.prototype.handle = function (req) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var port, mocker;
            var _this = this;
            return __generator(this, function (_a) {
                port = this.getPort();
                if (!port) {
                    resolve({ code: 500, jsend: get_jsend_1["default"](500, undefined, 'internal server error') });
                }
                mocker = new mocker_1["default"](this.hostname, port, this.buffer);
                mocker.loadServer();
                mocker.runServer().then(function () {
                    mocker.addRoute({
                        path: '/', method: methods_consts_1.GET, handler: {
                            handle: function (req) {
                                return new Promise(function (resolve) {
                                    resolve({ code: 204, jsend: undefined });
                                });
                            }
                        }
                    });
                    mocker.addRoute({
                        path: '/', method: methods_consts_1.DELETE, handler: {
                            handle: function (req) {
                                return new Promise(function (resolve) {
                                    resolve({ code: 204, jsend: undefined });
                                    setTimeout(function () {
                                        mocker.stopServer().then(function () {
                                            console.log('consegui fechar');
                                        })["catch"](function (err) {
                                            console.log(JSON.stringify(err));
                                        });
                                    }, 200);
                                });
                            }
                        }
                    });
                    var mockerInfoResponse = { port: port.toString() };
                    resolve({ code: 200, jsend: get_jsend_1["default"](200, JSON.stringify(mockerInfoResponse), 'mocker successfully created') });
                })["catch"](function (error) {
                    resolve({ code: 500, jsend: get_jsend_1["default"](500, undefined, 'internal server error') });
                })["finally"](function () {
                    _this.usedPorts.push(port);
                });
                return [2 /*return*/];
            });
        }); });
    };
    CreateMockerHandler.prototype.getPort = function () {
        var _this = this;
        var portsRange = this.portsRange.filter(function (num) { return !_this.usedPorts.includes(num); });
        var index = Math.floor(Math.random() * portsRange.length);
        return portsRange[index];
    };
    return CreateMockerHandler;
}());
exports["default"] = CreateMockerHandler;
