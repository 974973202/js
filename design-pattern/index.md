javascript 动态类型语言 弱类型语言 
鸭子类型：只关注对象的行为，而不关注对象本身

### 多态
```
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
```

### 单例模式
保证一个类仅有一个实例，并提供一个访问它的全局访问点。
- 惰性单例 动态创建dom，比如弹框等等，减少初始时dom的创建

### 策略模式
> 策略模式指的是定义一系列的算法，把它们一个个封装起来。
> (将不变的部分和变化的部分隔开来是每个设计模式的主题)
> 策略模式的目的就是将算法的使用与算法的实现分离开来 
```
  var performanceS = function () {
  }
  performanceS.prototype.calculate = function (salary) {
      return salary * 4
  }

  var performanceA = function () {
  }
  performanceA.prototype.calculate = function (salary) {
      return salary * 3
  }

  var performanceB = function () {
  }
  performanceB.prototype.calculate = function (salary) {
      return salary * 2
  }

  //定义奖金类
  var Bonus = function () {
      this.salary = null
      this.strategy = null // 绩效等级对应的策略对象
  }
  Bonus.prototype.setSalary = function (salary) {
      this.salary = salary
  }
  Bonus.prototype.setStrategy = function (strategy) {
      //设置员工绩效等级对应的策略模式
      this.strategy = strategy
  }
  Bonus.prototype.getBonus = function () {
      return this.strategy.calculate(this.salary)
  }
  var bonus = new Bonus()
  bonus.setSalary(1000)
  bonus.setStrategy(new performanceS())
  console.log(bonus.getBonus())
```

