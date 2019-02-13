"use strict";
exports.__esModule = true;
var wechaty_puppet_1 = require("wechaty-puppet");
var padchat_schemas_1 = require("../padchat-schemas");
function messageType(rawType) {
    var type;
    switch (rawType) {
        case padchat_schemas_1.PadchatMessageType.Text:
            type = wechaty_puppet_1.MessageType.Text;
            break;
        case padchat_schemas_1.PadchatMessageType.Image:
            type = wechaty_puppet_1.MessageType.Image;
            // console.log(rawPayload)
            break;
        case padchat_schemas_1.PadchatMessageType.Voice:
            type = wechaty_puppet_1.MessageType.Audio;
            // console.log(rawPayload)
            break;
        case padchat_schemas_1.PadchatMessageType.Emoticon:
            type = wechaty_puppet_1.MessageType.Emoticon;
            // console.log(rawPayload)
            break;
        case padchat_schemas_1.PadchatMessageType.App:
            type = wechaty_puppet_1.MessageType.Attachment;
            // console.log(rawPayload)
            break;
        case padchat_schemas_1.PadchatMessageType.Video:
            type = wechaty_puppet_1.MessageType.Video;
            // console.log(rawPayload)
            break;
        case padchat_schemas_1.PadchatMessageType.Sys:
            type = wechaty_puppet_1.MessageType.Unknown;
            break;
        case padchat_schemas_1.PadchatMessageType.ShareCard:
            type = wechaty_puppet_1.MessageType.Contact;
            break;
        case padchat_schemas_1.PadchatMessageType.Location:
            type = wechaty_puppet_1.MessageType.Location;
            break;
        case padchat_schemas_1.PadchatMessageType.VoipMsg:
        case padchat_schemas_1.PadchatMessageType.Recalled:
        case padchat_schemas_1.PadchatMessageType.StatusNotify:
        case padchat_schemas_1.PadchatMessageType.SysNotice:
            type = wechaty_puppet_1.MessageType.Unknown;
            break;
        default:
            throw new Error('unsupported type: ' + padchat_schemas_1.PadchatMessageType[rawType] + '(' + rawType + ')');
    }
    return type;
}
exports.messageType = messageType;
