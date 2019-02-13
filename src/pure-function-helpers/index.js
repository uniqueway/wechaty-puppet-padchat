"use strict";
/**
 *
 * Pure Function Helpers
 *
 * Huan LI <zixia@zixia.net> https://github.com/zixia
 * License: Apache 2.0
 *
 * See: What's Pure Function Programming
 *  [Functional Programming Concepts: Pure Functions](https://hackernoon.com/functional-programming-concepts-pure-functions-cafa2983f757)
 *  [What Are Pure Functions And Why Use Them?](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c)
 *  [Master the JavaScript Interview: What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)
 *
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./message-app-payload-parser"));
__export(require("./compatible-wei-bug"));
__export(require("./contact-raw-payload-parser"));
__export(require("./file-box-to-qrcode"));
__export(require("./friendship-event-message-parser"));
__export(require("./friendship-raw-payload-parser"));
__export(require("./is-type"));
__export(require("./message-raw-payload-parser"));
__export(require("./message-file-name"));
__export(require("./padchat-decode"));
__export(require("./room-event-invite-message-parser"));
__export(require("./room-event-join-message-parser"));
__export(require("./room-event-leave-message-parser"));
__export(require("./room-event-topic-message-parser"));
__export(require("./room-raw-payload-parser"));
__export(require("./split-name"));
