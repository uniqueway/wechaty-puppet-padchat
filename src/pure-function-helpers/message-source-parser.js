"use strict";
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
var config_1 = require("../config");
var xml_to_json_1 = require("./xml-to-json");
var PRE = 'messageSourceParser';
function messageSourceParser(messageSource) {
    return __awaiter(this, void 0, void 0, function () {
        var tryXmlText, jsonPayload, data, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (messageSource === '') {
                        return [2 /*return*/, null];
                    }
                    tryXmlText = ("<?xml version=\"1.0\"?>\n" + messageSource).replace(/^[^\n]+\n/, '');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, xml_to_json_1.xmlToJson(tryXmlText)];
                case 2:
                    jsonPayload = _a.sent();
                    data = jsonPayload.msgsource;
                    result = {};
                    if (data.silence) {
                        result.silence = data.silence === '1';
                    }
                    if (data.membercount) {
                        result.memberCount = parseInt(data.membercount, 10);
                    }
                    if (data.img_file_name) {
                        result.imageFileName = data.img_file_name;
                    }
                    if (data.atuserlist) {
                        result.atUserList = data.atuserlist.split(',');
                    }
                    return [2 /*return*/, result];
                case 3:
                    e_1 = _a.sent();
                    config_1.log.verbose(PRE, "parse message source failed, failed message source is: " + messageSource);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.messageSourceParser = messageSourceParser;
