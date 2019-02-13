"use strict";
exports.__esModule = true;
var wechaty_puppet_1 = require("wechaty-puppet");
var is_type_1 = require("./is-type");
/**
 *
 * 3. Room Topic Event
 *
 */
var ROOM_TOPIC_OTHER_REGEX_LIST = [
    /^"(.+)" changed the group name to "(.+)"$/,
    /^"(.+)"修改群名为“(.+)”$/,
];
var ROOM_TOPIC_YOU_REGEX_LIST = [
    /^(You) changed the group name to "(.+)"$/,
    /^(你)修改群名为“(.+)”$/,
];
function roomTopicEventMessageParser(rawPayload) {
    if (!is_type_1.isPayload(rawPayload)) {
        return null;
    }
    var roomId = rawPayload.from_user;
    var content = rawPayload.content;
    if (!is_type_1.isRoomId(roomId)) {
        return null;
    }
    var matchesForOther = [];
    var matchesForYou = [];
    ROOM_TOPIC_OTHER_REGEX_LIST.some(function (regex) { return !!(matchesForOther = content.match(regex)); });
    ROOM_TOPIC_YOU_REGEX_LIST.some(function (regex) { return !!(matchesForYou = content.match(regex)); });
    var matches = matchesForOther || matchesForYou;
    if (!matches) {
        return null;
    }
    var changerName = matches[1];
    var topic = matches[2];
    if (matchesForYou && changerName === '你' || changerName === 'You') {
        changerName = wechaty_puppet_1.YOU;
    }
    var roomTopicEvent = {
        changerName: changerName,
        roomId: roomId,
        topic: topic
    };
    return roomTopicEvent;
}
exports.roomTopicEventMessageParser = roomTopicEventMessageParser;
