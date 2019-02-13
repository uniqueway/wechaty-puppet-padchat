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
var is_type_1 = require("./is-type");
/**
 *
 * 1. Friendship Confirm Event
 *
 */
var FRIENDSHIP_CONFIRM_REGEX_LIST = [
    /^You have added (.+) as your WeChat contact. Start chatting!$/,
    /^你已添加了(.+)，现在可以开始聊天了。$/,
    /I've accepted your friend request. Now let's chat!$/,
    /^(.+) just added you to his\/her contacts list. Send a message to him\/her now!$/,
    /^(.+)刚刚把你添加到通讯录，现在可以开始聊天了。$/,
    /^我通过了你的朋友验证请求，现在我们可以开始聊天了$/,
];
function friendshipConfirmEventMessageParser(rawPayload) {
    if (!is_type_1.isPayload(rawPayload)) {
        return null;
    }
    var matches = null;
    var text = rawPayload.content;
    FRIENDSHIP_CONFIRM_REGEX_LIST.some(function (regexp) {
        matches = text.match(regexp);
        return !!matches;
    });
    if (!matches) {
        return null;
    }
    return rawPayload.from_user;
}
exports.friendshipConfirmEventMessageParser = friendshipConfirmEventMessageParser;
/**
 *
 * 2. Friendship Receive Event
 *
 */
function friendshipReceiveEventMessageParser(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonPayload, contactId, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!is_type_1.isPayload(rawPayload)) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, xml_to_json_1.xmlToJson(rawPayload.content)];
                case 2:
                    jsonPayload = _a.sent();
                    contactId = jsonPayload.msg.$.fromusername;
                    if (is_type_1.isContactId(contactId)) {
                        return [2 /*return*/, contactId];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
exports.friendshipReceiveEventMessageParser = friendshipReceiveEventMessageParser;
/**
 *
 * 3. Friendship Verify Event
 *
 */
var FRIENDSHIP_VERIFY_REGEX_LIST = [
    /^(.+) has enabled Friend Confirmation/,
    /^(.+)开启了朋友验证，你还不是他（她）朋友。请先发送朋友验证请求，对方验证通过后，才能聊天。/,
];
function friendshipVerifyEventMessageParser(rawPayload) {
    if (!is_type_1.isPayload(rawPayload)) {
        return null;
    }
    var matches = null;
    var text = rawPayload.content;
    FRIENDSHIP_VERIFY_REGEX_LIST.some(function (regexp) {
        matches = text.match(regexp);
        return !!matches;
    });
    if (!matches) {
        return null;
    }
    return rawPayload.from_user;
}
exports.friendshipVerifyEventMessageParser = friendshipVerifyEventMessageParser;
