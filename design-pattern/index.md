javascript 动态类型语言 弱类型语言 
鸭子类型：只关注对象的行为，而不关注对象本身

### 多态
var makeSound = function ( animal ) {
  animal.sound();
}

var Dog = function () {};
Dog.prototype.sound = function () {
  console.log('dog')
}

var Chicken = function () {};
Chicken.prototype.sound = function () {
  console.log('Chicken')
}

makeSound( new Dog() )
makeSound( new Chicken() )