"use strict";
exports.__esModule = true;
var padchat_schemas_1 = require("../padchat-schemas");
function messageFileName(rawPayload) {
    if (rawPayload.sub_type === padchat_schemas_1.PadchatMessageType.Voice) {
        return rawPayload.msg_id + '.slk';
    }
    return rawPayload.msg_id + '-to-be-implement.txt';
}
exports.messageFileName = messageFileName;
