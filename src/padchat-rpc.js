"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var events_1 = require("events");
var json_rpc_peer_1 = require("json-rpc-peer");
var ws_1 = require("ws");
var rx_queue_1 = require("rx-queue");
var padchat_schemas_1 = require("./padchat-schemas");
var padchat_rpc_type_1 = require("./padchat-rpc.type");
var pure_function_helpers_1 = require("./pure-function-helpers/");
var config_1 = require("./config");
var rpc_api_1 = require("./rpc-api");
var HEART_BEAT_COUNTER = 0;
var RPC_TIMEOUT_COUNTER = 0;
exports.DISCONNECTED = 'DISCONNECTED';
exports.CONNECTING = 'CONNECTING';
exports.CONNECTED = 'CONNECTED';
var PadchatRpc = /** @class */ (function (_super) {
    __extends(PadchatRpc, _super);
    function PadchatRpc(endpoint, token) {
        var _this = _super.call(this) // for EventEmitter
         || this;
        _this.endpoint = endpoint;
        _this.token = token;
        config_1.log.verbose('PadchatRpc', 'constructor(%s, %s)', endpoint, token);
        _this.connectionStatus = {
            interval: config_1.RE_CON_INTERVAL,
            reconnectLeft: config_1.RE_CON_RETRY,
            status: exports.DISCONNECTED
        };
        _this.pendingApiCalls = [];
        _this.jsonRpc = new json_rpc_peer_1["default"]();
        return _this;
    }
    PadchatRpc.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PadchatRpc', 'start()');
                        return [4 /*yield*/, this.initWebSocket()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initJsonRpc()];
                    case 2:
                        _a.sent();
                        this.startQueues();
                        return [4 /*yield*/, this.init()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.WXInitialize()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatRpc.prototype.reconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.info('PadchatRpc', 'reconnect()');
                        this.cleanConnection();
                        return [4 /*yield*/, this.initWebSocket()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.init()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.WXInitialize()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatRpc.prototype.updateConnectionStatus = function (status) {
        var reconnectLeft;
        if (status === exports.CONNECTING) {
            reconnectLeft = this.connectionStatus.reconnectLeft - 1;
        }
        else {
            reconnectLeft = config_1.RE_CON_RETRY;
        }
        if (status === exports.CONNECTED && this.connectionStatus.status === exports.CONNECTING) {
            this.executeBufferedApiCalls();
        }
        this.connectionStatus.status = status;
        this.connectionStatus.reconnectLeft = reconnectLeft;
    };
    PadchatRpc.prototype.cleanConnection = function () {
        if (this.socket && this.socket.readyState === 1) {
            this.socket.removeAllListeners();
            this.socket.close();
        }
        this.socket = undefined;
    };
    PadchatRpc.prototype.executeBufferedApiCalls = function () {
        var _this = this;
        var timer = setTimeout(function () {
            clearTimeout(timer);
            if (_this.pendingApiCalls.length > 0) {
                var apiCallsInOrder = _this.pendingApiCalls.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                apiCallsInOrder.map(function (api, index) {
                    var id = setTimeout(function () {
                        clearTimeout(id);
                        _this.jsonRpc.request(api.apiName, api.params)
                            .then(function (res) {
                            api.resolve(res);
                        })["catch"](function (reason) {
                            api.reject(reason);
                        });
                    }, config_1.POST_LOGIN_API_CALL_INTERVAL * index);
                });
                _this.pendingApiCalls = [];
            }
        }, 1000);
    };
    PadchatRpc.prototype.initJsonRpc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                config_1.log.verbose('PadchatRpc', 'initJsonRpc()');
                if (!this.socket) {
                    throw new Error('socket had not been opened yet!');
                }
                this.jsonRpc.on('error', function () {
                    // TypeError: Cannot read property 'resolve' of undefined
                    // https://github.com/JsCommunity/json-rpc-peer/issues/52
                });
                this.jsonRpc.on('data', function (buffer) {
                    // log.silly('PadchatRpc', 'initJsonRpc() jsonRpc.on(data)')
                    if (!_this.socket) {
                        throw new Error('no web socket');
                    }
                    var text = String(buffer);
                    var payload = json_rpc_peer_1.parse(text); // as JsonRpcPayloadRequest
                    /**
                     * A Gateway at here:
                     *
                     *  1. Convert Payload format from JsonRpc to Padchat, then
                     *  2. Send payload to padchat server
                     *
                     */
                    // const encodedParam = (payload.params as JsonRpcParamsSchemaByPositional).map(encodeURIComponent)
                    var encodedParam = payload.params.map(encodeURIComponent);
                    var message = {
                        apiName: payload.method,
                        msgId: payload.id,
                        param: encodedParam,
                        userId: _this.token
                    };
                    // log.silly('PadchatRpc', 'initJsonRpc() jsonRpc.on(data) converted to padchat payload="%s"', JSON.stringify(message))
                    _this.socket.send(JSON.stringify(message));
                });
                return [2 /*return*/];
            });
        });
    };
    PadchatRpc.prototype.initWebSocket = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ws;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PadchatRpc', 'initWebSocket()');
                        if (this.socket) {
                            throw new Error('socket had already been opened!');
                        }
                        ws = new ws_1["default"](this.endpoint, { perMessageDeflate: true, maxPayload: 100 * 1024 * 1024 });
                        /**
                         * 1. Message
                         *  1.1. Deal with payload
                         */
                        ws.on('message', function (data) {
                            config_1.log.silly('PadchatRpc', 'initWebSocket() ws.on(message): %s', data.substr(0, 100));
                            try {
                                var payload = JSON.parse(data);
                                _this.onSocket(payload);
                            }
                            catch (e) {
                                config_1.log.warn('PadchatRpc', 'initWebSocket() ws.on(message) exception: %s', e);
                                _this.emit('error', e);
                            }
                        });
                        /**
                         * 1. Message
                         *  1.2. use websocket message as heartbeat source
                         */
                        ws.on('message', function () {
                            if (!_this.throttleQueue || !_this.debounceQueue) {
                                config_1.log.warn('PadchatRpc', 'initWebSocket() ws.on(message) throttleQueue or debounceQueue not exist');
                                return;
                            }
                            if (_this.connectionStatus.status === exports.CONNECTED) {
                                _this.debounceQueue.next('ws.on(message)');
                                _this.throttleQueue.next('ws.on(message)');
                            }
                        });
                        /**
                         * 2. Error
                         */
                        ws.on('error', function (e) {
                            if (e.message.indexOf('ECONNREFUSED') !== -1) {
                                // Can not connect to remote server, if this is triggered when puppet-padchat is connected,
                                // an close event must be emitted, so ignore this error
                                // If this is triggered when puppet-padchat is trying to reconnect, also ignore this error
                            }
                            else {
                                config_1.log.verbose('PadchatRpc', 'initWebSocket() ws.on(error) %s', e);
                                _this.emit('error', e);
                            }
                        });
                        /**
                         * 3. Close
                         */
                        ws.on('close', function (code, reason) {
                            config_1.log.warn('PadchatRpc', 'initWebSocket() ws.on(close) code: %s, reason: %s', code, reason);
                            if (!_this.reconnectThrottleQueue) {
                                config_1.log.warn('PadchatRpc', 'initWebSocket() ws.on(close) reconnectThrottleQueue not exist');
                                return;
                            }
                            if (_this.connectionStatus.status === exports.CONNECTED) {
                                _this.reconnectThrottleQueue.next('ws.on(close, ' + code + ')');
                            }
                        });
                        /**
                         * 4. Pong
                         */
                        ws.on('pong', function (data) {
                            config_1.log.silly('PadchatRpc', 'initWebSocket() ws.on(pong)');
                            if (!_this.throttleQueue || !_this.debounceQueue) {
                                config_1.log.warn('PadchatRpc', 'initWebSocket() ws.on(pong) throttleQueue or debounceQueue not exist');
                                return;
                            }
                            if (_this.connectionStatus.status === exports.CONNECTED) {
                                _this.throttleQueue.next('pong: ' + data.toString());
                                _this.debounceQueue.next('pong: ' + data.toString());
                            }
                        });
                        /**
                         * 5. Wait the WebSocket to be connected
                         */
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                ws.once('open', function () {
                                    config_1.log.silly('PadchatRpc', 'initWebSocket() Promise() ws.on(open)');
                                    return resolve();
                                });
                                ws.once('error', function (e) {
                                    config_1.log.silly('PadchatRpc', 'initWebSocket() Promise() ws.on(error) %s', e);
                                    return reject();
                                });
                                ws.once('close', function () {
                                    config_1.log.silly('PadchatRpc', 'initWebSocket() Promise() ws.on(close)');
                                    return reject();
                                });
                            })
                            /**
                             * 6. Set socket to the new WebSocket instance
                             */
                        ];
                    case 1:
                        /**
                         * 5. Wait the WebSocket to be connected
                         */
                        _a.sent();
                        /**
                         * 6. Set socket to the new WebSocket instance
                         */
                        this.socket = ws;
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatRpc.prototype.initHeartbeat = function () {
        var _this = this;
        config_1.log.verbose('PadchatRpc', 'initHeartbeat()');
        if (!this.throttleQueue || !this.debounceQueue) {
            config_1.log.warn('PadchatRpc', 'initHeartbeat() throttleQueue or debounceQueue not exist');
            return;
        }
        if (this.throttleSubscription || this.debounceSubscription) {
            throw new Error('subscription exist when initHeartbeat');
        }
        this.throttleSubscription = this.throttleQueue.subscribe(function (e) {
            /**
             * This block will only be run once in a period,
             *  no matter than how many message the queue received.
             */
            config_1.log.silly('PadchatRpc', 'initHeartbeat() throttleQueue.subscribe(%s)', e);
            _this.emit('heartbeat', e);
        });
        this.debounceSubscription = this.debounceQueue.subscribe(function (e) {
            /**
             * This block will be run when:
             *  the queue did not receive any message after a period.
             */
            if (_this.connectionStatus.status !== exports.CONNECTED) {
                return;
            }
            var _a = _this, socket = _a.socket, reconnectThrottleQueue = _a.reconnectThrottleQueue;
            config_1.log.silly('PadchatRpc', 'initHeartbeat() debounceQueue.subscribe(%s)', e);
            if (!socket) {
                throw new Error('no socket');
            }
            if (!reconnectThrottleQueue) {
                config_1.log.warn('PadchatRpc', 'initHeartbeat() debounceQueue.subscribe(%s) reconnectThrottleQueue not exist', e);
                return;
            }
            // tslint:disable-next-line:no-floating-promises
            _this.WXHeartBeat().then(function () {
                RPC_TIMEOUT_COUNTER = 0;
            })["catch"](function (reason) {
                if (reason === 'timeout' || reason === 'parsed-data-not-array') {
                    config_1.log.verbose('PadchatRpc', 'initHeartbeat() debounceQueue.subscribe(s%) WXHeartBeat %s', e, reason);
                    RPC_TIMEOUT_COUNTER++;
                    if (RPC_TIMEOUT_COUNTER >= config_1.MAX_HEARTBEAT_TIMEOUT) {
                        RPC_TIMEOUT_COUNTER = 0;
                        reconnectThrottleQueue.next("WXHeartBeat Timed out in " + config_1.CON_TIME_OUT + "ms for " + config_1.MAX_HEARTBEAT_TIMEOUT + " times. Possible disconnected from Wechat. So trigger reconnect.");
                    }
                }
                else {
                    config_1.log.verbose('PadchatRpc', 'initHeartbeat() debounceQueue.subscribe(%s) error happened: %s', e, reason);
                }
            })["finally"](function () {
                // expect the server will response a 'pong' message
                socket.ping("#" + HEART_BEAT_COUNTER++ + " from debounceQueue");
            });
        });
    };
    PadchatRpc.prototype.reset = function (reason) {
        if (reason === void 0) { reason = 'unknown reason'; }
        config_1.log.verbose('PadchatRpc', 'reset(%s)', reason);
        this.emit('reset', reason);
    };
    PadchatRpc.prototype.stop = function () {
        config_1.log.verbose('PadchatRpc', 'stop()');
        this.stopQueues();
        this.jsonRpc.removeAllListeners();
        // TODO: use huan's version of JsonRpcPeer, to support end at here.
        // this.jsonRpc.end()
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.close();
            this.socket = undefined;
        }
        else {
            config_1.log.warn('PadchatRpc', 'stop() no socket');
        }
    };
    PadchatRpc.prototype.startQueues = function () {
        var _this = this;
        config_1.log.verbose('PadchatRpc', 'startQueues()');
        /**
         * Throttle for 10 seconds
         */
        this.throttleQueue = new rx_queue_1.ThrottleQueue(1000 * 10);
        /**
         * Debounce for 20 seconds
         */
        this.debounceQueue = new rx_queue_1.DebounceQueue(1000 * 10 * 2);
        /**
         * Throttle for 5 seconds for the `reconnect` event:
         *  we should only fire once for reconnect,
         *  but many events might be triggered
         */
        this.reconnectThrottleQueue = new rx_queue_1.ThrottleQueue(1000 * 5);
        /**
         * Throttle for 5 seconds for the `reset` event:
         *  we should only fire once for reset,
         *  but the server will send many events of 'reset'
         */
        this.resetThrottleQueue = new rx_queue_1.ThrottleQueue(1000 * 5);
        this.initHeartbeat();
        if (this.reconnectThrottleSubscription) {
            throw new Error('this.reconnectThrottleSubscription exist');
        }
        else {
            this.reconnectThrottleSubscription = this.reconnectThrottleQueue.subscribe(function (msg) {
                if (_this.connectionStatus.status === exports.CONNECTED) {
                    _this.updateConnectionStatus(exports.DISCONNECTED);
                    _this.jsonRpc.failPendingRequests(exports.DISCONNECTED);
                    _this.emit('reconnect', msg);
                }
            });
        }
        if (this.resetThrottleSubscription) {
            throw new Error('this.reconnectThrottleSubscription exist');
        }
        else {
            this.resetThrottleSubscription = this.resetThrottleQueue.subscribe(function (msg) {
                if (_this.connectionStatus.status === exports.CONNECTED) {
                    _this.reset(msg);
                }
            });
        }
    };
    PadchatRpc.prototype.stopQueues = function () {
        config_1.log.verbose('PadchatRpc', 'stopQueues()');
        if (this.throttleSubscription
            && this.debounceSubscription
            && this.reconnectThrottleSubscription
            && this.resetThrottleSubscription) {
            // Clean external subscriptions
            this.debounceSubscription.unsubscribe();
            this.reconnectThrottleSubscription.unsubscribe();
            this.throttleSubscription.unsubscribe();
            this.resetThrottleSubscription.unsubscribe();
            this.debounceSubscription = undefined;
            this.reconnectThrottleSubscription = undefined;
            this.throttleSubscription = undefined;
            this.resetThrottleSubscription = undefined;
        }
        if (this.debounceQueue
            && this.reconnectThrottleQueue
            && this.resetThrottleQueue
            && this.throttleQueue) {
            /**
             * Queues clean internal subscriptions
             */
            this.debounceQueue.unsubscribe();
            this.reconnectThrottleQueue.unsubscribe();
            this.throttleQueue.unsubscribe();
            this.resetThrottleQueue.unsubscribe();
            this.debounceQueue = undefined;
            this.reconnectThrottleQueue = undefined;
            this.throttleQueue = undefined;
            this.resetThrottleQueue = undefined;
        }
        else {
            config_1.log.warn('PadchatRpc', 'stop() subscript not exist');
        }
    };
    PadchatRpc.prototype.rpcCall = function (apiName) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var timestamp;
            var _this = this;
            return __generator(this, function (_a) {
                config_1.log.silly('PadchatRpc', 'rpcCall(%s, %s)', apiName, JSON.stringify(params).substr(0, 500));
                timestamp = new Date().getTime();
                // If get contact for self, this api call belongs to pre login api
                if (apiName === 'WXGetContact' && params.length === 1 && params[0] === this.userId) {
                    return [2 /*return*/, this.jsonRpc.request(apiName, params)];
                }
                // If post login apis calls failed, we will store the api call information
                // and make the call after the connection get restored
                if (rpc_api_1.POST_LOGIN_API.indexOf(apiName) !== -1) {
                    if (this.connectionStatus.status === exports.CONNECTED) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.jsonRpc.request(apiName, params)
                                    .then(function (res) {
                                    resolve(res);
                                })["catch"](function (reason) {
                                    if (reason === exports.DISCONNECTED) {
                                        config_1.log.verbose('PadchatRpc', 'rpcCall(%s) interrupted by connection broken, scheduled this api call. This call will be made again when connection restored', apiName);
                                        _this.pendingApiCalls.push({
                                            apiName: apiName,
                                            params: params,
                                            reject: reject,
                                            resolve: resolve,
                                            timestamp: timestamp
                                        });
                                    }
                                    else {
                                        reject(reason);
                                    }
                                });
                            })];
                    }
                    else {
                        config_1.log.verbose('PadchatRpc', 'puppet-padchat is disconnected, rpcCall(%s) is scheduled. This call will be made again when connection restored', apiName);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.pendingApiCalls.push({
                                    apiName: apiName,
                                    params: params,
                                    reject: reject,
                                    resolve: resolve,
                                    timestamp: timestamp
                                });
                            })];
                    }
                }
                else if (rpc_api_1.PRE_LOGIN_API.indexOf(apiName) !== -1) {
                    config_1.log.silly('PadchatRpc', 'pre login rpcCall(%s, %s)', apiName, JSON.stringify(params).substr(0, 200));
                    return [2 /*return*/, this.jsonRpc.request(apiName, params)];
                }
                else {
                    config_1.log.error('PadchatRpc', 'unexpected api call: %s', apiName);
                }
                return [2 /*return*/];
            });
        });
    };
    PadchatRpc.prototype.onSocket = function (payload) {
        // log.silly('PadchatRpc', 'onSocket(payload.length=%d)',
        //                           JSON.stringify(payload).length,
        //             )
        // console.log('server payload:', payload)
        if (payload.type === padchat_schemas_1.PadchatPayloadType.Logout) {
            // {"type":-1,"msg":"掉线了"}
            config_1.log.verbose('PadchatRpc', 'onSocket(payload.type=%s) logout, payload=%s(%s)', padchat_schemas_1.PadchatPayloadType[payload.type], payload.type, JSON.stringify(payload));
            // When receive this message, the bot should be logged out from the mobile phone
            // So do a full reset here
            if (this.resetThrottleQueue && this.connectionStatus.status === exports.CONNECTED) {
                this.resetThrottleQueue.next(payload.msg || 'onSocket(logout)');
            }
            else {
                config_1.log.warn('PadchatRpc', 'onSocket() resetThrottleQueue not exist');
            }
            return;
        }
        if (payload.type === padchat_schemas_1.PadchatPayloadType.InvalidPadchatToken) {
            config_1.log.error('PadchatRpc', 'onSocket(payload.type=%s) invalid padchat token, payload=%s(%s)', padchat_schemas_1.PadchatPayloadType[payload.type], payload.type, JSON.stringify(payload));
            throw new Error("\n\n\n===========================================================================================\n\n      The token is invalid, please use an valid token to access padchat\n      If you have question about this, please check out our wiki:\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/Buy-Padchat-Token\n\n      \u60A8\u4F7F\u7528\u7684Token\u662F\u65E0\u6548\u7684\uFF0C\u8BF7\u60A8\u8054\u7CFB\u6211\u4EEC\u83B7\u53D6\u6709\u6548Token\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\u8FD9\u4E2A\u9875\u9762\uFF1A\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/%E8%B4%AD%E4%B9%B0token\n\n============================================================================================\n\n\n      ");
        }
        if (payload.type === padchat_schemas_1.PadchatPayloadType.OnlinePadchatToken) {
            config_1.log.error('PadchatRpc', 'onSocket(payload.type=%s) token is already connected with a bot, please don\'t use the same token to start multiple bot, payload=%s(%s)', padchat_schemas_1.PadchatPayloadType[payload.type], payload.type, JSON.stringify(payload));
            throw new Error("\n\n\n===========================================================================================\n\n      The token you are using is logged in with another bot, please don't use the same\n      token to start multiple bots. If you have question about this, please check\n      out our wiki and contact us:\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/Buy-Padchat-Token\n\n      \u60A8\u4F7F\u7528\u7684Token\u5DF2\u7ECF\u767B\u5F55\u4E86\u4E00\u4E2A\u673A\u5668\u4EBA\uFF0C\u8BF7\u4E0D\u8981\u4F7F\u7528\u540C\u4E00\u4E2AToken\u767B\u5F55\u591A\u4E2A\u673A\u5668\u4EBA\uFF0C\u5982\u679C\u60A8\u5BF9\u6B64\u6709\u7591\u95EE\uFF0C\u8BF7\n      \u53C2\u8003\u8FD9\u4E2A\u9875\u9762\u4E0A\u7684\u8054\u7CFB\u65B9\u5F0F\u8054\u7CFB\u6211\u4EEC\uFF1A\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/%E8%B4%AD%E4%B9%B0token\n\n============================================================================================\n\n\n      ");
        }
        if (payload.type === padchat_schemas_1.PadchatPayloadType.ExpirePadchatToken) {
            config_1.log.error('PadchatRpc', 'onSocket(payload.type=%s) token is expired, please renew the token, payload=%s(%s)', padchat_schemas_1.PadchatPayloadType[payload.type], payload.type, JSON.stringify(payload));
            throw new Error("\n\n\n===========================================================================================\n\n      The token you are using is expired, please contact us and renew this token\n      Here is our wiki, you can find the contact info here:\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/Buy-Padchat-Token\n\n      \u60A8\u4F7F\u7528\u7684Token\u5DF2\u7ECF\u8FC7\u671F\u4E86\uFF0C\u5982\u679C\u60A8\u60F3\u7EE7\u7EED\u4F7F\u7528wechaty-puppet-padchat\uFF0C\u8BF7\u7EED\u8D39\u60A8\u7684Token\n      \u8BE6\u60C5\u8BF7\u53C2\u8003\u4EE5\u4E0B\u8FD9\u4E2A\u9875\u9762\n      https://github.com/lijiarui/wechaty-puppet-padchat/wiki/%E8%B4%AD%E4%B9%B0token\n\n============================================================================================\n\n\n      ");
        }
        if (!payload.msgId && !payload.data) {
            /**
             * Discard message that have neither msgId(Padchat API Call) nor data(Tencent Message)
             */
            if (Object.keys(payload).length === 4) {
                // {"apiName":"","data":"","msgId":"","userId":"padchat-token-zixia"}
                // just return for this message
                return;
            }
            config_1.log.silly('PadchatRpc', 'onSocket() discard payload without `msgId` and `data` for: %s', JSON.stringify(payload));
            return;
        }
        if (payload.msgId) {
            // 1. Padchat Payload
            //
            // padchatPayload:
            // {
            //     "apiName": "WXHeartBeat",
            //     "data": "%7B%22status%22%3A0%2C%22message%22%3A%22ok%22%7D",
            //     "msgId": "abc231923912983",
            //     "userId": "test"
            // }
            this.onSocketPadchat(payload);
        }
        else {
            // 2. Tencent Payload
            //
            // messagePayload:
            // {
            //   "apiName": "",
            //   "data": "XXXX",
            //   "msgId": "",
            //   "userId": "test"
            // }
            var tencentPayloadList = pure_function_helpers_1.padchatDecode(payload.data);
            if (!Array.isArray(tencentPayloadList)) {
                throw new Error('not array');
            }
            this.onSocketTencent(tencentPayloadList);
        }
        RPC_TIMEOUT_COUNTER = 0;
    };
    PadchatRpc.prototype.onSocketPadchat = function (padchatPayload) {
        // log.verbose('PadchatRpc', 'onSocketPadchat({apiName="%s", msgId="%s", ...})',
        //                                     padchatPayload.apiName,
        //                                     padchatPayload.msgId,
        //             )
        // log.silly('PadchatRpc', 'onSocketPadchat(%s)', JSON.stringify(padchatPayload).substr(0, 500))
        var result;
        if (padchatPayload.data) {
            result = pure_function_helpers_1.padchatDecode(padchatPayload.data);
        }
        else {
            config_1.log.silly('PadchatRpc', 'onServerMessagePadchat() discard empty payload.data for apiName: %s', padchatPayload.apiName);
            result = {};
        }
        // const jsonRpcResponse: JsonRpcPayloadResponse = {
        var jsonRpcResponse = {
            id: padchatPayload.msgId,
            jsonrpc: '2.0',
            result: result,
            type: 'response'
        };
        var responseText = JSON.stringify(jsonRpcResponse);
        // log.silly('PadchatRpc', 'onSocketPadchat() converted to JsonRpc payload="%s"', responseText.substr(0, 500))
        this.jsonRpc.write(responseText);
    };
    PadchatRpc.prototype.onSocketTencent = function (messagePayloadList) {
        // console.log('tencent messagePayloadList:', messagePayloadList)
        for (var _i = 0, messagePayloadList_1 = messagePayloadList; _i < messagePayloadList_1.length; _i++) {
            var messagePayload = messagePayloadList_1[_i];
            if (!messagePayload.msg_id) {
                // {"continue":0,"msg_type":32768,"status":1,"uin":1928023446}
                config_1.log.silly('PadchatRpc', 'onSocketTencent() discard empty message msg_id payoad: %s', JSON.stringify(messagePayload));
                continue;
            }
            // log.silly('PadchatRpc', 'onSocketTencent() messagePayload: %s', JSON.stringify(messagePayload))
            this.emit('message', messagePayload);
        }
    };
    PadchatRpc.prototype.replayTextMsg = function (msgId, to, text) {
        var payload = this.generateBaseMsg(msgId, to);
        payload.sub_type = padchat_schemas_1.PadchatMessageType.Text;
        payload.content = text;
        config_1.log.silly('PadchatRpc', 'replayTextMsg replaying message: %s', JSON.stringify(payload));
        this.onSocketTencent([payload]);
    };
    PadchatRpc.prototype.replayImageMsg = function (msgId, to, data) {
        var payload = this.generateBaseMsg(msgId, to);
        payload.sub_type = padchat_schemas_1.PadchatMessageType.Image;
        payload.data = data;
        config_1.log.silly('PadchatRpc', 'replayImageMsg replaying message: %s', JSON.stringify(payload).substr(0, 200));
        this.onSocketTencent([payload]);
    };
    PadchatRpc.prototype.replayAppMsg = function (msgId, to, content) {
        var payload = this.generateBaseMsg(msgId, to);
        payload.sub_type = padchat_schemas_1.PadchatMessageType.App;
        // Special conversion for Url Link message
        payload.content = "<msg>" + content.trim().replace(/\n/g, '').replace(/> +</g, '><') + "</msg>";
        config_1.log.silly('PadchatRpc', 'replayAppMsg replaying message: %s', JSON.stringify(payload).substr(0, 200));
        this.onSocketTencent([payload]);
    };
    // Generate base message that sent from self
    PadchatRpc.prototype.generateBaseMsg = function (msgId, to) {
        var msg = {
            content: '',
            "continue": padchat_schemas_1.PadchatContinue.Done,
            description: '',
            from_user: this.userId,
            msg_id: msgId,
            msg_source: '',
            msg_type: padchat_schemas_1.PadchatMessageMsgType.Five,
            status: padchat_schemas_1.PadchatMessageStatus.One,
            sub_type: padchat_schemas_1.PadchatMessageType.App,
            timestamp: new Date().getTime() / 1000,
            to_user: to,
            uin: 0
        };
        config_1.log.silly('PadchatRpc', 'generateBaseMsg(%s, %s) %s', msgId, to, JSON.stringify(msg));
        return msg;
    };
    /**
     * Init with WebSocket Server
     */
    PadchatRpc.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('init')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'init result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('cannot connect to WebSocket init');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get WX block memory
     */
    PadchatRpc.prototype.WXInitialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PadchatRpc', 'WXInitialize()');
                        return [4 /*yield*/, this.rpcCall('WXInitialize')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXInitialize result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('cannot connect to WebSocket WXInitialize');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXGetQRCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetQRCode')];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXCheckQRCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXCheckQRCode')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXCheckQRCode result: %s', JSON.stringify(result));
                        if (!result) {
                            throw Error('cannot connect to WebSocket WXCheckQRCode');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXHeartBeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXHeartBeat')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXHeartBeat result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXHeartBeat error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Load all Contact and Room
     * see issue https://github.com/lijiarui/wechaty-puppet-padchat/issues/39
     * @returns {Promise<(PadchatRoomPayload | PadchatContactPayload)[]>}
     */
    PadchatRpc.prototype.WXSyncContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSyncContact')];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('WXSyncContact error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Generate 62 data
     *
     * 1. Call multiple times in the same session, will return the same data
     * 2. Call multiple times between sessions with the same token, will return the same data
     */
    PadchatRpc.prototype.WXGenerateWxDat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGenerateWxDat')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGenerateWxDat result: %s', JSON.stringify(result));
                        if (!result || !(result.data) || result.status !== 0) {
                            throw Error('WXGenerateWxDat error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result.data];
                }
            });
        });
    };
    /**
     * Load 62 data
     * @param {string} wxData     autoData.wxData
     */
    PadchatRpc.prototype.WXLoadWxDat = function (wxData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXLoadWxDat', wxData)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXLoadWxDat result: %s', JSON.stringify(result).substr(0, 100));
                        if (!result || result.status !== 0) {
                            throw Error('WXLoadWxDat error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXGetLoginToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetLoginToken')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetLoginToken result: %s', JSON.stringify(result));
                        if (!result || !result.token || result.status !== 0) {
                            throw Error('WXGetLoginToken error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result.token];
                }
            });
        });
    };
    /**
     * Login with token automatically
     * @param {string} token    autoData.token
     * @returns {string} user_name | ''
     */
    PadchatRpc.prototype.WXAutoLogin = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXAutoLogin', token)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXAutoLogin result: %s, type: %s', JSON.stringify(result), typeof result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Login with QRcode
     * @param {string} token    autoData.token
     */
    PadchatRpc.prototype.WXLoginRequest = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXLoginRequest', token)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXLoginRequest result: %s, type: %s', JSON.stringify(result), typeof result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Send Text Message
     * @param {string} to       user_name
     * @param {string} content  text
     */
    PadchatRpc.prototype.WXSendMsg = function (to, content, at) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!to) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpcCall('WXSendMsg', to, content, at ? JSON.stringify(at) : '')];
                    case 1:
                        result = _a.sent();
                        if (!result || result.status !== 0) {
                            throw Error('WXSendMsg error! canot get result from websocket server');
                        }
                        this.replayTextMsg(result.msg_id, to, content);
                        return [2 /*return*/, result];
                    case 2: throw Error('PadchatRpc, WXSendMsg error! no to!');
                }
            });
        });
    };
    /**
     * Send Image Message
     * @param {string} to     user_name
     * @param {string} data   image_data
     */
    PadchatRpc.prototype.WXSendImage = function (to, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSendImage', to, data)];
                    case 1:
                        result = _a.sent();
                        this.replayImageMsg(result.msg_id, to, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get contact by contact id
     * @param {any} id        user_name
     */
    PadchatRpc.prototype.WXGetContact = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetContact', id)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('PadchatRpc, WXGetContact, cannot get result from websocket server!');
                        }
                        config_1.log.silly('PadchatRpc', 'WXGetContact(%s) result: %s', id, JSON.stringify(result));
                        if (!result.user_name) {
                            config_1.log.silly('PadchatRpc', 'WXGetContact cannot get user_name, id: %s, "%s"', id, JSON.stringify(result));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get contact by contact id
     * @param {any} id        user_name
     */
    PadchatRpc.prototype.WXGetContactPayload = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pure_function_helpers_1.isContactId(id)) { // /@chatroom$/.test(id)) {
                            throw Error("should use WXGetRoomPayload because get a room id :" + id);
                        }
                        return [4 /*yield*/, this.WXGetContact(id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get contact by contact id
     * @param {any} id        user_name
     */
    PadchatRpc.prototype.WXGetRoomPayload = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pure_function_helpers_1.isRoomId(id)) { // (/@chatroom$/.test(id))) {
                            throw Error("should use WXGetContactPayload because get a contact id :" + id);
                        }
                        return [4 /*yield*/, this.WXGetContact(id)];
                    case 1:
                        result = _a.sent();
                        if (result.member) {
                            result.member = pure_function_helpers_1.padchatDecode(result.member);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get all member of a room by room id
     * @param {any} roomId        chatroom_id
     */
    PadchatRpc.prototype.WXGetChatRoomMember = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, tryMemberList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetChatRoomMember', roomId)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error('PadchatRpc, WXGetChatRoomMember, cannot get result from websocket server!');
                        }
                        // roomId not exist. (or no permision?)
                        // See: https://github.com/lijiarui/wechaty-puppet-padchat/issues/64#issuecomment-397319016
                        if (result.status === -19) {
                            return [2 /*return*/, null];
                        }
                        /**
                         * Bot quit the room, no roomId
                         * See: https://github.com/lijiarui/wechaty-puppet-padchat/issues/38
                         * {"chatroom_id":0,"count":0,"member":"null\n","message":"","status":0,"user_name":""}
                         */
                        if (Object.keys(result).length === 0 || (result.count === 0 && result.status === 0 && result.chatroom_id === 0)) {
                            return [2 /*return*/, null];
                        }
                        config_1.log.silly('PadchatRpc', 'WXGetChatRoomMember() result: %s', JSON.stringify(result).substr(0, 500));
                        // 00:40:44 SILL PadchatRpc WXGetChatRoomMember() result: {"chatroom_id":0,"count":0,"member":"null\n","message":"","status":0,"user_name":""}
                        try {
                            tryMemberList = pure_function_helpers_1.padchatDecode(result.member);
                            if (Array.isArray(tryMemberList)) {
                                result.member = tryMemberList;
                            }
                            else if (tryMemberList !== null) {
                                config_1.log.warn('PadchatRpc', 'WXGetChatRoomMember(%s) member is neither array nor null: %s', roomId, JSON.stringify(result.member));
                                // throw Error('faild to parse chatroom member!')
                                result.member = [];
                            }
                        }
                        catch (e) {
                            config_1.log.warn('PadchatRpc', 'WXGetChatRoomMember(%s) result.member decode error: %s', roomId, e);
                            result.member = [];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Login successfully by qrcode
     * @param {any} username        user_name
     * @param {any} password  password
     */
    PadchatRpc.prototype.WXQRCodeLogin = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXQRCodeLogin', username, password)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw Error("PadchatRpc, WXQRCodeLogin, unknown error, data: " + JSON.stringify(result));
                        }
                        if (result.status === 0) {
                            config_1.log.silly('PadchatRpc', 'WXQRCodeLogin, login successfully!');
                            return [2 /*return*/, result];
                        }
                        if (result.status === -3) {
                            throw Error('PadchatRpc, WXQRCodeLogin, wrong user_name or password');
                        }
                        else if (result.status === -301) {
                            config_1.log.warn('PadchatRpc', 'WXQRCodeLogin, redirect 301');
                            return [2 /*return*/, this.WXQRCodeLogin(username, password)];
                        }
                        throw Error("PadchatRpc, WXQRCodeLogin,\n    If the status is -106, please refer to https://github.com/botorange/puppet-padchat-patch for a temporary solution\n    unknown status: " + result.status + ", for username: " + username);
                }
            });
        });
    };
    PadchatRpc.prototype.WXSetUserRemark = function (id, remark) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetUserRemark', id, remark)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetUserRemark result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetUserRemark error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXDeleteChatRoomMember = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXDeleteChatRoomMember', roomId, contactId)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXDeleteChatRoomMember result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXDeleteChatRoomMember error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXAddChatRoomMember = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXAddChatRoomMember', roomId, contactId)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXAddChatRoomMember result: %s', JSON.stringify(result));
                        if (!result) {
                            throw Error('WXAddChatRoomMember error! canot get result from websocket server');
                        }
                        if (result.status === padchat_rpc_type_1.WXRoomAddTypeStatus.Done) {
                            // see more in WXAddChatRoomMemberType
                            if (/OK/i.test(result.message)) {
                                return [2 /*return*/, 0];
                            }
                            config_1.log.warn('PadchatRpc', 'WXAddChatRoomMember() status = 0 but message is not OK: ' + result.message);
                            return [2 /*return*/, -1];
                        }
                        /**
                         * see https://github.com/lijiarui/wechaty-puppet-padchat/issues/70
                         * If room member more than 40
                         * Need call `WXInviteChatRoomMember` instead `WXAddChatRoomMember`
                         */
                        if (result.status === padchat_rpc_type_1.WXRoomAddTypeStatus.NeedInvite) {
                            config_1.log.silly('PadchatRpc', 'WXAddChatRoomMember change to WXInviteChatRoomMember');
                            return [2 /*return*/, this.WXInviteChatRoomMember(roomId, contactId)];
                        }
                        if (result.status === padchat_rpc_type_1.WXRoomAddTypeStatus.InviteConfirm) {
                            // result: {"message":"","status":-2028}
                            // May be the owner has see not allow other people to join in the room (群聊邀请确认)
                            config_1.log.warn('PadchatRpc', 'WXAddChatRoomMember failed! maybe owner open the should confirm first to invited others to join in the room.');
                        }
                        return [2 /*return*/, result.status];
                }
            });
        });
    };
    /**
     * When member more than 40, use WXInviteChatRoomMember
     * When member less than 40, use WXAddChatRoomMember
     *
     * @param {string} roomId
     * @param {string} contactId
     * @returns {Promise<number>}
     */
    PadchatRpc.prototype.WXInviteChatRoomMember = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXInviteChatRoomMember', roomId, contactId)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXInviteChatRoomMember result: %s', JSON.stringify(result));
                        if (!result) {
                            throw Error('WXInviteChatRoomMember error! canot get result from websocket server');
                        }
                        if (result.status === padchat_rpc_type_1.WXRoomAddTypeStatus.Done) {
                            // see more in WXAddChatRoomMemberType
                            if (/OK/i.test(result.message)) {
                                return [2 /*return*/, 0];
                            }
                            config_1.log.warn('PadchatRpc', 'WXInviteChatRoomMember() status = 0 but message is not OK: ' + result.message);
                            return [2 /*return*/, -1];
                        }
                        // TODO
                        // Should check later
                        if (result.status === -padchat_rpc_type_1.WXRoomAddTypeStatus.InviteConfirm) {
                            // result: {"message":"","status":-2028}
                            // May be the owner has see not allow other people to join in the room (群聊邀请确认)
                            config_1.log.warn('PadchatRpc', 'WXInviteChatRoomMember failed! maybe owner open the should confirm first to invited others to join in the room.');
                        }
                        return [2 /*return*/, result.status];
                }
            });
        });
    };
    PadchatRpc.prototype.WXSetChatroomName = function (roomId, topic) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetChatroomName', roomId, topic)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetChatroomName result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetChatroomName error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXQuitChatRoom = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXQuitChatRoom', roomId)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXQuitChatRoom result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXQuitChatRoom error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXAddUser = function (strangerV1, strangerV2, type, verify) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXAddUser', strangerV1, strangerV2, type, verify)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXAddUser result: %s', JSON.stringify(result));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXAcceptUser = function (stranger, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXAcceptUser', stranger, ticket)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXAcceptUser result: %s', JSON.stringify(result));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXLogout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXLogout')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXLogout result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXLogout error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    PadchatRpc.prototype.WXSendMoments = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSendMoments', text)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSendMoments result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSendMoments error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Sync Chat Message
    PadchatRpc.prototype.WXSyncMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.rpcCall('WXSyncMessage').then(function (result) {
                            config_1.log.silly('PadchatRpc', 'WXSyncMessage result: %s', JSON.stringify(result));
                            if (!result || !result[0] || (result[0].status !== 1 && result[0].status !== -1)) {
                                resolve();
                            }
                            else {
                                var tencentPayloadList = pure_function_helpers_1.padchatDecode(result);
                                if (!Array.isArray(tencentPayloadList)) {
                                    config_1.log.warn('PadchatRpc', 'WXSyncMessage() parsed data is not an array: %s', JSON.stringify(tencentPayloadList));
                                    reject('parsed-data-not-array');
                                }
                                _this.onSocketTencent(tencentPayloadList);
                                resolve();
                            }
                        })["catch"](reject);
                        var timer = setTimeout(function () {
                            clearTimeout(timer);
                            reject('timeout');
                        }, config_1.CON_TIME_OUT);
                    })];
            });
        });
    };
    // This function is used for add new friends by id
    PadchatRpc.prototype.WXSearchContact = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSearchContact', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSearchContact result: %s', JSON.stringify(result));
                        if ((!result) && (result.status !== padchat_rpc_type_1.WXSearchContactTypeStatus.Searchable) && (result.status !== padchat_rpc_type_1.WXSearchContactTypeStatus.UnSearchable)) {
                            throw Error('WXSearchContact error! canot get result from websocket server');
                        }
                        if (result.status === padchat_rpc_type_1.WXSearchContactTypeStatus.Searchable) {
                            config_1.log.verbose('PadchatRpc', 'WXSearchContact wxid: %s can be searched', id);
                        }
                        if (result.status === padchat_rpc_type_1.WXSearchContactTypeStatus.UnSearchable) {
                            config_1.log.verbose('PadchatRpc', 'WXSearchContact wxid: %s cannot be searched', id);
                            throw Error("ContactId " + id + " is not searchable");
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // send hello to strange
    PadchatRpc.prototype.WXSayHello = function (stranger, text) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSayHello', stranger, text)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSayHello , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSayHello , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // delete friend
    PadchatRpc.prototype.WXDeleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXDeleteUser', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXDeleteUser , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXDeleteUser , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PadchatRpc.prototype.WXCreateChatRoom = function (userList) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXCreateChatRoom', JSON.stringify(userList))];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXCreateChatRoom(userList.length=%d) = "%s"', userList.length, JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXCreateChatRoom , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, pure_function_helpers_1.stripBugChatroomId(result.user_name)];
                }
            });
        });
    };
    // TODO: check any
    // TODO: receive red-packet automatically
    // red_packet: see this from the recived message
    PadchatRpc.prototype.WXReceiveRedPacket = function (redPacket) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXReceiveRedPacket', redPacket)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXReceiveRedPacket , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXReceiveRedPacket , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // TODO: 查看红包
    PadchatRpc.prototype.WXQueryRedPacket = function (redPacket) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXQueryRedPacket', redPacket)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXQueryRedPacket , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXQueryRedPacket , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // TODO: 打开红包
    PadchatRpc.prototype.WXOpenRedPacket = function (redPacket) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXOpenRedPacket', redPacket)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXOpenRedPacket , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXOpenRedPacket , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // set user avatar, param image is the same as send [WXSendImage]
    PadchatRpc.prototype.WXSetHeadImage = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXOpenRedPacket', image)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXOpenRedPacket , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXOpenRedPacket , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // nick_name	昵称
    // signature	签名
    // sex			性别，1男，2女
    // country		国家，CN
    // provincia	地区，省，Zhejiang
    // city			城市，Hangzhou
    PadchatRpc.prototype.WXSetUserInfo = function (nickeName, signature, sex, country, provincia, city) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetUserInfo', nickeName, signature, sex, country, provincia, city)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetUserInfo , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetUserInfo , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // 查看附近的人
    // longitude	浮点数，经度
    // latitude		浮点数，维度
    PadchatRpc.prototype.WXGetPeopleNearby = function (longitude, latitude) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetPeopleNearby', longitude, latitude)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetPeopleNearby , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetPeopleNearby , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // 获取公众号信息 id: gh_xxxx
    PadchatRpc.prototype.WXGetSubscriptionInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetSubscriptionInfo', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetSubscriptionInfo , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetSubscriptionInfo , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO: check any
    // 执行公众号菜单操作
    // id			      公众号用户名
    // OrderId			菜单id，通过WXGetSubscriptionInfo获取, 原来叫id
    // OrderKey			菜单key，通过WXGetSubscriptionInfo获取, 原来叫key
    PadchatRpc.prototype.WXSubscriptionCommand = function (id, orderId, orderKey) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSubscriptionCommand', id, orderId, orderKey)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSubscriptionCommand , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSubscriptionCommand , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 公众号中获取url访问token, 给下面的函数使用[WXRequestUrl]
    // user			公众号用户名
    // url			访问的链接
    PadchatRpc.prototype.WXGetRequestToken = function (id, url) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetRequestToken', id, url)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetRequestToken , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetRequestToken , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 公众号中访问url
    // url			url地址
    // key			token中的key
    // uin		  token中的uin
    PadchatRpc.prototype.WXRequestUrl = function (url, key, uin) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXRequestUrl', url, key, uin)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXRequestUrl , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXRequestUrl , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 设置微信ID
    PadchatRpc.prototype.WXSetWeChatID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetWeChatID', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetWeChatID , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetWeChatID , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 查看转账信息
    // transfer		转账消息
    PadchatRpc.prototype.WXTransferQuery = function (transfer) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXTransferQuery', transfer)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXTransferQuery , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXTransferQuery , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 接受转账
    // transfer		转账消息
    PadchatRpc.prototype.WXTransferOperation = function (transfer) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXTransferOperation', transfer)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXTransferOperation , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXTransferOperation , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取消息图片 （应该是查看原图）
    // msg			收到的整个图片消息
    PadchatRpc.prototype.WXGetMsgImage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetMsgImage', msg)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetMsgImage , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetMsgImage , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取消息视频 （应该是查看视频）
    // msg			收到的整个视频消息
    PadchatRpc.prototype.WXGetMsgVideo = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetMsgVideo', msg)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetMsgVideo , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetMsgVideo , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取消息语音(语音消息大于20秒时通过该接口获取)
    // msg			收到的整个视频消息
    PadchatRpc.prototype.WXGetMsgVoice = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetMsgVoice', msg)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetMsgVoice ,result: %s', JSON.stringify(result).substr(0, 100));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetMsgVoice , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 搜索公众号
    // id			公众号用户名: gh_xxx
    PadchatRpc.prototype.WXWebSearch = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXWebSearch', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXWebSearch , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXWebSearch , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 分享名片
    // user			对方用户名
    // id			    名片的微信id
    // caption		名片的标题
    PadchatRpc.prototype.WXShareCard = function (user, id, caption) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXShareCard', user, id, caption)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXShareCard , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXShareCard , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 重置同步信息
    PadchatRpc.prototype.WXSyncReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSyncReset')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSyncReset , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSyncReset , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 扫描二维码获取信息
    // path			本地二维码图片全路径
    PadchatRpc.prototype.WXQRCodeDecode = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXQRCodeDecode', path)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXQRCodeDecode , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXQRCodeDecode , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 朋友圈上传图片获取url
    // image			图片数据, 和发送消息的image 是一样的base64 串
    PadchatRpc.prototype.WXSnsUpload = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsUpload', image)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsUpload , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsUpload , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取朋友圈消息详情(例如评论)
    // id			朋友圈消息id
    PadchatRpc.prototype.WXSnsObjectDetail = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsObjectDetail', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsObjectDetail , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsObjectDetail , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 朋友圈操作(删除朋友圈，删除评论，取消赞)
    // id			       朋友圈消息id
    // type			     操作类型,1为删除朋友圈，4为删除评论，5为取消赞
    // comment		   当type为4时，对应删除评论的id，通过WXSnsObjectDetail接口获取。当type为其他值时，comment不可用，置为0。
    // commentType	 评论类型,当删除评论时可用，2或者3.(规律未知)
    PadchatRpc.prototype.WXSnsObjectOp = function (id, type, comment, commentType) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsObjectOp', id, type, comment, commentType)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsObjectOp , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsObjectOp , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 朋友圈消息评论
    // user			  对方用户名
    // id			    朋友圈消息id
    // content		评论内容
    // replyId		回复的id    //如果想回复某人的评论，就加上他的comment_id  否则就用0
    PadchatRpc.prototype.WXSnsComment = function (user, id, content, replyId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsComment', user, id, content, replyId)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsComment , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsComment , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取好友朋友圈信息
    // user			对方用户名
    // id			    获取到的最后一次的id，第一次调用设置为空
    PadchatRpc.prototype.WXSnsUserPage = function (user, id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsUserPage', user, id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsUserPage , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsUserPage , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取朋友圈动态
    // id			    获取到的最后一次的id，第一次调用设置为空
    PadchatRpc.prototype.WXSnsTimeline = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsTimeline', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsTimeline , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsTimeline , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 发送APP消息(分享应用或者朋友圈链接等)
    // user			对方用户名
    // content		消息内容(整个消息结构<appmsg xxxxxxxxx>) 参考收到的MsgType
    PadchatRpc.prototype.WXSendAppMsg = function (user, content) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSendAppMsg', user, content)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSendAppMsg , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSendAppMsg , stranger,error! canot get result from websocket server');
                        }
                        this.replayAppMsg(result.msg_id, user, content);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 同步收藏消息(用户获取收藏对象的id)
    // key			同步的key，第一次调用设置为空。
    PadchatRpc.prototype.WXFavSync = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXFavSync', key)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXFavSync , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXFavSync , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 添加收藏
    // fav_object	收藏对象结构(<favitem type=5xxxxxx)
    PadchatRpc.prototype.WXFavAddItem = function (favObject) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXFavAddItem', favObject)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXFavAddItem , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXFavAddItem , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取收藏对象的详细信息
    // id			收藏对象id
    PadchatRpc.prototype.WXFavGetItem = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXFavGetItem', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXFavGetItem , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXFavGetItem , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 删除收藏对象
    // id			收藏对象id
    PadchatRpc.prototype.WXFavDeleteItem = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXFavDeleteItem', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXFavDeleteItem , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXFavDeleteItem , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取所有标签列表
    PadchatRpc.prototype.WXGetContactLabelList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetContactLabelList')];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetContactLabelList , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXGetContactLabelList , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 添加标签到列表
    // label			标签内容
    PadchatRpc.prototype.WXAddContactLabel = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXAddContactLabel', label)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXAddContactLabel , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXAddContactLabel , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 从列表删除标签
    // id			标签id
    PadchatRpc.prototype.WXDeleteContactLabel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXDeleteContactLabel', id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXDeleteContactLabel , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXDeleteContactLabel , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 从列表删除标签
    // user			用户名
    // id			    标签id
    PadchatRpc.prototype.WXSetContactLabel = function (user, id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetContactLabel', user, id)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetContactLabel , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetContactLabel , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 获取用户二维码(自己或者已加入的群)
    // user			用户名
    // style			是否使用风格化二维码
    PadchatRpc.prototype.WXGetUserQRCode = function (user, style) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXGetUserQRCode', user, style)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXGetUserQRCode , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0 || !result.qr_code) {
                            throw Error('WXGetUserQRCode, error: canot get result from websocket server');
                        }
                        // console.log('WXGetUserQRCode result:', result)
                        return [2 /*return*/, result.qr_code];
                }
            });
        });
    };
    // TODO check any
    // AppMsg上传数据
    // data			和发送图片的data 类似
    PadchatRpc.prototype.WXUploadAppAttach = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXUploadAppAttach', data)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXUploadAppAttach , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXUploadAppAttach , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 发送语音消息(微信silk格式语音)
    // user			对方用户名
    // voice_data	语音数据
    // voice_size	语音大小 (应该不需要)
    // voice_time	语音时间(毫秒，最大60 * 1000)
    PadchatRpc.prototype.WXSendVoice = function (user, data, time) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSendVoice', user, data, time)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSendVoice , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSendVoice , stranger,error! canot get result from websocket server');
                        }
                        // TODO: replay voice message
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 同步朋友圈动态(好友评论或点赞自己朋友圈的消息)
    // key		同步key
    PadchatRpc.prototype.WXSnsSync = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSnsSync', key)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSnsSync , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSnsSync , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 群发消息
    // user			用户名json数组 ["AB1","AC2","AD3"]
    // content		消息内容
    PadchatRpc.prototype.WXMassMessage = function (userList, content) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXMassMessage', JSON.stringify(userList), content)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXMassMessage , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXMassMessage , stranger,error! canot get result from websocket server');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // TODO check any
    // 设置群公告
    // chatroom	群id
    // content	    内容
    PadchatRpc.prototype.WXSetChatroomAnnouncement = function (chatroom, content) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpcCall('WXSetChatroomAnnouncement', chatroom, content)];
                    case 1:
                        result = _a.sent();
                        config_1.log.silly('PadchatRpc', 'WXSetChatroomAnnouncement , stranger,result: %s', JSON.stringify(result));
                        if (!result || result.status !== 0) {
                            throw Error('WXSetChatroomAnnouncement , stranger,error! canot get result from websocket server');
                        }
                        console.log('WXSetChatroomAnnouncement result:', result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return PadchatRpc;
}(events_1.EventEmitter));
exports.PadchatRpc = PadchatRpc;
