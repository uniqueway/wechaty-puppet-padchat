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
var friendship_event_message_parser_1 = require("./friendship-event-message-parser");
function friendshipRawPayloadParser(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!friendship_event_message_parser_1.friendshipConfirmEventMessageParser(rawPayload)) return [3 /*break*/, 1];
                    /**
                     * 1. Confirm Event
                     */
                    return [2 /*return*/, friendshipRawPayloadParserConfirm(rawPayload)];
                case 1:
                    if (!friendship_event_message_parser_1.friendshipVerifyEventMessageParser(rawPayload)) return [3 /*break*/, 2];
                    /**
                     * 2. Verify Event
                     */
                    return [2 /*return*/, friendshipRawPayloadParserVerify(rawPayload)];
                case 2: return [4 /*yield*/, friendship_event_message_parser_1.friendshipReceiveEventMessageParser(rawPayload)];
                case 3:
                    if (_a.sent()) {
                        /**
                         * 3. Receive Event
                         */
                        return [2 /*return*/, friendshipRawPayloadParserReceive(rawPayload)];
                    }
                    else {
                        throw new Error('event type is neither confirm nor verify, and not receive');
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.friendshipRawPayloadParser = friendshipRawPayloadParser;
function friendshipRawPayloadParserConfirm(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = {
                contactId: rawPayload.from_user,
                id: rawPayload.msg_id,
                type: wechaty_puppet_1.FriendshipType.Confirm
            };
            return [2 /*return*/, payload];
        });
    });
}
function friendshipRawPayloadParserVerify(rawPayload) {
    var payload = {
        contactId: rawPayload.from_user,
        id: rawPayload.msg_id,
        type: wechaty_puppet_1.FriendshipType.Verify
    };
    return payload;
}
function friendshipRawPayloadParserReceive(rawPayload) {
    return __awaiter(this, void 0, void 0, function () {
        var tryXmlText, jsonPayload, padchatFriendshipPayload, friendshipPayload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tryXmlText = rawPayload.content;
                    return [4 /*yield*/, xml_to_json_1.xmlToJson(tryXmlText)]; // , { object: true })
                case 1:
                    jsonPayload = _a.sent() // , { object: true })
                    ;
                    if (!jsonPayload.msg) {
                        throw new Error('no msg found');
                    }
                    padchatFriendshipPayload = jsonPayload.msg.$;
                    friendshipPayload = {
                        contactId: padchatFriendshipPayload.fromusername,
                        hello: padchatFriendshipPayload.content,
                        id: rawPayload.msg_id,
                        stranger: padchatFriendshipPayload.encryptusername,
                        ticket: padchatFriendshipPayload.ticket,
                        type: wechaty_puppet_1.FriendshipType.Receive
                    };
                    return [2 /*return*/, friendshipPayload];
            }
        });
    });
}
