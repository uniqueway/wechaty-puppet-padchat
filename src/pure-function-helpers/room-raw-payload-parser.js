"use strict";
exports.__esModule = true;
function roomRawPayloadParser(rawPayload) {
    var payload = {
        id: rawPayload.user_name,
        memberIdList: rawPayload.member || [],
        ownerId: rawPayload.chatroom_owner,
        topic: rawPayload.nick_name
    };
    return payload;
}
exports.roomRawPayloadParser = roomRawPayloadParser;
