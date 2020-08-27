import { ExtensionContext, commands, window, workspace } from 'vscode'
import Provider from './Provider'

// 激活插件
export function activate(context: ExtensionContext) {
	console.log('start');

	// 获取interval配置
	let interval = workspace.getConfiguration().get('pig-watch.interval', 2)
	if (interval < 2) {
		interval = 2
	}
	// 基金类
	const provider = new Provider();
	// 数据注册
	window.registerTreeDataProvider('pig-list', provider)
	// 定时更新
	setInterval(() => {
		provider.refresh()
	}, interval * 1000)
	// 事件
	context.subscriptions.push(
		commands.registerCommand('pig.refresh', () => {
			provider.refresh();
		}),
		commands.registerCommand('pig.add', () => {
			provider.add();
		}),
		commands.registerCommand('pig.item.remove', (item) => {
			const { code } = item;
			provider.removeConfig(code)
			provider.refresh();
		}),
	)
}

// this method is called when your extension is deactivated
export function deactivate() { }
