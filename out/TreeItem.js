"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// import { fillString } from './utils'
class FundItem extends vscode_1.TreeItem {
    constructor(info) {
        const rate = Number(info.changeRate);
        const icon = rate >= 0 ? '📈' : '📉';
        const prev = rate >= 0 ? '+' : '-';
        const rage = `${prev}${Math.abs(rate)}%`;
        const name = info.name; //fillString(info.name, 25)
        super(`${icon}${name} ${rage}`);
        let sliceName = info.name;
        if (sliceName.length > 8) {
            sliceName = `${sliceName.slice(0, 8)}...`;
        }
        const tips = [
            `代码:　${info.code}`,
            `名称:　${sliceName}`,
            `--------------------------`,
            `单位净值:　　　　${info.now}`,
            `涨跌幅:　　　　　${info.changeRate}%`,
            `涨跌额:　　　　　${info.changeAmount}`,
            `昨收:　　　　　　${info.lastClose}`,
        ];
        this.info = info;
        this.tooltip = tips.join('\r\n');
    }
}
exports.default = FundItem;
//# sourceMappingURL=TreeItem.js.map