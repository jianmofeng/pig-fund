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
const vscode_1 = require("vscode");
const api_1 = require("./api");
const TreeItem_1 = require("./TreeItem");
class DataProvider {
    constructor() {
        this.refreshEvent = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.refreshEvent.event;
        this.order = -1;
    }
    refresh() {
        // 更新视图
        setTimeout(() => {
            this.refreshEvent.fire(null);
        }, 200);
    }
    add() {
        return __awaiter(this, void 0, void 0, function* () {
            // 弹出输入框
            const res = yield vscode_1.window.showInputBox({
                value: '',
                valueSelection: [5, -1],
                prompt: '添加基金自选',
                placeHolder: 'Add Fund To Favorite',
                validateInput: (inputCode) => {
                    const costArray = inputCode.split(/[\W]/);
                    const hasError = costArray.some((code) => {
                        return code !== '' && !/^\d+$/.test(code);
                    });
                    return hasError ? '基金代码输入有误' : null;
                }
            });
            if (!!res) {
                const codeArray = res.split(/[\W]/) || [];
                const result = yield api_1.default([...codeArray]);
                if (result && result.length > 0) {
                    // 只更新能正常请求的代码
                    const codes = result.map(i => i.code);
                    this.updateConfig(codes);
                    this.refresh();
                }
                else {
                    vscode_1.window.showWarningMessage('stocks not found');
                }
            }
        });
    }
    updateConfig(pigs) {
        const config = vscode_1.workspace.getConfiguration();
        const favorites = Array.from(new Set([
            ...config.get('pig-watch.favorites', []),
            ...pigs,
        ]));
        config.update('pig-watch.favorites', favorites, true);
    }
    removeConfig(code) {
        const config = vscode_1.workspace.getConfiguration();
        const favorites = [...config.get('pig-watch.favorites', [])];
        const index = favorites.indexOf(code);
        if (index === -1) {
            return;
        }
        favorites.splice(index, 1);
        config.update('pig-watch.favorites', favorites, true);
    }
    getTreeItem(info) {
        // 展示名称和涨跌幅
        return new TreeItem_1.default(info);
    }
    getChildren() {
        const { order } = this;
        // 获取配置的基金代码
        // console.log('config', workspace.getConfiguration());
        const favorites = vscode_1.workspace.getConfiguration()
            .get('pig-watch.favorites', []);
        return api_1.default([...favorites]).then((results) => results.sort((prev, next) => (prev.changeRate >= next.changeRate ? 1 : -1) * order));
    }
}
exports.default = DataProvider;
//# sourceMappingURL=Provider.js.map