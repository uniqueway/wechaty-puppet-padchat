"use strict";
exports.__esModule = true;
var wechaty_puppet_1 = require("wechaty-puppet");
var is_type_1 = require("./is-type");
/**
 *
 * 2. Room Leave Event
 *
 *
 * try to find 'leave' event for Room
 *
 * 1.
 *  You removed "李卓桓" from the group chat
 *  You were removed from the group chat by "李卓桓"
 * 2.
 *  你将"Huan LI++"移出了群聊
 *  你被"李卓桓"移出群聊
 */
var ROOM_LEAVE_OTHER_REGEX_LIST = [
    /^(You) removed "(.+)" from the group chat/,
    /^(你)将"(.+)"移出了群聊/,
];
var ROOM_LEAVE_BOT_REGEX_LIST = [
    /^(You) were removed from the group chat by "([^"]+)"/,
    /^(你)被"([^"]+?)"移出群聊/,
];
function roomLeaveEventMessageParser(rawPayload) {
    if (!is_type_1.isPayload(rawPayload)) {
        return null;
    }
    var roomId = rawPayload.from_user;
    var content = rawPayload.content;
    if (!is_type_1.isRoomId(roomId)) {
        return null;
    }
    var matchesForOther = [];
    ROOM_LEAVE_OTHER_REGEX_LIST.some(function (regex) { return !!(matchesForOther = content.match(regex)); });
    var matchesForBot = [];
    ROOM_LEAVE_BOT_REGEX_LIST.some(function (re) { return !!(matchesForBot = content.match(re)); });
    var matches = matchesForOther || matchesForBot;
    if (!matches) {
        return null;
    }
    var leaverName;
    var removerName;
    if (matchesForOther) {
        removerName = wechaty_puppet_1.YOU;
        leaverName = matchesForOther[2];
    }
    else if (matchesForBot) {
        removerName = matchesForBot[2];
        leaverName = wechaty_puppet_1.YOU;
    }
    else {
        throw new Error('for typescript type checking, will never go here');
    }
    var roomLeaveEvent = {
        leaverNameList: [leaverName],
        removerName: removerName,
        roomId: roomId
    };
    return roomLeaveEvent;
}
exports.roomLeaveEventMessageParser = roomLeaveEventMessageParser;
