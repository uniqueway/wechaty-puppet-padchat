"use strict";
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
var xml_to_json_1 = require("./xml-to-json");
var wechaty_puppet_1 = require("wechaty-puppet");
var padchat_schemas_1 = require("../padchat-schemas");
var is_type_1 = require("./is-type");
var split_name_1 = require("./split-name");
/**
 *
 * 1. Room Join Event
 *
 *
 * try to find 'join' event for Room
 *
 * 1.
 *  李卓桓 invited Huan to the group chat
 *  李卓桓 invited 李佳芮, Huan to the group chat
 *  李卓桓 invited you to a group chat with
 *  李卓桓 invited you and Huan to the group chat
 * 2.
 *  "李卓桓"邀请"Huan LI++"加入了群聊
 *  "李佳芮"邀请你加入了群聊，群聊参与人还有：小桔、桔小秘、小小桔、wuli舞哩客服、舒米
 *  "李卓桓"邀请你和"Huan LI++"加入了群聊
 */
var ROOM_JOIN_BOT_INVITE_OTHER_REGEX_LIST_ZH = [
    /^你邀请"(.+)"加入了群聊/,
    /^" ?(.+)"通过扫描你分享的二维码加入群聊/,
];
var ROOM_JOIN_BOT_INVITE_OTHER_REGEX_LIST_EN = [
    /^You invited (.+) to the group chat/,
    /^" ?(.+)" joined group chat via the QR code you shared/,
];
////////////////////////////////////////////////////
var ROOM_JOIN_OTHER_INVITE_BOT_REGEX_LIST_ZH = [
    /^"([^"]+?)"邀请你加入了群聊/,
    /^"([^"]+?)"邀请你和"(.+)"加入了群聊/,
];
var ROOM_JOIN_OTHER_INVITE_BOT_REGEX_LIST_EN = [
    /^(.+) invited you to a group chat/,
    /^(.+) invited you and (.+) to the group chat/,
];
////////////////////////////////////////////////////
var ROOM_JOIN_OTHER_INVITE_OTHER_REGEX_LIST_ZH = [
    /^"(.+)"邀请"(.+)"加入了群聊/,
];
var ROOM_JOIN_OTHER_INVITE_OTHER_REGEX_LIST_EN = [
    /^(.+?) invited (.+?) to (the|a) group chat/,
];
////////////////////////////////////////////////////
var ROOM_JOIN_OTHER_INVITE_OTHER_QRCODE_REGEX_LIST_ZH = [
    /^" (.+)"通过扫描"(.+)"分享的二维码加入群聊/,
];
var ROOM_JOIN_OTHER_INVITE_OTHER_QRCODE_REGEX_LIST_EN = [
    /^"(.+)" joined the group chat via the QR Code shared by "(.+)"/,
];
function roomJoinEventMessageParser(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var roomId, content, tryXmlText, jsonPayload, matchesForBotInviteOtherEn, matchesForOtherInviteBotEn, matchesForOtherInviteOtherEn, matchesForOtherInviteOtherQrcodeEn, matchesForBotInviteOtherZh, matchesForOtherInviteBotZh, matchesForOtherInviteOtherZh, matchesForOtherInviteOtherQrcodeZh, matchesForBotInviteOther, matchesForOtherInviteBot, matchesForOtherInviteOther, matchesForOtherInviteOtherQrcode, languageEn, languageZh, matches, other, inviteeNameList, inviterName, joinEvent, inviterName, inviteeNameList, nameList, joinEvent, inviterName, inviteeNameList, other, joinEvent, inviterName, inviteeNameList, other, joinEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!is_type_1.isPayload(rawPayload)) {
                        return [2 /*return*/, null];
                    }
                    roomId = rawPayload.from_user;
                    if (!is_type_1.isRoomId(roomId)) {
                        return [2 /*return*/, null];
                    }
                    content = rawPayload.content;
                    if (!(rawPayload.sub_type === padchat_schemas_1.PadchatMessageType.Recalled)) return [3 /*break*/, 2];
                    tryXmlText = content.replace(/^[^\n]+\n/, '');
                    return [4 /*yield*/, xml_to_json_1.xmlToJson(tryXmlText)]; // toJson(tryXmlText, { object: true }) as XmlSchema
                case 1:
                    jsonPayload = _a.sent() // toJson(tryXmlText, { object: true }) as XmlSchema
                    ;
                    try {
                        if (jsonPayload.sysmsg.$.type === 'delchatroommember') {
                            content = jsonPayload.sysmsg.delchatroommember.plain;
                        }
                        else if (jsonPayload.sysmsg.$.type === 'revokemsg') {
                            content = jsonPayload.sysmsg.revokemsg.replacemsg;
                        }
                        else {
                            throw new Error('unknown jsonPayload sysmsg type: ' + jsonPayload.sysmsg.$.type);
                        }
                    }
                    catch (e) {
                        console.error(e);
                        console.log('jsonPayload:', jsonPayload);
                        throw e;
                    }
                    _a.label = 2;
                case 2:
                    matchesForBotInviteOtherEn = null;
                    matchesForOtherInviteBotEn = null;
                    matchesForOtherInviteOtherEn = null;
                    matchesForOtherInviteOtherQrcodeEn = null;
                    matchesForBotInviteOtherZh = null;
                    matchesForOtherInviteBotZh = null;
                    matchesForOtherInviteOtherZh = null;
                    matchesForOtherInviteOtherQrcodeZh = null;
                    ROOM_JOIN_BOT_INVITE_OTHER_REGEX_LIST_EN.some(function (regex) { return !!(matchesForBotInviteOtherEn = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_BOT_REGEX_LIST_EN.some(function (regex) { return !!(matchesForOtherInviteBotEn = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_OTHER_REGEX_LIST_EN.some(function (regex) { return !!(matchesForOtherInviteOtherEn = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_OTHER_QRCODE_REGEX_LIST_EN.some(function (regex) { return !!(matchesForOtherInviteOtherQrcodeEn = content.match(regex)); });
                    ROOM_JOIN_BOT_INVITE_OTHER_REGEX_LIST_ZH.some(function (regex) { return !!(matchesForBotInviteOtherZh = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_BOT_REGEX_LIST_ZH.some(function (regex) { return !!(matchesForOtherInviteBotZh = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_OTHER_REGEX_LIST_ZH.some(function (regex) { return !!(matchesForOtherInviteOtherZh = content.match(regex)); });
                    ROOM_JOIN_OTHER_INVITE_OTHER_QRCODE_REGEX_LIST_ZH.some(function (regex) { return !!(matchesForOtherInviteOtherQrcodeZh = content.match(regex)); });
                    matchesForBotInviteOther = matchesForBotInviteOtherEn || matchesForBotInviteOtherZh;
                    matchesForOtherInviteBot = matchesForOtherInviteBotEn || matchesForOtherInviteBotZh;
                    matchesForOtherInviteOther = matchesForOtherInviteOtherEn || matchesForOtherInviteOtherZh;
                    matchesForOtherInviteOtherQrcode = matchesForOtherInviteOtherQrcodeEn || matchesForOtherInviteOtherQrcodeZh;
                    languageEn = matchesForBotInviteOtherEn
                        || matchesForOtherInviteBotEn
                        || matchesForOtherInviteOtherEn
                        || matchesForOtherInviteOtherQrcodeEn;
                    languageZh = matchesForBotInviteOtherZh
                        || matchesForOtherInviteBotZh
                        || matchesForOtherInviteOtherZh
                        || matchesForOtherInviteOtherQrcodeZh;
                    matches = matchesForBotInviteOther
                        || matchesForOtherInviteBot
                        || matchesForOtherInviteOther
                        || matchesForOtherInviteOtherQrcode;
                    if (!matches) {
                        return [2 /*return*/, null];
                    }
                    /**
                     *
                     * Parse all Names From the Event Text
                     *
                     */
                    if (matchesForBotInviteOther) {
                        other = matches[1];
                        inviteeNameList = void 0;
                        if (languageEn) {
                            inviteeNameList = split_name_1.splitEnglishNameList(other);
                        }
                        else if (languageZh) {
                            inviteeNameList = split_name_1.splitChineseNameList(other);
                        }
                        else {
                            throw new Error('make typescript happy');
                        }
                        inviterName = wechaty_puppet_1.YOU;
                        joinEvent = {
                            inviteeNameList: inviteeNameList,
                            inviterName: inviterName,
                            roomId: roomId
                        };
                        return [2 /*return*/, joinEvent];
                    }
                    else if (matchesForOtherInviteBot) {
                        inviterName = matches[1];
                        inviteeNameList = [wechaty_puppet_1.YOU];
                        if (matches[2]) {
                            nameList = void 0;
                            if (languageEn) {
                                nameList = split_name_1.splitEnglishNameList(matches[2]);
                            }
                            else if (languageZh) {
                                nameList = split_name_1.splitChineseNameList(matches[2]);
                            }
                            else {
                                throw new Error('neither English nor Chinese');
                            }
                            inviteeNameList = inviteeNameList.concat(nameList);
                        }
                        joinEvent = {
                            inviteeNameList: inviteeNameList,
                            inviterName: inviterName,
                            roomId: roomId
                        };
                        return [2 /*return*/, joinEvent];
                    }
                    else if (matchesForOtherInviteOther) {
                        inviterName = matches[1];
                        inviteeNameList = void 0;
                        other = matches[2];
                        if (languageEn) {
                            inviteeNameList = split_name_1.splitEnglishNameList(other);
                        }
                        else if (languageZh) {
                            inviteeNameList = split_name_1.splitChineseNameList(other);
                        }
                        else {
                            throw new Error('neither English nor Chinese');
                        }
                        joinEvent = {
                            inviteeNameList: inviteeNameList,
                            inviterName: inviterName,
                            roomId: roomId
                        };
                        return [2 /*return*/, joinEvent];
                    }
                    else if (matchesForOtherInviteOtherQrcode) {
                        inviterName = matches[2];
                        inviteeNameList = void 0;
                        other = matches[1];
                        if (languageEn) {
                            inviteeNameList = split_name_1.splitEnglishNameList(other);
                        }
                        else if (languageZh) {
                            inviteeNameList = split_name_1.splitChineseNameList(other);
                        }
                        else {
                            throw new Error('neither English nor Chinese');
                        }
                        joinEvent = {
                            inviteeNameList: inviteeNameList,
                            inviterName: inviterName,
                            roomId: roomId
                        };
                        return [2 /*return*/, joinEvent];
                    }
                    else {
                        throw new Error('who invite who?');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.roomJoinEventMessageParser = roomJoinEventMessageParser;
