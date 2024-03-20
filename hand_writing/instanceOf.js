// ES6  new.target是instanceof的改进
// 1.判断一个实例是否属于某种类型 
// 2.在继承关系中用来判断一个实例是否属于它的父类型

/**
 * 模仿实现 instanceof
 * @param   left  [左侧参数为一个实例对象]
 * @param   right [右侧为要判断的构造器函数]
 * @return  [true / false]
 */
function myinstanceof(left, right) {
    let right = right.prototype; // 获取目标原型对象 /取 right 的显示原型

    left = left.__proto__; // left 实例  right 构造函数
    // 判断对象的类型是否等于类型的原型
    while (true) {
        if (left === null) return false;
        if(left === right) return true;
        left = left.__proto__
    }
}