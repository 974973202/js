// - 题目：输入一个字符串，打印出该字符串中，所有字符的排列组合
// - 输入：'abc'
// - 输出：['abc', 'acb', 'bca', 'bac', 'cab', 'cba']

/**
 * 利用回溯算法，计算所有字符串的组合
 * @param {array} list - 字符串列表
 * @param {array} result - 最终的结果
 * @param {string} current - 当前的字符串
 * @param {string} temp - 当前固定的字符
*/
function stringGroup(list = [], result = [], current = "", temp = "") {
    current += temp;
    if (list.length === 0) {
        // 递归的出口，将对应结果添加到list中
        return result.push(current);
    }
    for (let i = 0; i < list.length; i++) {
        // 每次递归 固定第一个字符
        temp = list.shift();
        stringGroup(list, result, current, temp);
        // 将删除的temp重新添加到queue尾部，实现将数组反转的效果，如[a,b,c]反转为[c,b,a]
        list.push(temp);
    }
    // 这里去重是解决str中有重复的字母，比如str为'aacd'
    return [...new Set(result)];
}