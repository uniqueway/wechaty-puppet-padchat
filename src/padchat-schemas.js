"use strict";
exports.__esModule = true;
// 1 when use WXSyncContact, 0 when use WXGetContact
var PadchatContactRoomStatus;
(function (PadchatContactRoomStatus) {
    PadchatContactRoomStatus[PadchatContactRoomStatus["Get"] = 0] = "Get";
    PadchatContactRoomStatus[PadchatContactRoomStatus["Sync"] = 1] = "Sync";
})(PadchatContactRoomStatus = exports.PadchatContactRoomStatus || (exports.PadchatContactRoomStatus = {}));
var PadchatRoomMemberStatus;
(function (PadchatRoomMemberStatus) {
    PadchatRoomMemberStatus[PadchatRoomMemberStatus["Zero"] = 0] = "Zero";
    PadchatRoomMemberStatus[PadchatRoomMemberStatus["Todo"] = 1] = "Todo";
})(PadchatRoomMemberStatus = exports.PadchatRoomMemberStatus || (exports.PadchatRoomMemberStatus = {}));
var PadchatMessageMsgType;
(function (PadchatMessageMsgType) {
    PadchatMessageMsgType[PadchatMessageMsgType["Five"] = 5] = "Five";
})(PadchatMessageMsgType = exports.PadchatMessageMsgType || (exports.PadchatMessageMsgType = {}));
var PadchatMessageStatus;
(function (PadchatMessageStatus) {
    PadchatMessageStatus[PadchatMessageStatus["One"] = 1] = "One";
})(PadchatMessageStatus = exports.PadchatMessageStatus || (exports.PadchatMessageStatus = {}));
var PadchatStatus;
(function (PadchatStatus) {
    PadchatStatus[PadchatStatus["One"] = 1] = "One";
})(PadchatStatus = exports.PadchatStatus || (exports.PadchatStatus = {}));
var PadchatContactMsgType;
(function (PadchatContactMsgType) {
    PadchatContactMsgType[PadchatContactMsgType["Contact"] = 2] = "Contact";
    PadchatContactMsgType[PadchatContactMsgType["N11_2048"] = 2048] = "N11_2048";
})(PadchatContactMsgType = exports.PadchatContactMsgType || (exports.PadchatContactMsgType = {}));
var PadchatMsgType;
(function (PadchatMsgType) {
    PadchatMsgType[PadchatMsgType["N11_2048"] = 2048] = "N11_2048";
    PadchatMsgType[PadchatMsgType["N15_32768"] = 32768] = "N15_32768";
})(PadchatMsgType = exports.PadchatMsgType || (exports.PadchatMsgType = {}));
var PadchatContinue;
(function (PadchatContinue) {
    PadchatContinue[PadchatContinue["Done"] = 0] = "Done";
    PadchatContinue[PadchatContinue["Go"] = 1] = "Go";
})(PadchatContinue = exports.PadchatContinue || (exports.PadchatContinue = {}));
// 2 Female, 1 Male, 0 Not Known
// The same as ContactGender.
// export enum PadchatContactGender {
//   Unknown = 0,
//   Male    = 1,
//   Female ,
// }
var PadchatPayloadType;
(function (PadchatPayloadType) {
    PadchatPayloadType[PadchatPayloadType["Logout"] = -1] = "Logout";
    PadchatPayloadType[PadchatPayloadType["InvalidPadchatToken"] = -1111] = "InvalidPadchatToken";
    PadchatPayloadType[PadchatPayloadType["OnlinePadchatToken"] = -1112] = "OnlinePadchatToken";
    PadchatPayloadType[PadchatPayloadType["ExpirePadchatToken"] = -1113] = "ExpirePadchatToken";
})(PadchatPayloadType = exports.PadchatPayloadType || (exports.PadchatPayloadType = {}));
var WechatAppMessageType;
(function (WechatAppMessageType) {
    WechatAppMessageType[WechatAppMessageType["Text"] = 1] = "Text";
    WechatAppMessageType[WechatAppMessageType["Img"] = 2] = "Img";
    WechatAppMessageType[WechatAppMessageType["Audio"] = 3] = "Audio";
    WechatAppMessageType[WechatAppMessageType["Video"] = 4] = "Video";
    WechatAppMessageType[WechatAppMessageType["Url"] = 5] = "Url";
    WechatAppMessageType[WechatAppMessageType["Attach"] = 6] = "Attach";
    WechatAppMessageType[WechatAppMessageType["Open"] = 7] = "Open";
    WechatAppMessageType[WechatAppMessageType["Emoji"] = 8] = "Emoji";
    WechatAppMessageType[WechatAppMessageType["VoiceRemind"] = 9] = "VoiceRemind";
    WechatAppMessageType[WechatAppMessageType["ScanGood"] = 10] = "ScanGood";
    WechatAppMessageType[WechatAppMessageType["Good"] = 13] = "Good";
    WechatAppMessageType[WechatAppMessageType["Emotion"] = 15] = "Emotion";
    WechatAppMessageType[WechatAppMessageType["CardTicket"] = 16] = "CardTicket";
    WechatAppMessageType[WechatAppMessageType["RealtimeShareLocation"] = 17] = "RealtimeShareLocation";
    WechatAppMessageType[WechatAppMessageType["ChatHistory"] = 19] = "ChatHistory";
    WechatAppMessageType[WechatAppMessageType["MiniProgram"] = 33] = "MiniProgram";
    WechatAppMessageType[WechatAppMessageType["Transfers"] = 2000] = "Transfers";
    WechatAppMessageType[WechatAppMessageType["RedEnvelopes"] = 2001] = "RedEnvelopes";
    WechatAppMessageType[WechatAppMessageType["ReaderType"] = 100001] = "ReaderType";
})(WechatAppMessageType = exports.WechatAppMessageType || (exports.WechatAppMessageType = {}));
// export type MessageTypeName = 'TEXT' | 'IMAGE' | 'VOICE' | 'VERIFYMSG' | 'POSSIBLEFRIEND_MSG'
// | 'SHARECARD' | 'VIDEO' | 'EMOTICON' | 'LOCATION' | 'APP' | 'VOIPMSG' | 'STATUSNOTIFY'
// | 'VOIPNOTIFY' | 'VOIPINVITE' | 'MICROVIDEO' | 'SYSNOTICE' | 'SYS' | 'RECALLED'
// export type MessageTypeValue = 1 | 3 | 34 | 37 | 40 | 42 | 43 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 62 | 9999 | 10000 | 10002
// export interface WebMsgTypeDict {
//   [index: string]: string|number,
//   //   MessageTypeName:  MessageTypeValue
//   // , MessageTypeValue: MessageTypeName
// }
// /**
//  *
//  * Enum for AppMsgType values.
//  *
//  * @enum {number}
//  * @property {number} TEXT                    - AppMsgType.TEXT                     (1)      for TEXT
//  * @property {number} IMG                     - AppMsgType.IMG                      (2)      for IMG
//  * @property {number} AUDIO                   - AppMsgType.AUDIO                    (3)      for AUDIO
//  * @property {number} VIDEO                   - AppMsgType.VIDEO                    (4)      for VIDEO
//  * @property {number} URL                     - AppMsgType.URL                      (5)      for URL
//  * @property {number} ATTACH                  - AppMsgType.ATTACH                   (6)      for ATTACH
//  * @property {number} OPEN                    - AppMsgType.OPEN                     (7)      for OPEN
//  * @property {number} EMOJI                   - AppMsgType.EMOJI                    (8)      for EMOJI
//  * @property {number} VOICE_REMIND            - AppMsgType.VOICE_REMIND             (9)      for VOICE_REMIND
//  * @property {number} SCAN_GOOD               - AppMsgType.SCAN_GOOD                (10)     for SCAN_GOOD
//  * @property {number} GOOD                    - AppMsgType.GOOD                     (13)     for GOOD
//  * @property {number} EMOTION                 - AppMsgType.EMOTION                  (15)     for EMOTION
//  * @property {number} CARD_TICKET             - AppMsgType.CARD_TICKET              (16)     for CARD_TICKET
//  * @property {number} REALTIME_SHARE_LOCATION - AppMsgType.REALTIME_SHARE_LOCATION  (17)     for REALTIME_SHARE_LOCATION
//  * @property {number} TRANSFERS               - AppMsgType.TRANSFERS                (2e3)    for TRANSFERS
//  * @property {number} RED_ENVELOPES           - AppMsgType.RED_ENVELOPES            (2001)   for RED_ENVELOPES
//  * @property {number} READER_TYPE             - AppMsgType.READER_TYPE              (100001) for READER_TYPE
//  */
// export enum PadchatAppMsgType {
//   TEXT                     = 1,
//   IMG                      = 2,
//   AUDIO                    = 3,
//   VIDEO                    = 4,
//   URL                      = 5,
//   ATTACH                   = 6,
//   OPEN                     = 7,
//   EMOJI                    = 8,
//   VOICE_REMIND             = 9,
//   SCAN_GOOD                = 10,
//   GOOD                     = 13,
//   EMOTION                  = 15,
//   CARD_TICKET              = 16,
//   REALTIME_SHARE_LOCATION  = 17,
//   TRANSFERS                = 2e3,
//   RED_ENVELOPES            = 2001,
//   READER_TYPE              = 100001,
// }
/**
 *
 * Enum for MsgType values.
 * @enum {number}
 * @property {number} TEXT                - MsgType.TEXT                (1)     for TEXT
 * @property {number} IMAGE               - MsgType.IMAGE               (3)     for IMAGE
 * @property {number} VOICE               - MsgType.VOICE               (34)    for VOICE
 * @property {number} VERIFYMSG           - MsgType.VERIFYMSG           (37)    for VERIFYMSG
 * @property {number} POSSIBLEFRIEND_MSG  - MsgType.POSSIBLEFRIEND_MSG  (40)    for POSSIBLEFRIEND_MSG
 * @property {number} SHARECARD           - MsgType.SHARECARD           (42)    for SHARECARD
 * @property {number} VIDEO               - MsgType.VIDEO               (43)    for VIDEO
 * @property {number} EMOTICON            - MsgType.EMOTICON            (47)    for EMOTICON
 * @property {number} LOCATION            - MsgType.LOCATION            (48)    for LOCATION
 * @property {number} APP                 - MsgType.APP                 (49)    for APP         | File, Media Link
 * @property {number} VOIPMSG             - MsgType.VOIPMSG             (50)    for VOIPMSG
 * @property {number} STATUSNOTIFY        - MsgType.STATUSNOTIFY        (51)    for STATUSNOTIFY
 * @property {number} VOIPNOTIFY          - MsgType.VOIPNOTIFY          (52)    for VOIPNOTIFY
 * @property {number} VOIPINVITE          - MsgType.VOIPINVITE          (53)    for VOIPINVITE
 * @property {number} MICROVIDEO          - MsgType.MICROVIDEO          (62)    for MICROVIDEO
 * @property {number} SYSNOTICE           - MsgType.SYSNOTICE           (9999)  for SYSNOTICE
 * @property {number} SYS                 - MsgType.SYS                 (10000) for SYS         | Change Room Topic, Invite into Room, Kick Off from the room
 * @property {number} RECALLED            - MsgType.RECALLED            (10002) for RECALLED
 */
var PadchatMessageType;
(function (PadchatMessageType) {
    PadchatMessageType[PadchatMessageType["Text"] = 1] = "Text";
    PadchatMessageType[PadchatMessageType["Image"] = 3] = "Image";
    PadchatMessageType[PadchatMessageType["Voice"] = 34] = "Voice";
    PadchatMessageType[PadchatMessageType["VerifyMsg"] = 37] = "VerifyMsg";
    PadchatMessageType[PadchatMessageType["PossibleFriendMsg"] = 40] = "PossibleFriendMsg";
    PadchatMessageType[PadchatMessageType["ShareCard"] = 42] = "ShareCard";
    PadchatMessageType[PadchatMessageType["Video"] = 43] = "Video";
    PadchatMessageType[PadchatMessageType["Emoticon"] = 47] = "Emoticon";
    PadchatMessageType[PadchatMessageType["Location"] = 48] = "Location";
    PadchatMessageType[PadchatMessageType["App"] = 49] = "App";
    PadchatMessageType[PadchatMessageType["VoipMsg"] = 50] = "VoipMsg";
    PadchatMessageType[PadchatMessageType["StatusNotify"] = 51] = "StatusNotify";
    PadchatMessageType[PadchatMessageType["VoipNotify"] = 52] = "VoipNotify";
    PadchatMessageType[PadchatMessageType["VoipInvite"] = 53] = "VoipInvite";
    PadchatMessageType[PadchatMessageType["MicroVideo"] = 62] = "MicroVideo";
    PadchatMessageType[PadchatMessageType["SysNotice"] = 9999] = "SysNotice";
    PadchatMessageType[PadchatMessageType["Sys"] = 10000] = "Sys";
    PadchatMessageType[PadchatMessageType["Recalled"] = 10002] = "Recalled";
})(PadchatMessageType = exports.PadchatMessageType || (exports.PadchatMessageType = {}));
var PadchatEmojiType;
(function (PadchatEmojiType) {
    PadchatEmojiType[PadchatEmojiType["Unknown"] = 0] = "Unknown";
    PadchatEmojiType[PadchatEmojiType["Static"] = 1] = "Static";
    PadchatEmojiType[PadchatEmojiType["Dynamic"] = 2] = "Dynamic";
})(PadchatEmojiType = exports.PadchatEmojiType || (exports.PadchatEmojiType = {}));
