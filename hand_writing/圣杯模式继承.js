//  圣杯模式
//  为了son继承father原型上的东西，还可以修改自己原型上的东西，对father原型不影响。
function inherit(Target, Origin) {
    function F() { };// 函数F作为一个中间层，上连father，下连Son，使两函数互不干扰
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    Target.prototype.constuctor = Target;
    // son原型归位
    Target.prototype.uber = Origin.prototype;
}