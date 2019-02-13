"use strict";
/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
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
var path_1 = require("path");
var array_flatten_1 = require("array-flatten");
var lru_cache_1 = require("lru-cache");
var file_box_1 = require("file-box");
var wechaty_puppet_1 = require("wechaty-puppet");
var pure_function_helpers_1 = require("./pure-function-helpers");
var config_1 = require("./config");
var padchat_manager_1 = require("./padchat-manager");
var padchat_schemas_1 = require("./padchat-schemas");
var padchat_rpc_type_1 = require("./padchat-rpc.type");
var app_message_generator_1 = require("./pure-function-helpers/app-message-generator");
var message_emoji_payload_parser_1 = require("./pure-function-helpers/message-emoji-payload-parser");
var PADCHAT_COUNTER = 0; // PuppetPadchat Instance Counter
var PuppetPadchat = /** @class */ (function (_super) {
    __extends(PuppetPadchat, _super);
    function PuppetPadchat(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, __assign({ timeout: 60 * 4 }, options)) || this;
        _this.options = options;
        var lruOptions = {
            max: 1000,
            // length: function (n) { return n * 2},
            dispose: function (key, val) {
                config_1.log.silly('PuppetPadchat', 'constructor() lruOptions.dispose(%s, %s)', key, JSON.stringify(val));
            },
            maxAge: 1000 * 60 * 60
        };
        _this.cachePadchatMessagePayload = new lru_cache_1["default"](lruOptions);
        _this.padchatCounter = PADCHAT_COUNTER++;
        if (_this.padchatCounter > 0) {
            if (!_this.options.token) {
                throw new Error([
                    'You need to specify `token` when constructor PuppetPadchat becasue you have more than one instance. ',
                    'see: https://github.com/Chatie/wechaty/issues/1367',
                ].join(''));
            }
        }
        return _this;
    }
    PuppetPadchat.prototype.toString = function () {
        var text = _super.prototype.toString.call(this);
        return text + ("/PuppetPadchat#" + this.padchatCounter);
    };
    PuppetPadchat.prototype.ding = function (data) {
        config_1.log.verbose('PuppetPadchat', 'ding(%s)', data || '');
        // TODO: do some internal health check inside this.padchatManager
        if (!this.padchatManager) {
            this.emit('error', new Error('no padchat Manager'));
            return;
        }
        this.padchatManager.ding(data);
        return;
    };
    PuppetPadchat.prototype.startWatchdog = function () {
        var _this = this;
        config_1.log.verbose('PuppetPadchat', 'startWatchdog()');
        if (!this.padchatManager) {
            throw new Error('no padchat manager');
        }
        // clean the dog because this could be re-inited
        // this.watchdog.removeAllListeners()
        /**
         * Use manager's heartbeat to feed dog
         */
        this.padchatManager.on('heartbeat', function (data) {
            config_1.log.silly('PuppetPadchat', 'startWatchdog() padchatManager.on(heartbeat)');
            _this.emit('watchdog', {
                data: data
            });
        });
        this.emit('watchdog', {
            data: 'inited',
            type: 'startWatchdog()'
        });
    };
    PuppetPadchat.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var manager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', "start() with " + this.memory.name);
                        if (!this.state.on()) return [3 /*break*/, 2];
                        config_1.log.warn('PuppetPadchat', 'start() already on(pending)?');
                        return [4 /*yield*/, this.state.ready('on')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        /**
                         * state has two main state: ON / OFF
                         * ON (pending)
                         * OFF (pending)
                         */
                        this.state.on('pending');
                        manager = this.padchatManager = new padchat_manager_1.PadchatManager({
                            endpoint: this.options.endpoint || config_1.WECHATY_PUPPET_PADCHAT_ENDPOINT,
                            memory: this.memory,
                            token: this.options.token || config_1.padchatToken()
                        });
                        return [4 /*yield*/, this.startManager(manager)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.startWatchdog()];
                    case 4:
                        _a.sent();
                        this.state.on(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.login = function (selfId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, _super.prototype.login.call(this, selfId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.padchatManager.syncContactsAndRooms()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.startManager = function (manager) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'startManager()');
                        if (this.state.off()) {
                            throw new Error('startManager() state is off');
                        }
                        manager.removeAllListeners();
                        manager.on('error', function (e) { return _this.emit('error', e); });
                        manager.on('scan', function (qrcode, status, data) { return _this.emit('scan', qrcode, status, data); });
                        manager.on('login', function (userId) { return _this.login(userId); });
                        manager.on('message', function (rawPayload) { return _this.onPadchatMessage(rawPayload); });
                        manager.on('logout', function () { return _this.logout(true); });
                        manager.on('dong', function (data) { return _this.emit('dong', data); });
                        manager.on('ready', function () { return _this.emit('ready'); });
                        manager.on('reset', function (reason) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        config_1.log.warn('PuppetPadchat', 'startManager() manager.on(reset) for %s. Restarting PuppetPadchat ... ', reason);
                                        // Puppet Base class will deal with this RESET event for you.
                                        return [4 /*yield*/, this.emit('reset', reason)];
                                    case 1:
                                        // Puppet Base class will deal with this RESET event for you.
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        manager.on('reconnect', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        config_1.log.verbose('PuppetPadchat', 'startManager() manager.on(reconnect) for %s', msg);
                                        // Slightly delay the reconnect after disconnected from the server
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2000); })];
                                    case 1:
                                        // Slightly delay the reconnect after disconnected from the server
                                        _a.sent();
                                        return [4 /*yield*/, manager.reconnect()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, manager.start()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.onPadchatMessage = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessage({id=%s, type=%s(%s)})', rawPayload.msg_id, padchat_schemas_1.PadchatMessageType[rawPayload.sub_type], rawPayload.msg_type);
                        /**
                         * 0. Discard messages when not logged in
                         */
                        if (!this.id) {
                            config_1.log.warn('PuppetPadchat', 'onPadchatMessage(%s) discarded message because puppet is not logged-in', JSON.stringify(rawPayload));
                            return [2 /*return*/];
                        }
                        /**
                         * 1. Sometimes will get duplicated same messages from rpc, drop the same message from here.
                         */
                        if (this.cachePadchatMessagePayload.has(rawPayload.msg_id)) {
                            config_1.log.silly('PuppetPadchat', 'onPadchatMessage(id=%s) duplicate message: %s', rawPayload.msg_id, JSON.stringify(rawPayload).substr(0, 500));
                            return [2 /*return*/];
                        }
                        /**
                         * 2. Save message for future usage
                         */
                        this.cachePadchatMessagePayload.set(rawPayload.msg_id, rawPayload);
                        _a = rawPayload.sub_type;
                        switch (_a) {
                            case padchat_schemas_1.PadchatMessageType.VerifyMsg: return [3 /*break*/, 1];
                            case padchat_schemas_1.PadchatMessageType.Recalled: return [3 /*break*/, 2];
                            case padchat_schemas_1.PadchatMessageType.Sys: return [3 /*break*/, 4];
                            case padchat_schemas_1.PadchatMessageType.App: return [3 /*break*/, 6];
                            case padchat_schemas_1.PadchatMessageType.Emoticon: return [3 /*break*/, 8];
                            case padchat_schemas_1.PadchatMessageType.Image: return [3 /*break*/, 8];
                            case padchat_schemas_1.PadchatMessageType.MicroVideo: return [3 /*break*/, 8];
                            case padchat_schemas_1.PadchatMessageType.Video: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        this.emit('friendship', rawPayload.msg_id);
                        return [3 /*break*/, 9];
                    case 2: 
                    /**
                     * When someone joined the room invited by Bot,
                     * the bot will receive a `recall-able` message for room event
                     *
                     * { content: '12740017638@chatroom:\n<sysmsg type="delchatroommember">\n\t<delchatroommember>\n\t\t<plain>
                     *            <![CDATA[You invited 卓桓、Zhuohuan, 太阁_传话助手, 桔小秘 to the group chat.   ]]></plain>...,
                     *  sub_type: 10002}
                     */
                    return [4 /*yield*/, Promise.all([
                            this.onPadchatMessageRoomEventJoin(rawPayload),
                        ])];
                    case 3:
                        /**
                         * When someone joined the room invited by Bot,
                         * the bot will receive a `recall-able` message for room event
                         *
                         * { content: '12740017638@chatroom:\n<sysmsg type="delchatroommember">\n\t<delchatroommember>\n\t\t<plain>
                         *            <![CDATA[You invited 卓桓、Zhuohuan, 太阁_传话助手, 桔小秘 to the group chat.   ]]></plain>...,
                         *  sub_type: 10002}
                         */
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 4: return [4 /*yield*/, Promise.all([
                            this.onPadchatMessageFriendshipEvent(rawPayload),
                            ////////////////////////////////////////////////
                            this.onPadchatMessageRoomEventJoin(rawPayload),
                            this.onPadchatMessageRoomEventLeave(rawPayload),
                            this.onPadchatMessageRoomEventTopic(rawPayload),
                        ])];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, Promise.all([
                            this.onPadchatMessageRoomInvitation(rawPayload),
                        ])];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        this.emit('message', rawPayload.msg_id);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.onPadchatMessageRoomInvitation = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var roomInviteEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessageRoomInvitation(%s)', rawPayload);
                        return [4 /*yield*/, pure_function_helpers_1.roomInviteEventMessageParser(rawPayload)];
                    case 1:
                        roomInviteEvent = _a.sent();
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        if (!roomInviteEvent) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.padchatManager.saveRoomInvitationRawPayload(roomInviteEvent)];
                    case 2:
                        _a.sent();
                        this.emit('room-invite', roomInviteEvent.msgId);
                        return [3 /*break*/, 4];
                    case 3:
                        this.emit('message', rawPayload.msg_id);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Look for room join event
     */
    PuppetPadchat.prototype.onPadchatMessageRoomEventJoin = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var roomJoinEvent, inviteeNameList_1, inviterName, roomId_1, inviteeIdList, inviterIdList, inviterId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessageRoomEventJoin({id=%s})', rawPayload.msg_id);
                        return [4 /*yield*/, pure_function_helpers_1.roomJoinEventMessageParser(rawPayload)];
                    case 1:
                        roomJoinEvent = _a.sent();
                        if (!roomJoinEvent) return [3 /*break*/, 6];
                        inviteeNameList_1 = roomJoinEvent.inviteeNameList;
                        inviterName = roomJoinEvent.inviterName;
                        roomId_1 = roomJoinEvent.roomId;
                        config_1.log.silly('PuppetPadchat', 'onPadchatMessageRoomEventJoin() roomJoinEvent="%s"', JSON.stringify(roomJoinEvent));
                        return [4 /*yield*/, config_1.retry(function (retryException, attempt) { return __awaiter(_this, void 0, void 0, function () {
                                var tryIdList, _a;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            config_1.log.verbose('PuppetPadchat', 'onPadchatMessageRoomEvent({id=%s}) roomJoin retry(attempt=%d)', attempt);
                                            _a = array_flatten_1["default"];
                                            return [4 /*yield*/, Promise.all(inviteeNameList_1.map(function (inviteeName) { return _this.roomMemberSearch(roomId_1, inviteeName); }))];
                                        case 1:
                                            tryIdList = _a.apply(void 0, [_b.sent()]);
                                            if (tryIdList.length) {
                                                return [2 /*return*/, tryIdList];
                                            }
                                            if (!this.padchatManager) {
                                                throw new Error('no manager');
                                            }
                                            /**
                                             * Set Cache Dirty
                                             */
                                            return [4 /*yield*/, this.roomMemberPayloadDirty(roomId_1)];
                                        case 2:
                                            /**
                                             * Set Cache Dirty
                                             */
                                            _b.sent();
                                            return [2 /*return*/, retryException(new Error('roomMemberSearch() not found'))];
                                    }
                                });
                            }); })["catch"](function (e) {
                                config_1.log.warn('PuppetPadchat', 'onPadchatMessageRoomEvent({id=%s}) roomJoin retry() fail: %s', e.message);
                                return [];
                            })];
                    case 2:
                        inviteeIdList = _a.sent();
                        return [4 /*yield*/, this.roomMemberSearch(roomId_1, inviterName)];
                    case 3:
                        inviterIdList = _a.sent();
                        if (inviterIdList.length < 1) {
                            throw new Error('no inviterId found');
                        }
                        else if (inviterIdList.length > 1) {
                            config_1.log.warn('PuppetPadchat', 'onPadchatMessageRoomEvent() case PadchatMesssageSys: inviterId found more than 1, use the first one.');
                        }
                        inviterId = inviterIdList[0];
                        /**
                         * Set Cache Dirty
                         */
                        return [4 /*yield*/, this.roomMemberPayloadDirty(roomId_1)];
                    case 4:
                        /**
                         * Set Cache Dirty
                         */
                        _a.sent();
                        return [4 /*yield*/, this.roomPayloadDirty(roomId_1)];
                    case 5:
                        _a.sent();
                        this.emit('room-join', roomId_1, inviteeIdList, inviterId);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Look for room leave event
     */
    PuppetPadchat.prototype.onPadchatMessageRoomEventLeave = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var roomLeaveEvent, leaverNameList, removerName, roomId_2, leaverIdList, _a, removerIdList, removerId;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessageRoomEventLeave({id=%s})', rawPayload.msg_id);
                        roomLeaveEvent = pure_function_helpers_1.roomLeaveEventMessageParser(rawPayload);
                        if (!roomLeaveEvent) return [3 /*break*/, 5];
                        leaverNameList = roomLeaveEvent.leaverNameList;
                        removerName = roomLeaveEvent.removerName;
                        roomId_2 = roomLeaveEvent.roomId;
                        config_1.log.silly('PuppetPadchat', 'onPadchatMessageRoomEventLeave() roomLeaveEvent="%s"', JSON.stringify(roomLeaveEvent));
                        _a = array_flatten_1["default"];
                        return [4 /*yield*/, Promise.all(leaverNameList.map(function (leaverName) { return _this.roomMemberSearch(roomId_2, leaverName); }))];
                    case 1:
                        leaverIdList = _a.apply(void 0, [_b.sent()]);
                        return [4 /*yield*/, this.roomMemberSearch(roomId_2, removerName)];
                    case 2:
                        removerIdList = _b.sent();
                        if (removerIdList.length < 1) {
                            throw new Error('no removerId found');
                        }
                        else if (removerIdList.length > 1) {
                            config_1.log.warn('PuppetPadchat', 'onPadchatMessage() case PadchatMesssageSys: removerId found more than 1, use the first one.');
                        }
                        removerId = removerIdList[0];
                        if (!this.padchatManager) {
                            throw new Error('no padchatManager');
                        }
                        /**
                         * Set Cache Dirty
                         */
                        return [4 /*yield*/, this.roomMemberPayloadDirty(roomId_2)];
                    case 3:
                        /**
                         * Set Cache Dirty
                         */
                        _b.sent();
                        return [4 /*yield*/, this.roomPayloadDirty(roomId_2)];
                    case 4:
                        _b.sent();
                        this.emit('room-leave', roomId_2, leaverIdList, removerId);
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Look for room topic event
     */
    PuppetPadchat.prototype.onPadchatMessageRoomEventTopic = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var roomTopicEvent, changerName, newTopic, roomId, roomOldPayload, oldTopic, changerIdList, changerId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessageRoomEventTopic({id=%s})', rawPayload.msg_id);
                        roomTopicEvent = pure_function_helpers_1.roomTopicEventMessageParser(rawPayload);
                        if (!roomTopicEvent) return [3 /*break*/, 4];
                        changerName = roomTopicEvent.changerName;
                        newTopic = roomTopicEvent.topic;
                        roomId = roomTopicEvent.roomId;
                        config_1.log.silly('PuppetPadchat', 'onPadchatMessageRoomEventTopic() roomTopicEvent="%s"', JSON.stringify(roomTopicEvent));
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 1:
                        roomOldPayload = _a.sent();
                        oldTopic = roomOldPayload.topic;
                        return [4 /*yield*/, this.roomMemberSearch(roomId, changerName)];
                    case 2:
                        changerIdList = _a.sent();
                        if (changerIdList.length < 1) {
                            throw new Error('no changerId found');
                        }
                        else if (changerIdList.length > 1) {
                            config_1.log.warn('PuppetPadchat', 'onPadchatMessage() case PadchatMesssageSys: changerId found more than 1, use the first one.');
                        }
                        changerId = changerIdList[0];
                        if (!this.padchatManager) {
                            throw new Error('no padchatManager');
                        }
                        /**
                         * Set Cache Dirty
                         */
                        return [4 /*yield*/, this.roomPayloadDirty(roomId)];
                    case 3:
                        /**
                         * Set Cache Dirty
                         */
                        _a.sent();
                        this.emit('room-topic', roomId, newTopic, oldTopic, changerId);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.onPadchatMessageFriendshipEvent = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var friendshipConfirmContactId, friendshipReceiveContactId, friendshipVerifyContactId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'onPadchatMessageFriendshipEvent({id=%s})', rawPayload.msg_id);
                        friendshipConfirmContactId = pure_function_helpers_1.friendshipConfirmEventMessageParser(rawPayload);
                        return [4 /*yield*/, pure_function_helpers_1.friendshipReceiveEventMessageParser(rawPayload)
                            /**
                             * 3. Look for friendship verify event
                             */
                        ];
                    case 1:
                        friendshipReceiveContactId = _a.sent();
                        friendshipVerifyContactId = pure_function_helpers_1.friendshipVerifyEventMessageParser(rawPayload);
                        if (friendshipConfirmContactId
                            || friendshipReceiveContactId
                            || friendshipVerifyContactId) {
                            // Maybe load contact here since we know a new friend is added
                            this.emit('friendship', rawPayload.msg_id);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'stop()');
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        if (!this.state.off()) return [3 /*break*/, 2];
                        config_1.log.warn('PuppetPadchat', 'stop() is called on a OFF puppet. await ready(off) and return.');
                        return [4 /*yield*/, this.state.ready('off')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.state.off('pending');
                        // this.watchdog.sleep()
                        return [4 /*yield*/, this.logout(true)];
                    case 3:
                        // this.watchdog.sleep()
                        _a.sent();
                        return [4 /*yield*/, this.padchatManager.stop()];
                    case 4:
                        _a.sent();
                        this.padchatManager.removeAllListeners();
                        this.padchatManager = undefined;
                        this.state.off(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.logout = function (shallow) {
        if (shallow === void 0) { shallow = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'logout()');
                        if (!this.id) {
                            config_1.log.warn('PuppetPadchat', 'logout() this.id not exist');
                            return [2 /*return*/];
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        this.emit('logout', this.id); // becore we will throw above by logonoff() when this.user===undefined
                        this.id = undefined;
                        if (!!shallow) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.padchatManager.WXLogout()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.padchatManager.logout()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactAlias = function (contactId, alias) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'contactAlias(%s, %s)', contactId, alias);
                        if (!(typeof alias === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contactPayload(contactId)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload.alias || ''];
                    case 2:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXSetUserRemark(contactId, alias || '')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactValidate = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'contactValid(%s)', contactId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.padchatManager.contactRawPayload(contactId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contactIdList;
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchat', 'contactList()');
                if (!this.padchatManager) {
                    throw new Error('no padchat manager');
                }
                contactIdList = this.padchatManager.getContactIdList();
                return [2 /*return*/, contactIdList];
            });
        });
    };
    PuppetPadchat.prototype.contactAvatar = function (contactId, file) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, payload, fileBox;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'contactAvatar(%s%s)', contactId, file ? (', ' + file.name) : '');
                        if (!file) return [3 /*break*/, 3];
                        if (contactId !== this.selfId()) {
                            throw new Error('can not set avatar for others');
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        _b = (_a = this.padchatManager).WXSetHeadImage;
                        return [4 /*yield*/, file.toBase64()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, this.contactPayload(contactId)];
                    case 4:
                        payload = _c.sent();
                        if (!payload.avatar) {
                            throw new Error('no avatar');
                        }
                        fileBox = file_box_1.FileBox.fromUrl(payload.avatar, "wechaty-contact-avatar-" + payload.name + ".jpg");
                        return [2 /*return*/, fileBox];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactSelfQrcode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contactId, contactPayload, contactName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'contactSelfQrcode()');
                        contactId = this.selfId();
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.contactPayload(contactId)];
                    case 1:
                        contactPayload = _a.sent();
                        contactName = contactPayload.alias || contactPayload.name || contactPayload.id;
                        return [2 /*return*/, this.getQRCode(this.padchatManager, contactName, contactId)];
                }
            });
        });
    };
    PuppetPadchat.prototype.getQRCode = function (manager, contactName, contactId, counter) {
        return __awaiter(this, void 0, void 0, function () {
            var base64, fileBox, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, manager.WXGetUserQRCode(contactId, 3)];
                    case 1:
                        base64 = _a.sent();
                        fileBox = file_box_1.FileBox.fromBase64(base64, contactName + ".jpg");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, pure_function_helpers_1.fileBoxToQrcode(fileBox)];
                    case 3: 
                    // There are some styles of qrcode can not be parsed by the library we are using,
                    // So added a retry mechanism here to guarantee the qrcode
                    // But still sometimes, the qrcode would be not available
                    // So in the error message, let the user to do a retry
                    return [2 /*return*/, _a.sent()];
                    case 4:
                        e_2 = _a.sent();
                        if (!counter) {
                            counter = 1;
                        }
                        if (counter > config_1.SELF_QRCODE_MAX_RETRY) {
                            config_1.log.verbose('PuppetPadchat', 'contactQrcode(%s) get qrcode , this should happen very rare', contactId);
                            throw Error('Unable to get qrcode for self, Please try , this issue usually won\'t happen frequently, retry should fix it. If not, please open an issue on https://github.com/lijiarui/wechaty-puppet-padchat');
                        }
                        return [2 /*return*/, this.getQRCode(manager, contactName, contactId, ++counter)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactPayloadDirty = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'contactPayloadDirty(%s)', contactId);
                        if (this.padchatManager) {
                            this.padchatManager.contactRawPayloadDirty(contactId);
                        }
                        return [4 /*yield*/, _super.prototype.contactPayloadDirty.call(this, contactId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactRawPayload = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.silly('PuppetPadchat', 'contactRawPayload(%s)', contactId);
                        if (!this.id) {
                            throw Error('bot not login!');
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.contactRawPayload(contactId)];
                    case 1:
                        rawPayload = _a.sent();
                        if (!rawPayload.user_name && contactId === this.id) {
                            return [2 /*return*/, pure_function_helpers_1.generateFakeSelfBot(contactId)];
                        }
                        return [2 /*return*/, rawPayload];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                config_1.log.silly('PuppetPadchat', 'contactRawPayloadParser({user_name="%s"})', rawPayload.user_name);
                payload = pure_function_helpers_1.contactRawPayloadParser(rawPayload);
                if (rawPayload.stranger && pure_function_helpers_1.isStrangerV1(rawPayload.stranger)) {
                    payload.friend = true;
                }
                else {
                    payload.friend = false;
                }
                // if (!this.padchatManager) {
                //   throw new Error('no padchat manager')
                // }
                // const searchResult = await this.padchatManager.WXSearchContact(rawPayload.user_name)
                // let friend: undefined | boolean = undefined
                // if (searchResult) {
                //   if (searchResult.status === -24 && !searchResult.user_name) {
                //     friend = false
                //   } else if (  isStrangerV1(searchResult.user_name)
                //             || isStrangerV2(searchResult.user_name)
                //   ) {
                //     friend = false
                //   }
                // }
                // return {
                //   ...payload,
                //   friend,
                // }
                return [2 /*return*/, payload];
            });
        });
    };
    /**
     * Overwrite the Puppet.contactPayload()
     */
    PuppetPadchat.prototype.contactPayload = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, e_3, rawPayload, roomList, roomId, roomMemberPayload, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, _super.prototype.contactPayload.call(this, contactId)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload];
                    case 2:
                        e_3 = _a.sent();
                        config_1.log.silly('PuppetPadchat', 'contactPayload(%s) exception: %s', contactId, e_3.message);
                        config_1.log.silly('PuppetPadchat', 'contactPayload(%s) get failed for %s, try load from room member data source', contactId);
                        return [3 /*break*/, 3];
                    case 3: return [4 /*yield*/, this.contactRawPayload(contactId)
                        /**
                         * Issue #1397
                         *  https://github.com/Chatie/wechaty/issues/1397#issuecomment-400962638
                         *
                         * Try to use the contact information from the room
                         * when it is not available directly
                         */
                    ];
                    case 4:
                        rawPayload = _a.sent();
                        if (!(!rawPayload || Object.keys(rawPayload).length <= 0)) return [3 /*break*/, 8];
                        config_1.log.silly('PuppetPadchat', 'contactPayload(%s) rawPayload not exist', contactId);
                        return [4 /*yield*/, this.contactRoomList(contactId)];
                    case 5:
                        roomList = _a.sent();
                        config_1.log.silly('PuppetPadchat', 'contactPayload(%s) found %d rooms', contactId, roomList.length);
                        if (!(roomList.length > 0)) return [3 /*break*/, 7];
                        roomId = roomList[0];
                        return [4 /*yield*/, this.roomMemberPayload(roomId, contactId)];
                    case 6:
                        roomMemberPayload = _a.sent();
                        if (roomMemberPayload) {
                            payload = {
                                avatar: roomMemberPayload.avatar,
                                gender: wechaty_puppet_1.ContactGender.Unknown,
                                id: roomMemberPayload.id,
                                name: roomMemberPayload.name,
                                type: wechaty_puppet_1.ContactType.Personal
                            };
                            this.cacheContactPayload.set(contactId, payload);
                            config_1.log.silly('PuppetPadchat', 'contactPayload(%s) cache SET', contactId);
                            return [2 /*return*/, payload];
                        }
                        _a.label = 7;
                    case 7: throw new Error('no raw payload');
                    case 8: return [2 /*return*/, this.contactRawPayloadParser(rawPayload)];
                }
            });
        });
    };
    /**
     *
     * Message
     *
     */
    PuppetPadchat.prototype.messageFile = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload, payload, rawText, attachmentName, result, _a, emojiPayload, base64, filename, file;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config_1.log.warn('PuppetPadchat', 'messageFile(%s)', messageId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.messageRawPayload(messageId)];
                    case 1:
                        rawPayload = _b.sent();
                        return [4 /*yield*/, this.messagePayload(messageId)];
                    case 2:
                        payload = _b.sent();
                        rawText = JSON.stringify(rawPayload);
                        attachmentName = payload.filename || payload.id;
                        _a = payload.type;
                        switch (_a) {
                            case wechaty_puppet_1.MessageType.Audio: return [3 /*break*/, 3];
                            case wechaty_puppet_1.MessageType.Emoticon: return [3 /*break*/, 4];
                            case wechaty_puppet_1.MessageType.Image: return [3 /*break*/, 6];
                            case wechaty_puppet_1.MessageType.Video: return [3 /*break*/, 8];
                            case wechaty_puppet_1.MessageType.Attachment: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 10];
                    case 3: return [2 /*return*/, this.getVoiceFileBoxFromRawPayload(rawPayload, attachmentName)];
                    case 4: return [4 /*yield*/, message_emoji_payload_parser_1.emojiPayloadParser(rawPayload)];
                    case 5:
                        emojiPayload = _b.sent();
                        if (emojiPayload) {
                            return [2 /*return*/, file_box_1.FileBox.fromUrl(emojiPayload.cdnurl, attachmentName + ".gif")];
                        }
                        else {
                            throw new Error('Can not get emoji file from the message');
                        }
                        _b.label = 6;
                    case 6: return [4 /*yield*/, this.padchatManager.WXGetMsgImage(rawText)];
                    case 7:
                        result = _b.sent();
                        return [2 /*return*/, file_box_1.FileBox.fromBase64(result.image, attachmentName + ".jpg")];
                    case 8: return [4 /*yield*/, this.padchatManager.WXGetMsgVideo(rawText)];
                    case 9:
                        result = _b.sent();
                        return [2 /*return*/, file_box_1.FileBox.fromBase64(result.video, attachmentName + ".mp4")];
                    case 10:
                        config_1.log.warn('PuppetPadchat', 'messageFile(%s) unsupport type: %s(%s) because it is not fully implemented yet, PR is welcome.', messageId, padchat_schemas_1.PadchatMessageType[rawPayload.sub_type], rawPayload.sub_type);
                        base64 = 'Tm90IFN1cHBvcnRlZCBBdHRhY2htZW50IEZpbGUgVHlwZSBpbiBNZXNzYWdlLgpTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9DaGF0aWUvd2VjaGF0eS9pc3N1ZXMvMTI0OQo=';
                        filename = 'wechaty-puppet-padchat-message-attachment-' + messageId + '.txt';
                        file = file_box_1.FileBox.fromBase64(base64, filename);
                        return [2 /*return*/, file];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageUrl = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload, payload, appPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageRawPayload(messageId)];
                    case 1:
                        rawPayload = _a.sent();
                        return [4 /*yield*/, this.messagePayload(messageId)];
                    case 2:
                        payload = _a.sent();
                        if (!(payload.type !== wechaty_puppet_1.MessageType.Url)) return [3 /*break*/, 3];
                        throw new Error('Can not get url from non url payload');
                    case 3: return [4 /*yield*/, pure_function_helpers_1.appMessageParser(rawPayload)];
                    case 4:
                        appPayload = _a.sent();
                        if (appPayload) {
                            return [2 /*return*/, {
                                    description: appPayload.des,
                                    thumbnailUrl: appPayload.thumburl,
                                    title: appPayload.title,
                                    url: appPayload.url
                                }];
                        }
                        else {
                            throw new Error('Can not parse url message payload');
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.getVoiceFileBoxFromRawPayload = function (rawPayload, attachmentName) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result, match, voiceLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getVoiceDataFromRawPayload(rawPayload)];
                    case 1:
                        data = _a.sent();
                        result = file_box_1.FileBox.fromBase64(data, attachmentName);
                        try {
                            match = rawPayload.content.match(/voicelength="(\d+)"/) || [];
                            voiceLength = parseInt(match[1], 10) || 0;
                            result.name = rawPayload.msg_id + "." + voiceLength + ".slk";
                        }
                        catch (e) {
                            config_1.log.error('PuppetPadchat', 'Can not get voice length from content, will have empty voice length');
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PuppetPadchat.prototype.getVoiceDataFromRawPayload = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        if (!!rawPayload.data) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.padchatManager.WXGetMsgVoice(JSON.stringify(rawPayload))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.voice];
                    case 2: return [2 /*return*/, rawPayload.data];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageRawPayload = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            return __generator(this, function (_a) {
                rawPayload = this.cachePadchatMessagePayload.get(id);
                if (!rawPayload) {
                    throw new Error('no rawPayload');
                }
                return [2 /*return*/, rawPayload];
            });
        });
    };
    PuppetPadchat.prototype.messageRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadChat', 'messageRawPayloadParser({msg_id="%s"})', rawPayload.msg_id);
                        return [4 /*yield*/, pure_function_helpers_1.messageRawPayloadParser(rawPayload)];
                    case 1:
                        payload = _a.sent();
                        config_1.log.silly('PuppetPadchat', 'messagePayload(%s)', JSON.stringify(payload));
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageSendText = function (receiver, text, mentionIdList) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'messageSend(%s, %s, %s)', JSON.stringify(receiver), text, mentionIdList && mentionIdList.join(','));
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw Error('no id');
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXSendMsg(id, text, mentionIdList && mentionIdList)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageSendFile = function (receiver, file) {
        return __awaiter(this, void 0, void 0, function () {
            var id, type, _a, voiceLength, _b, _c, _d, e_4, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'messageSend("%s", %s)', JSON.stringify(receiver), file);
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw new Error('no id!');
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        type = file.mimeType || path_1["default"].extname(file.name);
                        _a = type;
                        switch (_a) {
                            case '.slk': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        _h.trys.push([1, 4, , 5]);
                        voiceLength = parseInt(file.name.split('.')[1], 10);
                        _c = (_b = this.padchatManager).WXSendVoice;
                        _d = [id];
                        return [4 /*yield*/, file.toBase64()];
                    case 2: return [4 /*yield*/, _c.apply(_b, _d.concat([_h.sent(),
                            voiceLength]))];
                    case 3:
                        _h.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _h.sent();
                        throw Error('Can not send voice file, voice length not found from file name, please use voice file generated by wechaty, and don\' modify the file object');
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        _f = (_e = this.padchatManager).WXSendImage;
                        _g = [id];
                        return [4 /*yield*/, file.toBase64()];
                    case 7: return [4 /*yield*/, _f.apply(_e, _g.concat([_h.sent()]))];
                    case 8:
                        _h.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageSendContact = function (receiver, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var id, payload, title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'messageSendContact("%s", %s)', JSON.stringify(receiver), contactId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw Error('no id');
                        }
                        return [4 /*yield*/, this.contactPayload(contactId)];
                    case 1:
                        payload = _a.sent();
                        title = payload.name + '名片';
                        return [4 /*yield*/, this.padchatManager.WXShareCard(id, contactId, title)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageSendUrl = function (receiver, urlLinkPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'messageSendLink("%s", %s)', JSON.stringify(receiver), JSON.stringify(urlLinkPayload));
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw new Error('There is no receiver id when trying to send url link.');
                        }
                        return [4 /*yield*/, this.padchatManager.WXSendAppMsg(id, app_message_generator_1.generateAppXMLMessage(urlLinkPayload))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.forwardAttachment = function (receiver, messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload, payload, id, appPayload, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.messageRawPayload(messageId)];
                    case 1:
                        rawPayload = _a.sent();
                        return [4 /*yield*/, this.messagePayload(messageId)
                            // Send to the Room if there's a roomId
                        ];
                    case 2:
                        payload = _a.sent();
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw new Error('There is no receiver id when trying to forward attachment.');
                        }
                        return [4 /*yield*/, pure_function_helpers_1.appMessageParser(rawPayload)];
                    case 3:
                        appPayload = _a.sent();
                        if (appPayload === null) {
                            throw new Error('Can not forward attachment, failed to parse xml message.');
                        }
                        content = app_message_generator_1.generateAttachmentXMLMessageFromRaw(appPayload);
                        return [4 /*yield*/, this.padchatManager.WXSendAppMsg(id, content)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.messageForward = function (receiver, messageId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, rawPayload, id, voiceLength, match, res, _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'messageForward(%s, %s)', JSON.stringify(receiver), messageId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.messagePayload(messageId)];
                    case 1:
                        payload = _h.sent();
                        if (!(payload.type === wechaty_puppet_1.MessageType.Text)) return [3 /*break*/, 3];
                        if (!payload.text) {
                            throw new Error('no text');
                        }
                        return [4 /*yield*/, this.messageSendText(receiver, payload.text)];
                    case 2:
                        _h.sent();
                        return [3 /*break*/, 15];
                    case 3:
                        if (!(payload.type === wechaty_puppet_1.MessageType.Audio)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.messageRawPayload(messageId)];
                    case 4:
                        rawPayload = _h.sent();
                        id = receiver.roomId || receiver.contactId;
                        if (!id) {
                            throw Error("Can not find the receiver id for forwarding voice message(" + rawPayload.msg_id + "), forward voice message failed");
                        }
                        voiceLength = void 0;
                        try {
                            match = rawPayload.content.match(/voicelength="(\d+)"/) || [];
                            voiceLength = parseInt(match[1], 10) || 0;
                        }
                        catch (e) {
                            config_1.log.error(e);
                            throw new Error("Can not get the length of the voice message(" + rawPayload.msg_id + "), forward voice message failed");
                        }
                        _b = (_a = this.padchatManager).WXSendVoice;
                        _c = [id];
                        return [4 /*yield*/, this.getVoiceDataFromRawPayload(rawPayload)];
                    case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([_h.sent(),
                            voiceLength]))];
                    case 6:
                        res = _h.sent();
                        config_1.log.error(res);
                        return [3 /*break*/, 15];
                    case 7:
                        if (!(payload.type === wechaty_puppet_1.MessageType.Url)) return [3 /*break*/, 10];
                        _d = this.messageSendUrl;
                        _e = [receiver];
                        return [4 /*yield*/, this.messageUrl(messageId)];
                    case 8: return [4 /*yield*/, _d.apply(this, _e.concat([_h.sent()]))];
                    case 9:
                        _h.sent();
                        return [3 /*break*/, 15];
                    case 10:
                        if (!(payload.type === wechaty_puppet_1.MessageType.Attachment)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.forwardAttachment(receiver, messageId)];
                    case 11:
                        _h.sent();
                        return [3 /*break*/, 15];
                    case 12:
                        _f = this.messageSendFile;
                        _g = [receiver];
                        return [4 /*yield*/, this.messageFile(messageId)];
                    case 13: return [4 /*yield*/, _f.apply(this, _g.concat([_h.sent()]))];
                    case 14:
                        _h.sent();
                        _h.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Room
     *
     */
    PuppetPadchat.prototype.roomMemberPayloadDirty = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.silly('PuppetPadchat', 'roomMemberRawPayloadDirty(%s)', roomId);
                        return [4 /*yield*/, _super.prototype.roomMemberPayloadDirty.call(this, roomId)];
                    case 1:
                        _a.sent();
                        if (!this.padchatManager) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.padchatManager.roomMemberRawPayloadDirty(roomId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomMemberRawPayload = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberDictRawPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.silly('PuppetPadchat', 'roomMemberRawPayload(%s)', roomId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.roomMemberRawPayload(roomId)];
                    case 1:
                        memberDictRawPayload = _a.sent();
                        return [2 /*return*/, memberDictRawPayload[contactId]];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomMemberRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                config_1.log.silly('PuppetPadchat', 'roomMemberRawPayloadParser(%s)', rawPayload);
                payload = {
                    avatar: rawPayload.big_head,
                    id: rawPayload.user_name,
                    inviterId: rawPayload.invited_by,
                    name: rawPayload.nick_name,
                    roomAlias: rawPayload.chatroom_nick_name
                };
                return [2 /*return*/, payload];
            });
        });
    };
    PuppetPadchat.prototype.roomPayloadDirty = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomPayloadDirty(%s)', roomId);
                        if (this.padchatManager) {
                            this.padchatManager.roomRawPayloadDirty(roomId);
                        }
                        return [4 /*yield*/, _super.prototype.roomPayloadDirty.call(this, roomId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomRawPayload = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomRawPayload(%s)', roomId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.roomRawPayload(roomId)];
                    case 1:
                        rawPayload = _a.sent();
                        if (!rawPayload.user_name)
                            rawPayload.user_name = roomId;
                        return [2 /*return*/, rawPayload];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchat', 'roomRawPayloadParser(rawPayload.user_name="%s")', rawPayload.user_name);
                payload = pure_function_helpers_1.roomRawPayloadParser(rawPayload);
                return [2 /*return*/, payload];
            });
        });
    };
    PuppetPadchat.prototype.roomMemberList = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberIdList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomMemberList(%s)', roomId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.getRoomMemberIdList(roomId)];
                    case 1:
                        memberIdList = _a.sent();
                        config_1.log.silly('PuppetPadchat', 'roomMemberList()=%d', memberIdList.length);
                        if (!(memberIdList.length <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.roomPayloadDirty(roomId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, memberIdList];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomValidate = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var exist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomValid(%s)', roomId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXGetChatRoomMember(roomId)];
                    case 1:
                        exist = _a.sent();
                        return [2 /*return*/, !!exist];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roomIdList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomList()');
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.getRoomIdList()];
                    case 1:
                        roomIdList = _a.sent();
                        config_1.log.silly('PuppetPadchat', 'roomList()=%d', roomIdList.length);
                        return [2 /*return*/, roomIdList];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomDel = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberIdList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomDel(%s, %s)', roomId, contactId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.roomMemberList(roomId)];
                    case 1:
                        memberIdList = _a.sent();
                        if (!memberIdList.includes(contactId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.padchatManager.WXDeleteChatRoomMember(roomId, contactId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        config_1.log.warn('PuppetPadchat', 'roomDel() room(%s) has no member contact(%s)', roomId, contactId);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomQrcode = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var memberIdList, base64, roomPayload, roomName, fileBox, qrcode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomQrcode(%s)', roomId);
                        return [4 /*yield*/, this.roomMemberList(roomId)];
                    case 1:
                        memberIdList = _a.sent();
                        if (!memberIdList.includes(this.selfId())) {
                            throw new Error('userSelf not in this room: ' + roomId);
                        }
                        return [4 /*yield*/, this.padchatManager.WXGetUserQRCode(roomId, 0)];
                    case 2:
                        base64 = _a.sent();
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 3:
                        roomPayload = _a.sent();
                        roomName = roomPayload.topic || roomPayload.id;
                        fileBox = file_box_1.FileBox.fromBase64(base64, roomName + "-qrcode.jpg");
                        return [4 /*yield*/, pure_function_helpers_1.fileBoxToQrcode(fileBox)];
                    case 4:
                        qrcode = _a.sent();
                        return [2 /*return*/, qrcode];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomAvatar = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomAvatar(%s)', roomId);
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 1:
                        payload = _a.sent();
                        if (payload.avatar) {
                            return [2 /*return*/, file_box_1.FileBox.fromUrl(payload.avatar)];
                        }
                        config_1.log.warn('PuppetPadchat', 'roomAvatar() avatar not found, use the chatie default.');
                        return [2 /*return*/, config_1.qrCodeForChatie()];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomAdd = function (roomId, contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomAdd(%s, %s)', roomId, contactId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        config_1.log.verbose('PuppetPadchat', 'roomAdd(%s, %s) try to Add', roomId, contactId);
                        return [4 /*yield*/, this.padchatManager.WXAddChatRoomMember(roomId, contactId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_5 = _a.sent();
                        // FIXME
                        console.error(e_5);
                        config_1.log.warn('PuppetPadchat', 'roomAdd(%s, %s) Add exception: %s', e_5);
                        config_1.log.verbose('PuppetPadchat', 'roomAdd(%s, %s) try to Invite', roomId, contactId);
                        return [4 /*yield*/, this.padchatManager.WXInviteChatRoomMember(roomId, contactId)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomTopic = function (roomId, topic) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomTopic(%s, %s)', roomId, topic);
                        if (!(typeof topic === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload.topic];
                    case 2:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXSetChatroomName(roomId, topic)
                            /**
                             * Give server some time to refresh the API payload
                             * when we have to make sure the data is the latest.
                             */
                        ];
                    case 3:
                        _a.sent();
                        /**
                         * Give server some time to refresh the API payload
                         * when we have to make sure the data is the latest.
                         */
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                    case 4:
                        /**
                         * Give server some time to refresh the API payload
                         * when we have to make sure the data is the latest.
                         */
                        _a.sent();
                        return [4 /*yield*/, this.roomPayloadDirty(roomId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomCreate = function (contactIdList, topic) {
        return __awaiter(this, void 0, void 0, function () {
            var roomId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomCreate(%s, %s)', contactIdList, topic);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXCreateChatRoom(contactIdList)
                            // Load new created room payload
                        ];
                    case 1:
                        roomId = _a.sent();
                        // Load new created room payload
                        return [4 /*yield*/, this.roomPayload(roomId)];
                    case 2:
                        // Load new created room payload
                        _a.sent();
                        return [2 /*return*/, roomId];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomQuit = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomQuit(%s)', roomId);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXQuitChatRoom(roomId)
                            // Clean Cache
                        ];
                    case 1:
                        _a.sent();
                        // Clean Cache
                        return [4 /*yield*/, this.roomMemberPayloadDirty(roomId)];
                    case 2:
                        // Clean Cache
                        _a.sent();
                        return [4 /*yield*/, this.roomPayloadDirty(roomId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomAnnounce = function (roomId, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'roomAnnounce(%s, %s)', roomId, text ? text : '');
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        if (!text) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.padchatManager.WXSetChatroomAnnouncement(roomId, text)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        config_1.log.warn('Getting room announcement is not supported by wechaty-puppet-padchat.');
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.roomInvitationRawPayload = function (roomInvitationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.padchatManager) {
                    throw new Error('no padchat manager');
                }
                return [2 /*return*/, this.padchatManager.roomInvitationRawPayload(roomInvitationId)];
            });
        });
    };
    PuppetPadchat.prototype.roomInvitationRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        id: rawPayload.id,
                        inviterId: rawPayload.fromUser,
                        roomMemberCount: 0,
                        roomMemberIdList: [],
                        roomTopic: rawPayload.roomName,
                        timestamp: rawPayload.timestamp
                    }];
            });
        });
    };
    PuppetPadchat.prototype.roomInvitationAccept = function (roomInvitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, payload, shareUrl, response, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padcaht manager');
                        }
                        res = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.padchatManager.roomInvitationRawPayload(roomInvitationId)];
                    case 2:
                        payload = _a.sent();
                        shareUrl = payload.url;
                        return [4 /*yield*/, this.padchatManager.WXGetRequestToken(this.selfId(), shareUrl)];
                    case 3:
                        response = _a.sent();
                        return [4 /*yield*/, require('request-promise')({
                                method: 'POST',
                                simple: false,
                                uri: response.full_url
                            })];
                    case 4:
                        res = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_6 = _a.sent();
                        throw new Error('UNKNOWN: Unexpected error happened when trying to accept invitation\n' + e_6);
                    case 6:
                        if (res.indexOf('你无法查看被转发过的邀请') !== -1 || res.indexOf('Unable to view forwarded invitations') === -1) {
                            throw new Error('FORWARDED: Accept invitation failed, this is a forwarded invitation, can not be accepted');
                        }
                        else if (res.indexOf('你未开通微信支付') !== -1 || res.indexOf('You haven\'t enabled WeChat Pay') === -1
                            || res.indexOf('你需要实名验证后才能接受邀请') !== -1) {
                            throw new Error('WXPAY: The user need to enable wechaty pay(微信支付) to join the room, this is requested by Wechat.');
                        }
                        else if (res.indexOf('该邀请已过期') !== -1 || res.indexOf('Invitation expired') === -1) {
                            throw new Error('EXPIRED: The invitation is expired, please request the user to send again');
                        }
                        else if (res.indexOf('群聊邀请操作太频繁请稍后再试') !== -1 || res.indexOf('操作太频繁，请稍后再试') !== -1) {
                            throw new Error('FREQUENT: Room invitation operation too frequent.');
                        }
                        else if (res.indexOf('已达群聊人数上限') !== -1) {
                            throw new Error('LIMIT: The room member count has reached the limit.');
                        }
                        else if (res.indexOf('该群因违规已被限制使用，无法添加群成员') !== -1) {
                            throw new Error('INVALID: This room has been mal used, can not add new members.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Friendship
     *
     */
    PuppetPadchat.prototype.friendshipAdd = function (contactId, hello) {
        return __awaiter(this, void 0, void 0, function () {
            var rawSearchPayload, e_7, strangerV1, strangerV2, isPhoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'friendshipAdd(%s, %s)', contactId, hello);
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.padchatManager.WXSearchContact(contactId)];
                    case 2:
                        rawSearchPayload = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _a.sent();
                        throw Error("Can not add user " + contactId + ", this contactId is not searchable. Please refer to issue: https://github.com/lijiarui/wechaty-puppet-padchat/issues/166");
                    case 4:
                        /**
                         * If the contact is not stranger, than ussing WXSearchContact can get user_name
                         */
                        if (rawSearchPayload.user_name !== '' && !pure_function_helpers_1.isStrangerV1(rawSearchPayload.user_name) && !pure_function_helpers_1.isStrangerV2(rawSearchPayload.user_name)) {
                            config_1.log.warn('PuppetPadchat', 'friendshipAdd %s has been friend with bot, no need to send friend request!', contactId);
                            return [2 /*return*/];
                        }
                        if (pure_function_helpers_1.isStrangerV1(rawSearchPayload.stranger)) {
                            strangerV1 = rawSearchPayload.stranger;
                            strangerV2 = rawSearchPayload.user_name;
                        }
                        else if (pure_function_helpers_1.isStrangerV2(rawSearchPayload.stranger)) {
                            strangerV2 = rawSearchPayload.stranger;
                            strangerV1 = rawSearchPayload.user_name;
                        }
                        else {
                            throw new Error('stranger neither v1 nor v2!');
                        }
                        isPhoneNumber = contactId.match(/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/);
                        return [4 /*yield*/, this.padchatManager.WXAddUser(strangerV1 || '', strangerV2 || '', isPhoneNumber ? padchat_rpc_type_1.WXSearchContactTypeStatus.MOBILE : padchat_rpc_type_1.WXSearchContactTypeStatus.WXID, // default
                            hello)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.friendshipSearch = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchat', 'friendSearch(%s, %s)', contactId);
                if (!this.padchatManager) {
                    throw new Error('no padchat manager');
                }
                try {
                    return [2 /*return*/, this.padchatManager.WXSearchContact(contactId)];
                }
                catch (e) {
                    throw Error("Can not add user " + contactId + ", this contactId is not searchable. Please refer to issue: https://github.com/lijiarui/wechaty-puppet-padchat/issues/166");
                }
                return [2 /*return*/];
            });
        });
    };
    PuppetPadchat.prototype.friendshipAccept = function (friendshipId) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'friendshipAccept(%s)', friendshipId);
                        return [4 /*yield*/, this.friendshipPayload(friendshipId)];
                    case 1:
                        payload = _a.sent();
                        if (!payload.ticket) {
                            throw new Error('no ticket');
                        }
                        if (!payload.stranger) {
                            throw new Error('no stranger');
                        }
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.WXAcceptUser(payload.stranger, payload.ticket)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.friendshipRawPayloadParser = function (rawPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config_1.log.verbose('PuppetPadchat', 'friendshipRawPayloadParser({id=%s})', rawPayload.msg_id);
                        return [4 /*yield*/, pure_function_helpers_1.friendshipRawPayloadParser(rawPayload)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, payload];
                }
            });
        });
    };
    PuppetPadchat.prototype.friendshipRawPayload = function (friendshipId) {
        return __awaiter(this, void 0, void 0, function () {
            var rawPayload;
            return __generator(this, function (_a) {
                config_1.log.verbose('PuppetPadchat', 'friendshipRawPayload(%s)', friendshipId);
                rawPayload = this.cachePadchatMessagePayload.get(friendshipId);
                if (!rawPayload) {
                    throw new Error('no rawPayload for id ' + friendshipId);
                }
                return [2 /*return*/, rawPayload];
            });
        });
    };
    PuppetPadchat.prototype.unref = function () {
        config_1.log.verbose('PuppetPadchat', 'unref ()');
        _super.prototype.unref.call(this);
        if (this.padchatManager) {
            // TODO: this.padchatManager.unref()
        }
    };
    PuppetPadchat.prototype.contactSelfName = function (newName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.updateSelfName(newName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.contactPayloadDirty(this.selfId())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.prototype.contactSelfSignature = function (signature) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.padchatManager) {
                            throw new Error('no padchat manager');
                        }
                        return [4 /*yield*/, this.padchatManager.updateSelfSignature(signature)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.contactPayloadDirty(this.selfId())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppetPadchat.VERSION = config_1.VERSION;
    return PuppetPadchat;
}(wechaty_puppet_1.Puppet));
exports.PuppetPadchat = PuppetPadchat;
exports["default"] = PuppetPadchat;
