"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const Provider_1 = require("./Provider");
// 激活插件
function activate(context) {
    console.log('start');
    // 获取interval配置
    let interval = vscode_1.workspace.getConfiguration().get('pig-watch.interval', 2);
    if (interval < 2) {
        interval = 2;
    }
    // 基金类
    const provider = new Provider_1.default();
    // 数据注册
    vscode_1.window.registerTreeDataProvider('pig-list', provider);
    // 定时更新
    setInterval(() => {
        provider.refresh();
    }, interval * 1000);
    // 事件
    context.subscriptions.push(vscode_1.commands.registerCommand('pig.refresh', () => {
        provider.refresh();
    }), vscode_1.commands.registerCommand('pig.add', () => {
        provider.add();
    }), vscode_1.commands.registerCommand('pig.item.remove', (item) => {
        const { code } = item;
        provider.removeConfig(code);
        provider.refresh();
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map