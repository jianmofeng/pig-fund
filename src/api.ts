import * as https from 'https';
// import { resolve } from 'path';

// 发起GET请求
const request = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let chunks = '';
            if (!res || res.statusCode !== 200) {
                reject(new Error('网络请求错误'));
                return;
            }
            res.on('data', (chunk) => chunks += chunk.toString('utf8'));
            res.on('end', () => resolve(chunks))
        })
    })
}
// 根据基金代码请求数据
export default function pigApi(codes: string[]): Promise<PigInfo[]> {
    const time = Date.now();
    // 请求列表
    const promises: Promise<string>[] = codes.map(code => {
        const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`;
        return request(url)
    })
    return Promise.all(promises).then(results => {
        const resultArr: PigInfo[] = [];
        results.forEach((rsp: string) => {
            const match = rsp.match(/jsonpgz\((.+)\)/);
            if (!match || !match[1]) {
                return;
            }
            const str = match[1];
            const obj = JSON.parse(str);
            const info: PigInfo = {
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
            }
            resultArr.push(info)
        })
        return resultArr;
    })

    // results.for
}