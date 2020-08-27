"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = exports.fillString = void 0;
const stringWidth = require("string-width");
/**
 * 字符串长度拼接
 * @param source 原字符串长度
 * @param length 修改后的字符串长度
 * @param left 原字符串是否靠左边
 */
function fillString(source, length, left = true) {
    let rest = source;
    while (stringWidth(rest) >= length) {
        rest = rest.slice(0, rest.length - 1);
    }
    const addString = '  '.repeat(length - stringWidth(rest));
    return left ? `${rest}${addString}` : `${addString}${rest}`;
}
exports.fillString = fillString;
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
//# sourceMappingURL=utils.js.map