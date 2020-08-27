import { workspace, TreeDataProvider, Event, EventEmitter, TreeItem, window } from 'vscode'
import pigApi from './api';
import PigItem from './TreeItem'

export default class DataProvider implements TreeDataProvider<PigInfo>{
    public refreshEvent: EventEmitter<PigInfo | null> = new EventEmitter<PigInfo | null>()

    readonly onDidChangeTreeData: Event<PigInfo | null> = this.refreshEvent.event

    private order: number

    constructor() {
        this.order = -1
    }

    refresh() {
        // 更新视图
        setTimeout(() => {
            this.refreshEvent.fire(null)
        }, 200);
    }
    async add() {
        // 弹出输入框
        const res = await window.showInputBox({
            value: '',
            valueSelection: [5, -1],
            prompt: '添加基金自选',
            placeHolder: 'Add Fund To Favorite',
            validateInput: (inputCode: string) => {
                const costArray = inputCode.split(/[\W]/);
                const hasError = costArray.some((code) => {
                    return code !== '' && !/^\d+$/.test(code);
                })
                return hasError ? '基金代码输入有误' : null;
            }
        })
        if (!!res) {
            const codeArray = res.split(/[\W]/) || [];
            const result = await pigApi([...codeArray]);
            if (result && result.length > 0) {
                // 只更新能正常请求的代码
                const codes = result.map(i => i.code);
                this.updateConfig(codes);
                this.refresh();
            } else {
                window.showWarningMessage('stocks not found');
            }
        }
    }
    updateConfig(pigs: string[]) {
        const config = workspace.getConfiguration();
        const favorites = Array.from(
            new Set([
                ...config.get('pig-watch.favorites', []),
                ...pigs,
            ])
        )
        config.update('pig-watch.favorites', favorites, true)
    }
    removeConfig(code: string) {
        const config = workspace.getConfiguration();
        const favorites: string[] = [...config.get('pig-watch.favorites', [])];
        const index = favorites.indexOf(code);
        if (index === -1) {
            return;
        }
        favorites.splice(index, 1);
        config.update('pig-watch.favorites', favorites, true)
    }
    getTreeItem(info: PigInfo): PigItem {
        // 展示名称和涨跌幅
        return new PigItem(info)
    }
    getChildren(): Promise<PigInfo[]> {
        const { order } = this;

        // 获取配置的基金代码
        // console.log('config', workspace.getConfiguration());
        const favorites: string[] = workspace.getConfiguration()
            .get('pig-watch.favorites', []);
        return pigApi([...favorites]).then(
            (results: PigInfo[]) => results.sort(
                (prev, next) => (prev.changeRate >= next.changeRate ? 1 : -1) * order
            )
        )
    }

}