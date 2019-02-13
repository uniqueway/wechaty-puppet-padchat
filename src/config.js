"use strict";
// tslint:disable:no-reference
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/// <reference path="./typings.d.ts" />
var promiseRetry = require("promise-retry");
var qr_image_1 = require("qr-image");
var file_box_1 = require("file-box");
var brolog_1 = require("brolog");
exports.log = brolog_1.log;
var WECHATY_PUPPET_PADCHAT_ENDPOINT_ENV_VAR = 'WECHATY_PUPPET_PADCHAT_ENDPOINT';
exports.WECHATY_PUPPET_PADCHAT_ENDPOINT = process.env[WECHATY_PUPPET_PADCHAT_ENDPOINT_ENV_VAR] || 'ws://padchat.botorange.com/wx';
exports.SELF_QRCODE_MAX_RETRY = 5;
exports.CON_TIME_OUT = 10000;
exports.RE_CON_RETRY = 6;
exports.RE_CON_INTERVAL = 5000;
exports.POST_LOGIN_API_CALL_INTERVAL = 100;
exports.MAX_HEARTBEAT_TIMEOUT = 3;
function padchatToken() {
    var token = process.env.WECHATY_PUPPET_PADCHAT_TOKEN;
    if (!token) {
        brolog_1.log.error('PuppetPadchatConfig', "\n\n      WECHATY_PUPPET_PADCHAT_TOKEN environment variable not found.\n\n      PuppetPadchat need a token before it can be used,\n      Please set WECHATY_PUPPET_PADCHAT_TOKEN then retry again.\n\n\n      Learn more about it at: https://github.com/Chatie/wechaty/issues/1296\n\n    ");
        throw new Error('You need a valid WECHATY_PUPPET_PADCHAT_TOKEN to use PuppetPadchat');
    }
    return token;
}
exports.padchatToken = padchatToken;
function retry(retryableFn) {
    return __awaiter(this, void 0, void 0, function () {
        var factor, minTimeout, maxTimeout, retries, retryOptions;
        return __generator(this, function (_a) {
            factor = 3;
            minTimeout = 10;
            maxTimeout = 20 * 1000;
            retries = 9;
            retryOptions = {
                factor: factor,
                maxTimeout: maxTimeout,
                minTimeout: minTimeout,
                retries: retries
            };
            return [2 /*return*/, promiseRetry(retryOptions, retryableFn)];
        });
    });
}
exports.retry = retry;
function qrCodeForChatie() {
    var CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5';
    var name = 'qrcode-for-chatie.png';
    var type = 'png';
    var qrStream = qr_image_1["default"].image(CHATIE_OFFICIAL_ACCOUNT_QRCODE, { type: type });
    return file_box_1.FileBox.fromStream(qrStream, name);
}
exports.qrCodeForChatie = qrCodeForChatie;
/**
 * VERSION
 */
var read_pkg_up_1 = require("read-pkg-up");
var pkg = read_pkg_up_1["default"].sync({ cwd: __dirname }).pkg;
exports.VERSION = pkg.version;
