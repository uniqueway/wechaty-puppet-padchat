"use strict";
exports.__esModule = true;
function splitChineseNameList(nameListText) {
    // 李卓桓、李佳芮、桔小秘
    return nameListText.split('、');
}
exports.splitChineseNameList = splitChineseNameList;
function splitEnglishNameList(nameListText) {
    // Zhuohuan, 太阁_传话助手, 桔小秘
    return nameListText.split(', ');
}
exports.splitEnglishNameList = splitEnglishNameList;
