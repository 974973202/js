//Array.group就是将原数组，按照数组元素中的某个属性进行分类，
// 例如[{name:'dzc',province:'shandong'},{name:'wx',province:'hebei'},{name:'dzc12',province:'shandong'}]按照province分类，
// 那结果就是 {shandong:[{name:'dzc',province:'shandong'},{name:'dzc12',province:'shandong'}], hebing:[{name:'wx',province:'hebei'}]}
//其实原生的group函数比较复杂，支持的入参也很多，这里我们实现的逻辑

// fn是(element,index,array)=>{}样式的回调函数，它需要返回一个string,这个string就表示当前这个元素属于什么类别
Array.prototype._group = function (fn) {
    const result = {}
    for (let index = 0; index < this.length; index++) {
        const element = this[index];
        //获取当前元素的分类
        const category = fn(element, index, this)
        // 判断这个分类是否存在
        if (result[category]) {
            //分类已存在就push进去
            result[category].push(element)
        } else {
            // 分类不存在就创建一个
            result[category] = [element]  //[element] 将该条数据放进数组
        }
    }
    return result
}

//使用

const orderList = [{
    nickName: 'steven',
    productName: '西瓜',
    price: 29,
    province: 'henan',
}, {
    nickName: '对方的',
    productName: '杨梅',
    price: 22,
    province: 'shanxi',
}, {
    nickName: '范电池',
    productName: '苹果',
    price: 19,
    province: 'dongbei',
}, {
    nickName: '调查v',
    productName: '桃子',
    price: 88,
    province: 'shanxi',
}, {
    nickName: '2号',
    productName: '桃子',
    price: 88,
    province: 'shanxi',
}]

const group = orderList._group(({ province }) => province)
console.log(group)