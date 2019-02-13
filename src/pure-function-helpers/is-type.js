"use strict";
exports.__esModule = true;
function isRoomId(id) {
    if (!id) {
        // throw new Error('no id')
        return false;
    }
    return /@chatroom$/.test(id);
}
exports.isRoomId = isRoomId;
function isContactId(id) {
    if (!id) {
        return false;
        // throw new Error('no id')
    }
    return !isRoomId(id);
}
exports.isContactId = isContactId;
function isContactOfficialId(id) {
    if (!id) {
        return false;
        // throw new Error('no id')
    }
    return /^gh_/i.test(id);
}
exports.isContactOfficialId = isContactOfficialId;
function isStrangerV1(strangerId) {
    if (!strangerId) {
        return false;
        // throw new Error('no id')
    }
    return /^v1_/i.test(strangerId);
}
exports.isStrangerV1 = isStrangerV1;
function isStrangerV2(strangerId) {
    if (!strangerId) {
        return false;
        // throw new Error('no id')
    }
    return /^v2_/i.test(strangerId);
}
exports.isStrangerV2 = isStrangerV2;
function isPayload(payload) {
    if (payload
        && Object.keys(payload).length > 0) {
        return true;
    }
    return false;
}
exports.isPayload = isPayload;
