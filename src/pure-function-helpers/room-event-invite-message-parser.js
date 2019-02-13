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
var _this = this;
exports.__esModule = true;
var xml_to_json_1 = require("./xml-to-json");
var is_type_1 = require("./is-type");
/*
{
  "msg": {
    "appmsg": {
      "appid": "",
      "sdkver": "0",
      "title": "邀请你加入群聊",
      "des": "\"user\"邀请你加入群聊💃🏻这个群特别炸💃🏻，进入可查看详情。",
      "action": "view",
      "type": "5",
      "showtype": "0",
      "soundtype": "0",
      "mediatagname": {},
      "messageext": {},
      "messageaction": {},
      "content": {},
      "contentattr": "0",
      "url": "http://support.weixin.qq.com/cgi-bin/mmsupport-bin/addchatroombyinvite?ticket=AR4P8WARk7B55o05Gqc65Q%3D%3D",
      "lowurl": {},
      "dataurl": {},
      "lowdataurl": {},
      "appattach": {
        "totallen": "0",
        "attachid": {},
        "emoticonmd5": {},
        "fileext": {},
        "cdnthumbaeskey": {},
        "aeskey": {}
      },
      "extinfo": {},
      "sourceusername": {},
      "sourcedisplayname": {},
      "thumburl": "http://weixin.qq.com/cgi-bin/getheadimg?username=3085b869e7943882d94e05dcdc7f28c524804fc4759b6c273f2be799ed1bf0e9",
      "md5": {},
      "statextstr": {}
    },
    "fromusername": "lylezhuifeng",
    "scene": "0",
    "appinfo": {
      "version": "1",
      "appname": {}
    },
    "commenturl": {}
  }
}
*/
var ROOM_OTHER_INVITE_TITLE_ZH = [
    /邀请你加入群聊/
];
var ROOM_OTHER_INVITE_TITLE_EN = [
    /Group Chat Invitation/
];
var ROOM_OTHER_INVITE_LIST_ZH = [
    /^"(.+)"邀请你加入群聊(.+)，进入可查看详情。/
];
var ROOM_OTHER_INVITE_LIST_EN = [
    /"(.+)" invited you to join the group chat "(.+)"\. Enter to view details\./
];
exports.roomInviteEventMessageParser = function (rawPayload) { return __awaiter(_this, void 0, void 0, function () {
    var content, msg_id, timestamp, from_user, tryXmlText, jsonPayload, e_1, matchesForOtherInviteTitleEn, matchesForOtherInviteTitleZh, matchesForOtherInviteEn, matchesForOtherInviteZh, titleMatch, matchInviteEvent, matches;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!is_type_1.isPayload(rawPayload)) {
                    return [2 /*return*/, null];
                }
                content = rawPayload.content, msg_id = rawPayload.msg_id, timestamp = rawPayload.timestamp, from_user = rawPayload.from_user;
                tryXmlText = content.replace(/^[^\n]+\n/, '');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, xml_to_json_1.xmlToJson(tryXmlText)];
            case 2:
                jsonPayload = (_a.sent());
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, null];
            case 4:
                // If no title or des, it is not a room invite event, skip further process
                if (!jsonPayload.msg || !jsonPayload.msg.appmsg || !jsonPayload.msg.appmsg.title || !jsonPayload.msg.appmsg.des
                    // tslint:disable-next-line:strict-type-predicates
                    || typeof jsonPayload.msg.appmsg.title !== 'string' || typeof jsonPayload.msg.appmsg.des !== 'string') {
                    return [2 /*return*/, null];
                }
                matchesForOtherInviteTitleEn = null;
                matchesForOtherInviteTitleZh = null;
                matchesForOtherInviteEn = null;
                matchesForOtherInviteZh = null;
                ROOM_OTHER_INVITE_TITLE_EN.some(function (regex) { return !!(matchesForOtherInviteTitleEn = jsonPayload.msg.appmsg.title.match(regex)); });
                ROOM_OTHER_INVITE_TITLE_ZH.some(function (regex) { return !!(matchesForOtherInviteTitleZh = jsonPayload.msg.appmsg.title.match(regex)); });
                ROOM_OTHER_INVITE_LIST_EN.some(function (regex) { return !!(matchesForOtherInviteEn = jsonPayload.msg.appmsg.des.match(regex)); });
                ROOM_OTHER_INVITE_LIST_ZH.some(function (regex) { return !!(matchesForOtherInviteZh = jsonPayload.msg.appmsg.des.match(regex)); });
                titleMatch = matchesForOtherInviteTitleEn || matchesForOtherInviteTitleZh;
                matchInviteEvent = matchesForOtherInviteEn || matchesForOtherInviteZh;
                matches = !!titleMatch && !!matchInviteEvent;
                if (!matches) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        fromUser: from_user,
                        msgId: msg_id,
                        roomName: matchInviteEvent[2],
                        timestamp: timestamp,
                        url: jsonPayload.msg.appmsg.url
                    }];
        }
    });
}); };
