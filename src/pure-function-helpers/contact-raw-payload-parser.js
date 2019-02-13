"use strict";
exports.__esModule = true;
var wechaty_puppet_1 = require("wechaty-puppet");
var is_type_1 = require("./is-type");
function contactRawPayloadParser(rawPayload) {
    if (!rawPayload.user_name) {
        /**
         * { big_head: '',
         *  city: '',
         *  country: '',
         *  intro: '',
         *  label: '',
         *  message: '',
         *  nick_name: '',
         *  provincia: '',
         *  py_initial: '',
         *  quan_pin: '',
         *  remark: '',
         *  remark_py_initial: '',
         *  remark_quan_pin: '',
         *  sex: 0,
         *  signature: '',
         *  small_head: '',
         *  status: 0,
         *  stranger: '',
         *  ticket: '',
         *  user_name: '' }
         */
        // console.log(rawPayload)
        throw Error('cannot get user_name from raw payload: ' + JSON.stringify(rawPayload));
    }
    if (is_type_1.isRoomId(rawPayload.user_name)) {
        throw Error('Room Object instead of Contact!');
    }
    var contactType = wechaty_puppet_1.ContactType.Unknown;
    if (is_type_1.isContactOfficialId(rawPayload.user_name)) {
        contactType = wechaty_puppet_1.ContactType.Official;
    }
    else {
        contactType = wechaty_puppet_1.ContactType.Personal;
    }
    var payload = {
        alias: rawPayload.remark,
        avatar: rawPayload.big_head,
        city: rawPayload.city,
        gender: rawPayload.sex,
        id: rawPayload.user_name,
        name: rawPayload.nick_name,
        province: rawPayload.provincia,
        signature: (rawPayload.signature).replace('+', ' '),
        type: contactType
    };
    return payload;
}
exports.contactRawPayloadParser = contactRawPayloadParser;
