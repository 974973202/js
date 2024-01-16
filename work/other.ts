/**
 * 递归遍历树形结构数据或数组数据
 * @param treeDatas 树形数据或数组数据
 * @param callback Function
 */
const enhanceVisitTree = <T extends { [key: string]: any }>(
    treeDatas: T[],
    callback: (treeData: T) => void,
    key?: string,
) => {
    if (Array.isArray(treeDatas) && treeDatas.length > 0) {
        for (const treeData of treeDatas) {
            callback(treeData);
            if (Array.isArray(treeData[key ?? 'children']) && treeData[key ?? 'children'].length > 0) {
                enhanceVisitTree(treeData[key ?? 'children'], callback, key);
            } else if (treeData[key ?? 'children'] && !Array.isArray(treeData[key ?? 'children'])) {
                enhanceVisitTree([treeData[key ?? 'children']], callback, key);
            }
        }
    } else if (!Array.isArray(treeDatas)) {
        enhanceVisitTree([treeDatas], callback, key);
    }
};

/**
 * 默认万元单位的转化，整数千分位
 * @param text 数值
 * @param digit 自定义小数位数，默认两位
 * @returns string
 */
const c_formatDigitTransfer = (text: string | number | any, digit?: number) => {
    if (text === 0 || text === '0') return 0;
    if (!text) return '-';
    return (Number(text) / 10000).toLocaleString('en', {
        maximumFractionDigits: digit ?? c_formatDigit ?? 2,
        minimumFractionDigits: digit ?? c_formatDigit ?? 2,
    });
};

/**
 * 整数千分位处理
 * @param text 数值
 * @param digit 自定义小数位数，默认两位
 * @returns string
 */
const c_formatDigitthousandth = (text: string | number | any, digit?: number) => {
    if (text === 0 || text === '0') return 0;
    if (!text) return '-';
    return Number(text).toLocaleString('en', {
        maximumFractionDigits: digit ?? c_formatDigit ?? 4,
        minimumFractionDigits: digit ?? c_formatDigit ?? 4,
    });
};

/**
 * 对带有小数的数值做千分位，小数后面保持不变
 * @param number 数值
 */
function c_formatDigitNumber(number: string | number | any) {
    if (number === null || number === undefined) return '-';
    // 将数值转换为字符串类型
    const str = number.toString();

    // 使用正则表达式将数值中的整数部分和小数部分分开
    const parts = str.split('.');

    // 对整数部分进行千分位处理
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // 将整数部分和小数部分重新拼接起来
    const result = parts.join('.');

    return result;
}