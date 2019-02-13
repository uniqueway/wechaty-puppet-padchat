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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var fs_extra_1 = require("fs-extra");
var os_1 = require("os");
var path_1 = require("path");
var file_box_1 = require("file-box");
var flash_store_1 = require("flash-store");
var rx_queue_1 = require("rx-queue");
var state_switch_1 = require("state-switch");
var wechaty_puppet_1 = require("wechaty-puppet");
var padchat_schemas_1 = require("./padchat-schemas");
var padchat_rpc_type_1 = require("./padchat-rpc.type");
var padchat_rpc_1 = require("./padchat-rpc");
var pure_function_helpers_1 = require("./pure-function-helpers/");
var config_1 = require("./config");
var MEMORY_SLOT_NAME = 'WECHATY_PUPPET_PADCHAT';
var PadchatManager = /** @class */ (function (_super) {
    __extends(PadchatManager, _super);
    function PadchatManager(options) {
        var _this = _super.call(this, options.endpoint, options.token) || this;
        _this.options = options;
        config_1.log.verbose('PuppetPadchatManager', 'constructor()');
        _this.memorySlot = {
            device: {}
        };
        _this.state = new state_switch_1.StateSwitch('PuppetPadchatManager');
        /**
         * Executer Queue: execute one task at a time,
         *  delay between them for 15 second
         */
        _this.delayQueueExecutor = new rx_queue_1.DelayQueueExector(1000 * 15);
        _this.contactListSynced = false;
        _this.roomNeedsToBeSync = 0;
        return _this;
    }
    PadchatManager.prototype.initCache = function (token, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var baseDir, baseDirExist, roomMemberTotalNum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'initCache(%s, %s)', token, userId);
                        if (this.cacheContactRawPayload
                            || this.cacheRoomMemberRawPayload
                            || this.cacheRoomRawPayload
                            || this.cacheRoomInvitationRawPayload) {
                            throw new Error('cache exists');
                        }
                        baseDir = path_1["default"].join(os_1["default"].homedir(), path_1["default"].sep, '.wechaty', 'puppet-padchat-cache', path_1["default"].sep, token, path_1["default"].sep, userId);
                        return [4 /*yield*/, fs_extra_1["default"].pathExists(baseDir)];
                    case 1:
                        baseDirExist = _a.sent();
                        if (!!baseDirExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs_extra_1["default"].mkdirp(baseDir)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.cacheContactRawPayload = new flash_store_1.FlashStoreSync(path_1["default"].join(baseDir, 'contact-raw-payload'));
                        this.cacheRoomMemberRawPayload = new flash_store_1.FlashStoreSync(path_1["default"].join(baseDir, 'room-member-raw-payload'));
                        this.cacheRoomRawPayload = new flash_store_1.FlashStoreSync(path_1["default"].join(baseDir, 'room-raw-payload'));
                        this.cacheRoomInvitationRawPayload = new flash_store_1.FlashStoreSync(path_1["default"].join(baseDir, 'room-invitation-raw-payload'));
                        return [4 /*yield*/, Promise.all([
                                this.cacheContactRawPayload.ready(),
                                this.cacheRoomMemberRawPayload.ready(),
                                this.cacheRoomRawPayload.ready(),
                                this.cacheRoomInvitationRawPayload.ready(),
                            ])];
                    case 4:
                        _a.sent();
                        roomMemberTotalNum = this.cacheRoomMemberRawPayload.values().slice().reduce(function (accuVal, currVal) {
                            return accuVal + Object.keys(currVal).length;
                        }, 0);
                        config_1.log.verbose('PuppetPadchatManager', 'initCache() inited %d Contacts, %d RoomMembers, %d Rooms, cachedir="%s"', this.cacheContactRawPayload.size, roomMemberTotalNum, this.cacheRoomRawPayload.size, baseDir);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.releaseCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'releaseCache()');
                        if (!(this.cacheContactRawPayload
                            && this.cacheRoomMemberRawPayload
                            && this.cacheRoomRawPayload
                            && this.cacheRoomInvitationRawPayload)) return [3 /*break*/, 2];
                        config_1.log.silly('PuppetPadchatManager', 'releaseCache() closing caches ...');
                        return [4 /*yield*/, Promise.all([
                                this.cacheContactRawPayload.close(),
                                this.cacheRoomMemberRawPayload.close(),
                                this.cacheRoomRawPayload.close(),
                                this.cacheRoomInvitationRawPayload.close(),
                            ])];
                    case 1:
                        _a.sent();
                        this.cacheContactRawPayload = undefined;
                        this.cacheRoomMemberRawPayload = undefined;
                        this.cacheRoomRawPayload = undefined;
                        this.cacheRoomInvitationRawPayload = undefined;
                        config_1.log.silly('PuppetPadchatManager', 'releaseCache() cache closed.');
                        return [3 /*break*/, 3];
                    case 2:
                        config_1.log.verbose('PuppetPadchatManager', 'releaseCache() cache not exist.');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, _b, succeed;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "start()");
                        if (this.userId) {
                            throw new Error('userId exist');
                        }
                        this.state.on('pending');
                        _c.label = 1;
                    case 1:
                        if (!(this.state.on() === 'pending')) return [3 /*break*/, 8];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, _super.prototype.start.call(this)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        e_1 = _c.sent();
                        config_1.log.warn('PuppetPadchatManager', 'start() super.start() exception: %s', e_1);
                        return [4 /*yield*/, _super.prototype.stop.call(this)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                    case 6:
                        _c.sent();
                        config_1.log.warn('PuppetPadchatManager', 'start() super.start() retry now ...');
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 1];
                    case 8:
                        if (this.delayQueueExecutorSubscription) {
                            throw new Error('this.delayExecutorSubscription exist');
                        }
                        else {
                            this.delayQueueExecutorSubscription = this.delayQueueExecutor.subscribe(function (unit) {
                                config_1.log.verbose('PuppetPadchatManager', 'startQueues() delayQueueExecutor.subscribe(%s) executed', unit.name);
                                if (_this.roomNeedsToBeSync === 0 && _this.contactListSynced) {
                                    _this.emit('ready');
                                }
                                else {
                                    config_1.log.verbose('PuppetPadchatManager', 'startQueues() delayQueueExecutor.subscribe(%s) %d rooms need to be synced', unit.name, _this.roomNeedsToBeSync);
                                }
                            });
                        }
                        _a = this;
                        _b = [{}, this.memorySlot];
                        return [4 /*yield*/, this.options.memory.get(MEMORY_SLOT_NAME)];
                    case 9:
                        _a.memorySlot = __assign.apply(void 0, _b.concat([_c.sent()]));
                        return [4 /*yield*/, this.tryLoad62Data()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, this.tryAutoLogin(this.memorySlot)];
                    case 11:
                        succeed = _c.sent();
                        if (!!succeed) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.startCheckScan()];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13:
                        this.state.on(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.reconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'reconnect(), retry attempt left: %d', this.connectionStatus.reconnectLeft);
                        this.updateConnectionStatus(padchat_rpc_1.CONNECTING);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 12]);
                        return [4 /*yield*/, _super.prototype.reconnect.call(this)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.tryLoad62Data()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.tryAutoLogin(this.memorySlot)];
                    case 4:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.refreshMemorySlotData(this.memorySlot, this.userId)];
                    case 5:
                        _a.memorySlot = _b.sent();
                        return [4 /*yield*/, this.options.memory.set(MEMORY_SLOT_NAME, this.memorySlot)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.options.memory.save()];
                    case 7:
                        _b.sent();
                        this.updateConnectionStatus(padchat_rpc_1.CONNECTED);
                        return [3 /*break*/, 12];
                    case 8:
                        e_2 = _b.sent();
                        if (!(this.connectionStatus.reconnectLeft === 0)) return [3 /*break*/, 9];
                        this.updateConnectionStatus(padchat_rpc_1.DISCONNECTED);
                        this.emit('error', new Error('Can not connect to wechaty-puppet-padchat server'));
                        return [3 /*break*/, 11];
                    case 9:
                        config_1.log.verbose('PuppetPadchat', 'reconnect(), failed to reconnect, retrying in %d seconds', this.connectionStatus.interval / 1000);
                        this.cleanConnection();
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, _this.connectionStatus.interval); })];
                    case 10:
                        _b.sent();
                        return [2 /*return*/, this.reconnect()];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "stop()");
                        this.state.off('pending');
                        if (this.delayQueueExecutorSubscription) {
                            this.delayQueueExecutorSubscription.unsubscribe();
                            this.delayQueueExecutorSubscription = undefined;
                        }
                        else {
                            config_1.log.warn('PuppetPadchatManager', 'stop() subscript not exist');
                        }
                        return [4 /*yield*/, this.stopCheckScan()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, _super.prototype.stop.call(this)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.releaseCache()];
                    case 3:
                        _a.sent();
                        this.userId = undefined;
                        this.loginScanQrcode = undefined;
                        this.loginScanStatus = undefined;
                        this.contactListSynced = false;
                        this.roomNeedsToBeSync = 0;
                        this.state.off(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.onLogin = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "login(%s)", userId);
                        if (this.userId) {
                            config_1.log.verbose('PuppetPadchatManager', 'reconnected(%s)', userId);
                            return [2 /*return*/];
                        }
                        this.userId = userId;
                        return [4 /*yield*/, this.stopCheckScan()
                            /**
                             * Update Memory Slot
                             */
                        ];
                    case 1:
                        _b.sent();
                        /**
                         * Update Memory Slot
                         */
                        _a = this;
                        return [4 /*yield*/, this.refreshMemorySlotData(this.memorySlot, userId)];
                    case 2:
                        /**
                         * Update Memory Slot
                         */
                        _a.memorySlot = _b.sent();
                        return [4 /*yield*/, this.options.memory.set(MEMORY_SLOT_NAME, this.memorySlot)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.options.memory.save()
                            /**
                             * Init persistence cache
                             */
                        ];
                    case 4:
                        _b.sent();
                        /**
                         * Init persistence cache
                         */
                        return [4 /*yield*/, this.initCache(this.options.token, this.userId)
                            /**
                             * Refresh the login-ed user payload
                             */
                        ];
                    case 5:
                        /**
                         * Init persistence cache
                         */
                        _b.sent();
                        if (!this.cacheContactRawPayload) return [3 /*break*/, 7];
                        this.cacheContactRawPayload["delete"](this.userId);
                        return [4 /*yield*/, this.contactRawPayload(this.userId)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        this.updateConnectionStatus(padchat_rpc_1.CONNECTED);
                        this.emit('login', this.userId);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "logout()");
                        if (!this.userId) {
                            config_1.log.warn('PuppetPadchatManager', 'logout() userId not exist, already logout-ed');
                            return [2 /*return*/];
                        }
                        if (this.delayQueueExecutorSubscription) {
                            this.delayQueueExecutorSubscription.unsubscribe();
                            this.delayQueueExecutorSubscription = undefined;
                        }
                        else {
                            config_1.log.warn('PuppetPadchatManager', 'logout() subscript not exist');
                        }
                        this.userId = undefined;
                        return [4 /*yield*/, this.releaseCache()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.startCheckScan()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.stopCheckScan = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchatManager', "stopCheckScan()");
                if (this.loginScanTimer) {
                    clearTimeout(this.loginScanTimer);
                    this.loginScanTimer = undefined;
                }
                this.loginScanQrcode = undefined;
                this.loginScanStatus = undefined;
                return [2 /*return*/];
            });
        });
    };
    PadchatManager.prototype.startCheckScan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checkScanInternalLoop;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "startCheckScan()");
                        if (!this.userId) return [3 /*break*/, 2];
                        config_1.log.warn('PuppetPadchatManager', 'startCheckScan() this.userId exist.');
                        return [4 /*yield*/, this.onLogin(this.userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (this.loginScanTimer) {
                            config_1.log.warn('PuppetPadchatManager', 'startCheckScan() this.loginScanTimer exist.');
                            return [2 /*return*/];
                        }
                        checkScanInternalLoop = function () { return __awaiter(_this, void 0, void 0, function () {
                            var waitUserResponse, result, _a, loginResult;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        config_1.log.silly('PuppetPadchatManager', "startCheckScan() checkScanInternalLoop()");
                                        waitUserResponse = true;
                                        _b.label = 1;
                                    case 1:
                                        if (!waitUserResponse) return [3 /*break*/, 14];
                                        return [4 /*yield*/, this.WXCheckQRCode()];
                                    case 2:
                                        result = _b.sent();
                                        if (this.loginScanStatus !== result.status && this.loginScanQrcode) {
                                            this.loginScanStatus = result.status;
                                            this.emit('scan', this.loginScanQrcode, this.loginScanStatus);
                                        }
                                        if (result.expired_time && result.expired_time < 10) {
                                            /**
                                             * result.expire_time is second
                                             * emit new qrcode 10 seconds before the old one expired
                                             */
                                            this.loginScanQrcode = undefined;
                                            this.loginScanStatus = undefined;
                                            waitUserResponse = false;
                                            return [3 /*break*/, 1];
                                        }
                                        _a = result.status;
                                        switch (_a) {
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.WaitScan: return [3 /*break*/, 3];
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.WaitConfirm: return [3 /*break*/, 4];
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.Confirmed: return [3 /*break*/, 5];
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.Timeout: return [3 /*break*/, 8];
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.Cancel: return [3 /*break*/, 9];
                                            case padchat_rpc_type_1.WXCheckQRCodeStatus.Ignore: return [3 /*break*/, 10];
                                        }
                                        return [3 /*break*/, 11];
                                    case 3:
                                        config_1.log.silly('PuppetPadchatManager', 'checkQrcode: Please scan the Qrcode!');
                                        return [3 /*break*/, 12];
                                    case 4:
                                        /**
                                         * WXCheckQRCode result:
                                         * {
                                         *  "expired_time": 236,
                                         *  "head_url": "http://wx.qlogo.cn/mmhead/ver_1/5VaXXlAx53wb3M46gQpVtLiaVMd4ezhxOibJiaZXLf2ajTNPZloJI7QEpVxd4ibgpEnLF8gHVuLricaJesjJpsFiciaOw/0",
                                         *  "nick_name": "李卓桓",
                                         *  "status": 1
                                         * }
                                         */
                                        config_1.log.silly('PuppetPadchatManager', 'checkQrcode: Had scan the Qrcode, but not Login!');
                                        return [3 /*break*/, 12];
                                    case 5:
                                        config_1.log.silly('PuppetPadchatManager', 'checkQrcode: Trying to login... please wait');
                                        if (!result.user_name || !result.password) {
                                            throw Error('PuppetPadchatManager, checkQrcode, cannot get username or password here, return!');
                                        }
                                        return [4 /*yield*/, this.WXQRCodeLogin(result.user_name, result.password)];
                                    case 6:
                                        loginResult = _b.sent();
                                        return [4 /*yield*/, this.onLogin(loginResult.user_name)];
                                    case 7:
                                        _b.sent();
                                        return [2 /*return*/];
                                    case 8:
                                        config_1.log.silly('PuppetPadchatManager', 'checkQrcode: Timeout');
                                        this.loginScanQrcode = undefined;
                                        this.loginScanStatus = undefined;
                                        waitUserResponse = false;
                                        return [3 /*break*/, 12];
                                    case 9:
                                        config_1.log.silly('PuppetPadchatManager', 'user cancel');
                                        this.loginScanQrcode = undefined;
                                        this.loginScanStatus = undefined;
                                        waitUserResponse = false;
                                        return [3 /*break*/, 12];
                                    case 10:
                                        config_1.log.silly('PuppetPadchatManager', 'ignore status -2');
                                        this.loginScanQrcode = undefined;
                                        this.loginScanStatus = undefined;
                                        waitUserResponse = false;
                                        return [3 /*break*/, 12];
                                    case 11:
                                        config_1.log.warn('PuppetPadchatManager', 'startCheckScan() unknown WXCheckQRCodeStatus: ' + result.status);
                                        this.loginScanQrcode = undefined;
                                        this.loginScanStatus = undefined;
                                        waitUserResponse = false;
                                        return [3 /*break*/, 12];
                                    case 12: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                                    case 13:
                                        _b.sent();
                                        return [3 /*break*/, 1];
                                    case 14: return [4 /*yield*/, this.emitLoginQrcode()];
                                    case 15:
                                        _b.sent();
                                        this.loginScanTimer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        this.loginScanTimer = undefined;
                                                        return [4 /*yield*/, checkScanInternalLoop()];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 1000);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        checkScanInternalLoop()
                            .then(function () {
                            config_1.log.silly('PuppetPadchatManager', "startCheckScan() checkScanInternalLoop() resolved");
                        })["catch"](function (e) {
                            config_1.log.warn('PuppetPadchatManager', 'startCheckScan() checkScanLoop() exception: %s', e);
                            _this.reset('startCheckScan() checkScanLoop() exception');
                        });
                        config_1.log.silly('PuppetPadchatManager', "startCheckScan() checkScanInternalLoop() set");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Offline, then relogin
     * emit qrcode or send login request to the user.
     */
    PadchatManager.prototype.tryAutoLogin = function (memorySlot) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUserId, deviceInfo, token, autoLoginResult, loginRequestResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "tryAutoLogin(%s)", memorySlot.currentUserId);
                        currentUserId = memorySlot.currentUserId;
                        if (!currentUserId) {
                            config_1.log.silly('PuppetPadchatManager', 'tryAutoLogin() currentUserId not found in memorySlot');
                            return [2 /*return*/, false];
                        }
                        deviceInfo = memorySlot.device[currentUserId];
                        if (!deviceInfo) {
                            config_1.log.silly('PuppetPadchatManager', 'tryAutoLogin() deviceInfo not found for userId "%s"', currentUserId);
                            return [2 /*return*/, false];
                        }
                        token = deviceInfo.token;
                        if (!token) {
                            config_1.log.silly('PuppetPadchatManager', 'tryAutoLogin() token not found for userId "%s"', currentUserId);
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.WXAutoLogin(token)];
                    case 1:
                        autoLoginResult = _a.sent();
                        if (!!autoLoginResult) return [3 /*break*/, 5];
                        /**
                         * 1.1 Delete token for prevent future useless auto login retry
                         */
                        delete deviceInfo.token;
                        return [4 /*yield*/, this.options.memory.set(MEMORY_SLOT_NAME, memorySlot)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.options.memory.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.emitLoginQrcode()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 5:
                        if (!(autoLoginResult.status === -2023)) return [3 /*break*/, 8];
                        delete deviceInfo.token;
                        return [4 /*yield*/, this.options.memory.set(MEMORY_SLOT_NAME, memorySlot)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.options.memory.save()];
                    case 7:
                        _a.sent();
                        this.emit('reset');
                        return [2 /*return*/, false];
                    case 8:
                        if (!(autoLoginResult.status === 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.onLogin(autoLoginResult.user_name)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 10: return [4 /*yield*/, this.WXLoginRequest(token)];
                    case 11:
                        loginRequestResult = _a.sent();
                        if (loginRequestResult && loginRequestResult.status === 0) {
                            return [2 /*return*/, false];
                        }
                        /**
                         * 4 Send Login Request to user fail, emit QrCode for scan.
                         */
                        return [4 /*yield*/, this.emitLoginQrcode()
                            /**
                             * 5 Delete token for prevent future useless auto login retry
                             */
                        ];
                    case 12:
                        /**
                         * 4 Send Login Request to user fail, emit QrCode for scan.
                         */
                        _a.sent();
                        /**
                         * 5 Delete token for prevent future useless auto login retry
                         */
                        delete deviceInfo.token;
                        return [4 /*yield*/, this.options.memory.set(MEMORY_SLOT_NAME, memorySlot)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.options.memory.save()];
                    case 14:
                        _a.sent();
                        return [2 /*return*/, false];
                }
            });
        });
    };
    PadchatManager.prototype.emitLoginQrcode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, fileBox, qrcodeDecoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "emitLoginQrCode()");
                        if (this.loginScanQrcode) {
                            throw new Error('qrcode exist');
                        }
                        return [4 /*yield*/, this.WXGetQRCode()];
                    case 1:
                        result = _a.sent();
                        if (!(!result || !result.qr_code)) return [3 /*break*/, 5];
                        config_1.log.verbose('PuppetPadchatManager', "emitLoginQrCode() result not found. Call WXInitialize() and try again ...");
                        return [4 /*yield*/, this.WXInitialize()
                            // wait 1 second and try again
                        ];
                    case 2:
                        _a.sent();
                        // wait 1 second and try again
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                    case 3:
                        // wait 1 second and try again
                        _a.sent();
                        return [4 /*yield*/, this.emitLoginQrcode()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5:
                        fileBox = file_box_1.FileBox.fromBase64(result.qr_code, 'qrcode.jpg');
                        return [4 /*yield*/, pure_function_helpers_1.fileBoxToQrcode(fileBox)];
                    case 6:
                        qrcodeDecoded = _a.sent();
                        this.loginScanQrcode = qrcodeDecoded;
                        this.loginScanStatus = padchat_rpc_type_1.WXCheckQRCodeStatus.WaitScan;
                        this.emit('scan', this.loginScanQrcode, this.loginScanStatus);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.refreshMemorySlotData = function (memorySlot, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, token, _a, _b, _c, _d, _e, data, token;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "refresh62Data(%s, %s)", userId);
                        /**
                         * must do a HeatBeat before WXGenerateWxData()
                         */
                        return [4 /*yield*/, this.WXHeartBeat()
                            /**
                             * 1. Empty memorySlot, init & return it
                             */
                        ];
                    case 1:
                        /**
                         * must do a HeatBeat before WXGenerateWxData()
                         */
                        _f.sent();
                        if (!!memorySlot.currentUserId) return [3 /*break*/, 4];
                        config_1.log.silly('PuppetPadchatManager', 'refresh62Data() memorySlot is empty, init & return it');
                        return [4 /*yield*/, this.WXGenerateWxDat()];
                    case 2:
                        data = _f.sent();
                        return [4 /*yield*/, this.WXGetLoginToken()];
                    case 3:
                        token = _f.sent();
                        memorySlot.currentUserId = userId;
                        memorySlot.device[userId] = {
                            data: data,
                            token: token
                        };
                        return [2 /*return*/, memorySlot];
                    case 4:
                        if (!(memorySlot.currentUserId === userId)) return [3 /*break*/, 6];
                        config_1.log.silly('PuppetPadchatManager', 'refresh62Data() userId did not change since last login, keep the data as the same');
                        // Update Token
                        _a = memorySlot.device[userId];
                        return [4 /*yield*/, this.WXGetLoginToken()];
                    case 5:
                        // Update Token
                        _a.token = _f.sent();
                        return [2 /*return*/, memorySlot];
                    case 6:
                        if (!(userId in memorySlot.device)) return [3 /*break*/, 8];
                        config_1.log.silly('PuppetPadchatManager', 'refresh62Data() current userId has existing device info, set %s as currentUserId and use old data for it', userId);
                        memorySlot.currentUserId = userId;
                        _b = memorySlot.device;
                        _c = userId;
                        _d = [{}, memorySlot.device[userId]];
                        _e = {};
                        return [4 /*yield*/, this.WXGetLoginToken()];
                    case 7:
                        _b[_c] = __assign.apply(void 0, _d.concat([(_e.token = _f.sent(), _e)]));
                        return [2 /*return*/, memorySlot];
                    case 8:
                        config_1.log.verbose('PuppetPadchatManager', 'refresh62Data() user switch detected: from "%s" to "%s"', memorySlot.currentUserId, userId);
                        return [4 /*yield*/, this.WXGenerateWxDat()];
                    case 9:
                        data = _f.sent();
                        return [4 /*yield*/, this.WXGetLoginToken()];
                    case 10:
                        token = _f.sent();
                        memorySlot.currentUserId = userId;
                        memorySlot.device[userId] = {
                            data: data,
                            token: token
                        };
                        return [2 /*return*/, memorySlot];
                }
            });
        });
    };
    PadchatManager.prototype.tryLoad62Data = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceUserId, deviceInfoDict, deviceInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "tryLoad62Data()");
                        deviceUserId = this.memorySlot.currentUserId;
                        deviceInfoDict = this.memorySlot.device;
                        if (!(deviceUserId
                            && deviceInfoDict
                            && deviceUserId in deviceInfoDict)) return [3 /*break*/, 2];
                        deviceInfo = deviceInfoDict[deviceUserId];
                        if (!deviceInfo) {
                            throw new Error('deviceInfo not found');
                        }
                        config_1.log.silly('PuppetPadchatManager', "tryLoad62Data() 62 data found: \"%s\"", deviceInfo.data);
                        return [4 /*yield*/, this.WXLoadWxDat(deviceInfo.data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        config_1.log.silly('PuppetPadchatManager', "tryLoad62Data() 62 data not found");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.getContactIdList = function () {
        config_1.log.verbose('PuppetPadchatManager', 'getContactIdList()');
        if (!this.cacheContactRawPayload) {
            throw new Error('cache not inited');
        }
        var contactIdList = this.cacheContactRawPayload.keys().slice();
        config_1.log.silly('PuppetPadchatManager', 'getContactIdList() = %d', contactIdList.length);
        return contactIdList;
    };
    PadchatManager.prototype.getRoomIdList = function () {
        config_1.log.verbose('PuppetPadchatManager', 'getRoomIdList()');
        if (!this.cacheRoomRawPayload) {
            throw new Error('cache not inited');
        }
        var roomIdList = this.cacheRoomRawPayload.keys().slice();
        config_1.log.verbose('PuppetPadchatManager', 'getRoomIdList()=%d', roomIdList.length);
        return roomIdList;
    };
    PadchatManager.prototype.roomMemberRawPayloadDirty = function (roomId) {
        config_1.log.verbose('PuppetPadchatManager', 'roomMemberRawPayloadDirty(%d)', roomId);
        if (!this.cacheRoomMemberRawPayload) {
            throw new Error('cache not inited');
        }
        this.cacheRoomMemberRawPayload["delete"](roomId);
    };
    PadchatManager.prototype.getRoomMemberIdList = function (roomId, dirty) {
        if (dirty === void 0) { dirty = false; }
        return __awaiter(this, void 0, void 0, function () {
            var memberRawPayloadDict, _a, memberIdList;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'getRoomMemberIdList(%d)', roomId);
                        if (!this.cacheRoomMemberRawPayload) {
                            throw new Error('cache not inited');
                        }
                        if (dirty) {
                            this.roomMemberRawPayloadDirty(roomId);
                        }
                        _a = this.cacheRoomMemberRawPayload.get(roomId);
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.syncRoomMember(roomId)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        memberRawPayloadDict = _a;
                        if (!memberRawPayloadDict) {
                            // or return [] ?
                            throw new Error('roomId not found: ' + roomId);
                        }
                        memberIdList = Object.keys(memberRawPayloadDict);
                        // console.log('memberRawPayloadDict:', memberRawPayloadDict)
                        config_1.log.verbose('PuppetPadchatManager', 'getRoomMemberIdList(%d) length=%d', roomId, memberIdList.length);
                        return [2 /*return*/, memberIdList];
                }
            });
        });
    };
    PadchatManager.prototype.roomRawPayloadDirty = function (roomId) {
        config_1.log.verbose('PuppetPadchatManager', 'roomRawPayloadDirty(%d)', roomId);
        if (!this.cacheRoomRawPayload) {
            throw new Error('cache not inited');
        }
        this.cacheRoomRawPayload["delete"](roomId);
    };
    PadchatManager.prototype.roomMemberRawPayload = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberRawPayloadDict, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'roomMemberRawPayload(%s)', roomId);
                        if (!this.cacheRoomMemberRawPayload) {
                            throw new Error('cache not inited');
                        }
                        _a = this.cacheRoomMemberRawPayload.get(roomId);
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.syncRoomMember(roomId)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        memberRawPayloadDict = _a;
                        if (!memberRawPayloadDict) {
                            throw new Error('roomId not found: ' + roomId);
                        }
                        return [2 /*return*/, memberRawPayloadDict];
                }
            });
        });
    };
    PadchatManager.prototype.syncRoomMember = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberListPayload, memberDict, _i, _a, memberPayload, contactId, contact, oldMemberDict, newMemberDict;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.silly('PuppetPadchatManager', 'syncRoomMember(%s)', roomId);
                        return [4 /*yield*/, this.WXGetChatRoomMember(roomId)];
                    case 1:
                        memberListPayload = _b.sent();
                        if (!memberListPayload || !('user_name' in memberListPayload)) { // check user_name too becasue the server might return {}
                            /**
                             * Room Id not exist
                             * See: https://github.com/lijiarui/wechaty-puppet-padchat/issues/64#issuecomment-397319016
                             */
                            this.roomMemberRawPayloadDirty(roomId);
                            this.roomRawPayloadDirty(roomId);
                            return [2 /*return*/, {}];
                        }
                        config_1.log.silly('PuppetPadchatManager', 'syncRoomMember(%s) total %d members', roomId, Object.keys(memberListPayload).length);
                        memberDict = {};
                        for (_i = 0, _a = memberListPayload.member; _i < _a.length; _i++) {
                            memberPayload = _a[_i];
                            contactId = memberPayload.user_name;
                            memberDict[contactId] = memberPayload;
                            contact = {
                                big_head: memberPayload.big_head,
                                city: '',
                                country: '',
                                intro: '',
                                label: '',
                                nick_name: memberPayload.nick_name,
                                provincia: '',
                                py_initial: '',
                                remark: '',
                                remark_py_initial: '',
                                remark_quan_pin: '',
                                sex: wechaty_puppet_1.ContactGender.Unknown,
                                signature: '',
                                small_head: memberPayload.small_head,
                                status: padchat_schemas_1.PadchatContactRoomStatus.Sync,
                                stranger: '',
                                ticket: '',
                                user_name: memberPayload.user_name,
                                message: '',
                                quan_pin: ''
                            };
                            if (!this.cacheContactRawPayload) {
                                throw new Error('cache not inited');
                            }
                            if (!this.cacheContactRawPayload.has(contactId)) {
                                config_1.log.silly('PadchatManager', "syncRoomMember() adding room member " + contactId + " into contact cache");
                                this.cacheContactRawPayload.set(contactId, contact);
                            }
                        }
                        if (!this.cacheRoomMemberRawPayload) {
                            throw new Error('cache not inited');
                        }
                        oldMemberDict = this.cacheRoomMemberRawPayload.get(roomId);
                        newMemberDict = __assign({}, oldMemberDict, memberDict);
                        this.cacheRoomMemberRawPayload.set(roomId, newMemberDict);
                        return [2 /*return*/, newMemberDict];
                }
            });
        });
    };
    PadchatManager.prototype.syncContactsAndRooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cont, syncContactList, _loop_1, this_1, _i, syncContactList_1, syncContact, state_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', "syncContactsAndRooms()");
                        cont = true;
                        _a.label = 1;
                    case 1:
                        if (!(cont && this.state.on() && this.userId)) return [3 /*break*/, 4];
                        config_1.log.silly('PuppetPadchatManager', "syncContactsAndRooms() while() syncing WXSyncContact ...");
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 3 * 1000); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.WXSyncContact()];
                    case 3:
                        syncContactList = _a.sent();
                        if (!Array.isArray(syncContactList) || syncContactList.length <= 0) {
                            // {"apiName":"WXSyncContact","data":"%7B%22message%22%3A%22%E4%B8%8D%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%B7%E6%B1%82%22%2C%22status%22%3A-19%7D"}
                            // data => { message: '不支持的请求', status: -19 }
                            config_1.log.warn('PuppetPadchatManager', 'syncContactsAndRooms() cannot get array result: %s', JSON.stringify(syncContactList));
                            cont = false;
                            return [2 /*return*/];
                        }
                        if (!this.cacheContactRawPayload
                            || !this.cacheRoomRawPayload) {
                            throw new Error('no cache');
                        }
                        config_1.log.silly('PuppetPadchatManager', 'syncContactsAndRooms() syncing %d out of Contact(%d) & Room(%d) ...', syncContactList.length, this.cacheContactRawPayload.size, this.cacheRoomRawPayload.size);
                        _loop_1 = function (syncContact) {
                            if (syncContact["continue"] !== padchat_schemas_1.PadchatContinue.Go) {
                                config_1.log.verbose('PuppetPadchatManager', 'syncContactsAndRooms() sync contact done! But rooms might be still syncing!');
                                cont = false;
                                this_1.contactListSynced = true;
                                return "break";
                            }
                            if (syncContact.msg_type === padchat_schemas_1.PadchatContactMsgType.Contact) {
                                if (pure_function_helpers_1.isRoomId(syncContact.user_name)) {
                                    /**
                                     * Room
                                     */
                                    config_1.log.silly('PuppetPadchatManager', 'syncContactsAndRooms() updating Room %s(%s)', syncContact.nick_name, syncContact.user_name);
                                    var roomId_1 = syncContact.user_name;
                                    var roomPayload = syncContact;
                                    this_1.cacheRoomRawPayload.set(roomId_1, roomPayload);
                                    /**
                                     * Use delay queue executor to sync room:
                                     *  add syncRoomMember task to the queue
                                     */
                                    this_1.roomNeedsToBeSync++;
                                    this_1.delayQueueExecutor.execute(function () {
                                        _this.roomNeedsToBeSync--;
                                        return _this.syncRoomMember(roomId_1);
                                    }, "syncRoomMember(" + roomId_1 + ")")["catch"](function (e) {
                                        config_1.log.error('PuppetPadchatManager', 'syncContactsAndRooms() failed to process %s: %s', roomId_1, e);
                                    });
                                    config_1.log.silly('PuppetPadchatManager', 'syncContactsAndRooms() added sync room(%s) task to delayQueueExecutor', roomId_1);
                                }
                                else if (pure_function_helpers_1.isContactId(syncContact.user_name)) {
                                    /**
                                     * Contact
                                     */
                                    config_1.log.silly('PuppetPadchatManager', 'syncContactsAndRooms() updating Contact %s(%s)', syncContact.nick_name, syncContact.user_name);
                                    var contactPayload = syncContact;
                                    var contactId = contactPayload.user_name;
                                    this_1.cacheContactRawPayload.set(contactId, contactPayload);
                                }
                                else {
                                    throw new Error('id is neither room nor contact');
                                }
                            }
                            else {
                                // {"continue":1,"msg_type":2048,"status":1,"uin":4763975}
                                if (syncContact["continue"] === padchat_schemas_1.PadchatContinue.Go
                                    && syncContact.msg_type === padchat_schemas_1.PadchatContactMsgType.N11_2048
                                    && typeof syncContact.uin !== 'undefined') {
                                    // HeartBeat??? discard it in silent
                                }
                                else {
                                    config_1.log.silly('PuppetPadchatManager', "syncContactsAndRooms() skip for syncContact.msg_type=%s(%s) %s", syncContact.msg_type && padchat_schemas_1.PadchatContactMsgType[syncContact.msg_type], syncContact.msg_type, JSON.stringify(syncContact));
                                }
                            }
                        };
                        this_1 = this;
                        for (_i = 0, syncContactList_1 = syncContactList; _i < syncContactList_1.length; _i++) {
                            syncContact = syncContactList_1[_i];
                            state_1 = _loop_1(syncContact);
                            if (state_1 === "break")
                                break;
                        }
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.contactRawPayloadDirty = function (contactId) {
        config_1.log.verbose('PuppetPadchatManager', 'contactRawPayloadDirty(%d)', contactId);
        if (!this.cacheContactRawPayload) {
            throw new Error('cache not inited');
        }
        this.cacheContactRawPayload["delete"](contactId);
    };
    PadchatManager.prototype.contactRawPayload = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.silly('PuppetPadchatManager', 'contactRawPayload(%s)', contactId);
                        return [4 /*yield*/, config_1.retry(function (retryException, attempt) { return __awaiter(_this, void 0, void 0, function () {
                                var tryRawPayload;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            config_1.log.silly('PuppetPadchatManager', 'contactRawPayload(%s) retry() attempt=%d', contactId, attempt);
                                            if (!this.cacheContactRawPayload) {
                                                throw new Error('no cache');
                                            }
                                            if (this.cacheContactRawPayload.has(contactId)) {
                                                return [2 /*return*/, this.cacheContactRawPayload.get(contactId)];
                                            }
                                            return [4 /*yield*/, this.WXGetContactPayload(contactId)
                                                // check user_name too becasue the server might return {}
                                                // See issue #1358 https://github.com/Chatie/wechaty/issues/1358
                                            ];
                                        case 1:
                                            tryRawPayload = _a.sent();
                                            // check user_name too becasue the server might return {}
                                            // See issue #1358 https://github.com/Chatie/wechaty/issues/1358
                                            if (tryRawPayload && tryRawPayload.user_name) {
                                                this.cacheContactRawPayload.set(contactId, tryRawPayload);
                                                return [2 /*return*/, tryRawPayload];
                                            }
                                            else if (tryRawPayload) {
                                                // If the payload is valid but we don't have user_name inside it,
                                                // consider this payload as invalid one and do not retry
                                                // Correct me if I am wrong here
                                                return [2 /*return*/, null];
                                            }
                                            return [2 /*return*/, retryException(new Error('tryRawPayload empty'))];
                                    }
                                });
                            }); })];
                    case 1:
                        rawPayload = _a.sent();
                        if (!rawPayload) {
                            throw new Error('no raw payload');
                        }
                        return [2 /*return*/, rawPayload];
                }
            });
        });
    };
    PadchatManager.prototype.roomRawPayload = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'roomRawPayload(%s)', id);
                        return [4 /*yield*/, config_1.retry(function (retryException, attempt) { return __awaiter(_this, void 0, void 0, function () {
                                var tryRawPayload;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            config_1.log.silly('PuppetPadchatManager', 'roomRawPayload(%s) retry() attempt=%d', id, attempt);
                                            if (!this.cacheRoomRawPayload) {
                                                throw new Error('no cache');
                                            }
                                            if (this.cacheRoomRawPayload.has(id)) {
                                                return [2 /*return*/, this.cacheRoomRawPayload.get(id)];
                                            }
                                            return [4 /*yield*/, this.WXGetRoomPayload(id)
                                                // check user_name too becasue the server might return {}
                                                // See issue #1358 https://github.com/Chatie/wechaty/issues/1358
                                            ];
                                        case 1:
                                            tryRawPayload = _a.sent();
                                            // check user_name too becasue the server might return {}
                                            // See issue #1358 https://github.com/Chatie/wechaty/issues/1358
                                            if (tryRawPayload /* && tryRawPayload.user_name */) {
                                                this.cacheRoomRawPayload.set(id, tryRawPayload);
                                                return [2 /*return*/, tryRawPayload];
                                            }
                                            return [2 /*return*/, retryException(new Error('tryRawPayload empty'))];
                                    }
                                });
                            }); })];
                    case 1:
                        rawPayload = _a.sent();
                        if (!rawPayload) {
                            throw new Error('no raw payload');
                        }
                        return [2 /*return*/, rawPayload];
                }
            });
        });
    };
    PadchatManager.prototype.roomInvitationRawPayload = function (roomInvitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'roomInvitationRawPayload(%s)', roomInvitationId);
                        if (!this.cacheRoomInvitationRawPayload) {
                            throw new Error('no cache');
                        }
                        return [4 /*yield*/, this.cacheRoomInvitationRawPayload.get(roomInvitationId)];
                    case 1:
                        payload = _a.sent();
                        if (payload) {
                            return [2 /*return*/, payload];
                        }
                        else {
                            throw new Error("can not get invitation with invitation id: " + roomInvitationId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.roomInvitationRawPayloadDirty = function (roomInvitationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchatManager', 'roomInvitationRawPayloadDirty(%s)', roomInvitationId);
                        if (!this.cacheRoomInvitationRawPayload) {
                            throw new Error('no cache');
                        }
                        return [4 /*yield*/, this.cacheRoomInvitationRawPayload["delete"](roomInvitationId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.saveRoomInvitationRawPayload = function (roomInvitation) {
        return __awaiter(this, void 0, void 0, function () {
            var msgId, roomName, url, fromUser, timestamp;
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchatManager', 'saveRoomInvitationRawPayload(%s)', JSON.stringify(roomInvitation));
                msgId = roomInvitation.msgId, roomName = roomInvitation.roomName, url = roomInvitation.url, fromUser = roomInvitation.fromUser, timestamp = roomInvitation.timestamp;
                if (!this.cacheRoomInvitationRawPayload) {
                    throw new Error('no cache');
                }
                this.cacheRoomInvitationRawPayload.set(msgId, {
                    fromUser: fromUser,
                    id: msgId,
                    roomName: roomName,
                    timestamp: timestamp,
                    url: url
                });
                return [2 /*return*/];
            });
        });
    };
    PadchatManager.prototype.ding = function (data) {
        config_1.log.verbose('PuppetPadchatManager', 'ding(%s)', data || '');
        // TODO: healthy check
        this.emit('dong');
        return;
    };
    PadchatManager.prototype.updateSelfName = function (newName) {
        return __awaiter(this, void 0, void 0, function () {
            var self, signature, sex, country, provincia, city;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.userId) {
                            throw Error('Can not update user self name since no user id exist. Probably user not logged in yet');
                        }
                        return [4 /*yield*/, this.contactRawPayload(this.userId)];
                    case 1:
                        self = _a.sent();
                        signature = self.signature, sex = self.sex, country = self.country, provincia = self.provincia, city = self.city;
                        return [4 /*yield*/, this.WXSetUserInfo(newName, signature, sex.toString(), country, provincia, city)];
                    case 2:
                        _a.sent();
                        this.contactRawPayloadDirty(this.userId);
                        return [2 /*return*/];
                }
            });
        });
    };
    PadchatManager.prototype.updateSelfSignature = function (signature) {
        return __awaiter(this, void 0, void 0, function () {
            var self, nick_name, sex, country, provincia, city;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.userId) {
                            throw Error('Can not update user self signature since no user id exist. Probably user not logged in yet');
                        }
                        return [4 /*yield*/, this.contactRawPayload(this.userId)];
                    case 1:
                        self = _a.sent();
                        nick_name = self.nick_name, sex = self.sex, country = self.country, provincia = self.provincia, city = self.city;
                        return [4 /*yield*/, this.WXSetUserInfo(nick_name, signature, sex.toString(), country, provincia, city)];
                    case 2:
                        _a.sent();
                        this.contactRawPayloadDirty(this.userId);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PadchatManager;
}(padchat_rpc_1.PadchatRpc));
exports.PadchatManager = PadchatManager;
exports["default"] = PadchatManager;
