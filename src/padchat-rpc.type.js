"use strict";
exports.__esModule = true;
var WXCheckQRCodeStatus;
(function (WXCheckQRCodeStatus) {
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["Ignore"] = -2] = "Ignore";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["Unknown"] = -1] = "Unknown";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["WaitScan"] = 0] = "WaitScan";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["WaitConfirm"] = 1] = "WaitConfirm";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["Confirmed"] = 2] = "Confirmed";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["Timeout"] = 3] = "Timeout";
    WXCheckQRCodeStatus[WXCheckQRCodeStatus["Cancel"] = 4] = "Cancel";
})(WXCheckQRCodeStatus = exports.WXCheckQRCodeStatus || (exports.WXCheckQRCodeStatus = {}));
var WXSearchContactTypeStatus;
(function (WXSearchContactTypeStatus) {
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["Searchable"] = 0] = "Searchable";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["UnSearchable"] = -24] = "UnSearchable";
})(WXSearchContactTypeStatus = exports.WXSearchContactTypeStatus || (exports.WXSearchContactTypeStatus = {}));
var WXRoomAddTypeStatus;
(function (WXRoomAddTypeStatus) {
    WXRoomAddTypeStatus[WXRoomAddTypeStatus["Done"] = 0] = "Done";
    WXRoomAddTypeStatus[WXRoomAddTypeStatus["NeedInvite"] = -2012] = "NeedInvite";
    WXRoomAddTypeStatus[WXRoomAddTypeStatus["InviteConfirm"] = -2028] = "InviteConfirm";
})(WXRoomAddTypeStatus = exports.WXRoomAddTypeStatus || (exports.WXRoomAddTypeStatus = {}));
/**
 * Raw type info:
 * see more inhttps://ymiao.oss-cn-shanghai.aliyuncs.com/apifile.txt
 * 2  - 通过搜索邮箱
 * 3  - 通过微信号搜索
 * 5  - 通过朋友验证消息
 * 7  - 通过朋友验证消息(可回复)
 * 12 - 通过QQ好友添加
 * 14 - 通过群来源
 * 15 - 通过搜索手机号
 * 16 - 通过朋友验证消息
 * 17 - 通过名片分享
 * 22 - 通过摇一摇打招呼方式
 * 25 - 通过漂流瓶
 * 30 - 通过二维码方式
 */
(function (WXSearchContactTypeStatus) {
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["EMAIL"] = 2] = "EMAIL";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["WXID"] = 3] = "WXID";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["VERIFY_NOREPLY"] = 5] = "VERIFY_NOREPLY";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["VERIFY_REPLY"] = 7] = "VERIFY_REPLY";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["QQ"] = 12] = "QQ";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["ROOM"] = 14] = "ROOM";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["MOBILE"] = 15] = "MOBILE";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["VERIFY"] = 16] = "VERIFY";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["CONTACT"] = 17] = "CONTACT";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["SHAKE"] = 22] = "SHAKE";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["FLOAT"] = 25] = "FLOAT";
    WXSearchContactTypeStatus[WXSearchContactTypeStatus["QRCODE"] = 30] = "QRCODE";
})(WXSearchContactTypeStatus = exports.WXSearchContactTypeStatus || (exports.WXSearchContactTypeStatus = {}));
