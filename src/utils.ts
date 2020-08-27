// import * as stringWidth from 'string-width'

/**
 * 字符串长度拼接
 * @param source 原字符串长度
 * @param length 修改后的字符串长度
 * @param left 原字符串是否靠左边
 */
// export function fillString(
//     source: string,
//     length: number,
//     left = true
// ): string {
//     let rest = source
//     while (stringWidth(rest) >= length) {
//         rest = rest.slice(0, rest.length - 1)
//     }
//     const addString = '  '.repeat(length - stringWidth(rest))
//     return left ? `${rest}${addString}` : `${addString}${rest}`
// }

// export function unique(arr: any[]) {
//     return Array.from(new Set(arr))
// }