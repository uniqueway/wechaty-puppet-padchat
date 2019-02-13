"use strict";
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
var wechaty_puppet_1 = require("wechaty-puppet");
var _1 = require(".");
var padchat_schemas_1 = require("../padchat-schemas");
var is_type_1 = require("./is-type");
var message_file_name_1 = require("./message-file-name");
var message_source_parser_1 = require("./message-source-parser");
var message_type_1 = require("./message-type");
function messageRawPayloadParser(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var type, payloadBase, fromId, roomId, toId, text, mentionIdList, parts, parts, messageSource, payload, appPayload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = message_type_1.messageType(rawPayload.sub_type);
                    payloadBase = {
                        id: rawPayload.msg_id,
                        timestamp: rawPayload.timestamp,
                        type: type
                    };
                    if (type === wechaty_puppet_1.MessageType.Image
                        || type === wechaty_puppet_1.MessageType.Audio
                        || type === wechaty_puppet_1.MessageType.Video
                        || type === wechaty_puppet_1.MessageType.Attachment) {
                        payloadBase.filename = message_file_name_1.messageFileName(rawPayload) || undefined;
                    }
                    /**
                     * 1. Set Room Id
                     */
                    if (is_type_1.isRoomId(rawPayload.from_user)) {
                        roomId = rawPayload.from_user;
                    }
                    else if (is_type_1.isRoomId(rawPayload.to_user)) {
                        roomId = rawPayload.to_user;
                    }
                    else {
                        roomId = undefined;
                    }
                    /**
                     * 2. Set To Contact Id
                     */
                    if (is_type_1.isContactId(rawPayload.to_user)) {
                        toId = rawPayload.to_user;
                    }
                    else {
                        // TODO: if the message @someone, the toId should set to the mentioned contact id(?)
                        toId = undefined;
                    }
                    /**
                     * 3. Set From Contact Id
                     */
                    if (is_type_1.isContactId(rawPayload.from_user)) {
                        fromId = rawPayload.from_user;
                    }
                    else {
                        parts = rawPayload.content.split(':\n');
                        if (parts && parts.length > 1) {
                            if (is_type_1.isContactId(parts[0])) {
                                fromId = parts[0];
                            }
                        }
                        else {
                            fromId = undefined;
                        }
                    }
                    /**
                     *
                     * 4. Set Text
                     */
                    if (is_type_1.isRoomId(rawPayload.from_user)) {
                        parts = rawPayload.content.split(':\n');
                        if (parts && parts.length > 1) {
                            text = parts[1];
                        }
                        else {
                            text = rawPayload.content;
                        }
                    }
                    else {
                        text = rawPayload.content;
                    }
                    /**
                     * 5.1 Validate Room & From ID
                     */
                    if (!roomId && !fromId) {
                        throw Error('empty roomId and empty fromId!');
                    }
                    /**
                     * 5.1 Validate Room & To ID
                     */
                    if (!roomId && !toId) {
                        throw Error('empty roomId and empty toId!');
                    }
                    if (!roomId) return [3 /*break*/, 2];
                    return [4 /*yield*/, message_source_parser_1.messageSourceParser(rawPayload.msg_source)];
                case 1:
                    messageSource = _a.sent();
                    if (messageSource !== null && messageSource.atUserList) {
                        mentionIdList = messageSource.atUserList;
                    }
                    _a.label = 2;
                case 2:
                    // Two branch is the same code.
                    // Only for making TypeScript happy
                    if (fromId && toId) {
                        payload = __assign({}, payloadBase, { fromId: fromId,
                            mentionIdList: mentionIdList,
                            roomId: roomId,
                            text: text,
                            toId: toId });
                    }
                    else if (roomId) {
                        payload = __assign({}, payloadBase, { fromId: fromId,
                            mentionIdList: mentionIdList,
                            roomId: roomId,
                            text: text,
                            toId: toId });
                    }
                    else {
                        throw new Error('neither toId nor roomId');
                    }
                    if (!(type === wechaty_puppet_1.MessageType.Attachment)) return [3 /*break*/, 4];
                    return [4 /*yield*/, _1.appMessageParser(rawPayload)];
                case 3:
                    appPayload = _a.sent();
                    if (appPayload) {
                        switch (appPayload.type) {
                            case padchat_schemas_1.WechatAppMessageType.Url:
                                payload.type = wechaty_puppet_1.MessageType.Url;
                                break;
                            case padchat_schemas_1.WechatAppMessageType.Attach:
                                payload.type = wechaty_puppet_1.MessageType.Attachment;
                                break;
                            case padchat_schemas_1.WechatAppMessageType.ChatHistory:
                                payload.type = wechaty_puppet_1.MessageType.ChatHistory;
                                break;
                            case padchat_schemas_1.WechatAppMessageType.MiniProgram:
                                payload.type = wechaty_puppet_1.MessageType.MiniProgram;
                                break;
                            case padchat_schemas_1.WechatAppMessageType.RedEnvelopes:
                            case padchat_schemas_1.WechatAppMessageType.Transfers:
                                payload.type = wechaty_puppet_1.MessageType.Money;
                                break;
                            case padchat_schemas_1.WechatAppMessageType.RealtimeShareLocation:
                                payload.type = wechaty_puppet_1.MessageType.Location;
                                break;
                            default:
                                payload.type = wechaty_puppet_1.MessageType.Unknown;
                                break;
                        }
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, payload];
            }
        });
    });
}
exports.messageRawPayloadParser = messageRawPayloadParser;
