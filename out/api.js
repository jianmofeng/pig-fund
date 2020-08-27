"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
// import { resolve } from 'path';
// 发起GET请求
const request = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let chunks = '';
            if (!res || res.statusCode !== 200) {
                reject(new Error('网络请求错误'));
                return;
            }
            res.on('data', (chunk) => chunks += chunk.toString('utf8'));
            res.on('end', () => resolve(chunks));
        });
    });
});
// 根据基金代码请求数据
function pigApi(codes) {
    const time = Date.now();
    // 请求列表
    const promises = codes.map(code => {
        const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`;
        return request(url);
    });
    return Promise.all(promises).then(results => {
        const resultArr = [];
        results.forEach((rsp) => {
            const match = rsp.match(/jsonpgz\((.+)\)/);
            if (!match || !match[1]) {
                return;
            }
            const str = match[1];
            const obj = JSON.parse(str);
            const info = {
                // 当前估值
                now: obj.gsz,
                // 基金名称
                name: obj.name,
                // 基金代码
                code: obj.fundcode,
                // 昨日净值
                lastClose: obj.dwjz,
                // 涨跌幅
                changeRate: obj.gszzl,
                // 涨跌额
                changeAmount: (obj.gsz - obj.dwjz).toFixed(4)
            };
            resultArr.push(info);
        });
        return resultArr;
    });
    // results.for
}
exports.default = pigApi;
//# sourceMappingURL=api.js.map