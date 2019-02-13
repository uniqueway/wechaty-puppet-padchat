"use strict";
/**
 * A bug-compatible to Web-Socket Server provided by protocal holder
 */
exports.__esModule = true;
/**
 * WXCreateChatRoom() will get dirty chatroom Id.
 * function stripBugChatroomId can get a clean chatroom Id.
 * https://github.com/lijiarui/wechaty-puppet-padchat/issues/62
 *
 * WXCreateChatRoom result:
 * {"message":"\n\u0010Everything is OK","status":0,"user_name":"\n\u00135907139882@chatroom"}
 * BUG compitable: "\n\u00135907139882@chatroom" -> "5907139882@chatroom"
 * BUG compitable: "\n\u001412558026334@chatroom" -> "12558026334@chatroom"
 */
var wechaty_puppet_1 = require("wechaty-puppet");
function stripBugChatroomId(id) {
    if (!id) {
        return '';
    }
    return id.replace(/^\n[\u0000-\uffff]/g, '');
}
exports.stripBugChatroomId = stripBugChatroomId;
/**
 * Sometimes, using WXGetContact(id) cannot get result,
 * even if the id is bot it self
 *
 */
function generateFakeSelfBot(contactId) {
    return {
        big_head: 'http://www.botorange.com',
        city: 'Chatie',
        country: 'BotOrange',
        intro: '',
        label: '',
        nick_name: 'default padchat',
        provincia: '',
        py_initial: '',
        remark: '',
        remark_py_initial: '',
        remark_quan_pin: '',
        sex: wechaty_puppet_1.ContactGender.Unknown,
        signature: 'welcome to BotOrange',
        small_head: 'www.botorange.com',
        status: 0,
        user_name: contactId
    };
}
exports.generateFakeSelfBot = generateFakeSelfBot;
