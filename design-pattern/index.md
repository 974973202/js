javascript 动态类型语言 弱类型语言 
鸭子类型：只关注对象的行为，而不关注对象本身

## 设计模式原则
- 单一职责原则
> 一个程序只做好一件事
> 如果功能过于复杂就拆分开，每个部分保持独立

- 开放/封闭原则
> 对扩展开放，对修改封闭
> 增加需求时，扩展新代码，而非修改已有代码

- 里氏替换原则
> 子类能覆盖父类
> 父类能出现的地方子类就能出现

- 接口隔离原则
> 保持接口的单一独立
> 类似单一职责原则，这里更关注接口

- 依赖倒转原则
> 面向接口编程，依赖于抽象而不依赖于具体
> 使用方只关注接口而不关注具体类的实现

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

### 代理模式
小明送花 - 中转站处理
```
//虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建
var Flower = function () {}

var B = {
  receiveFlower: function (flower) {
    A.listenGoodMood(function () {
      var flower = new Flower()
      A.receiveFlower(flower)
    })
  }
}

var A = {
  receiveFlower: function (flower) {
    console.log('收到花 ' + flower)
  },
  listenGoodMood: function (fn) {
    setTimeout(function () {
      //假设10s后A的心情变好
      fn()
    }, 10000)
  }
}
```
- 用高阶函数动态创建代理
```
/**************** *****************/ 
  var mult = function() {
    var a = 1; 
    for ( var i = 0, l = arguments.length; i < l; i++ ) { 
      a = a * arguments[i]; 
    } 
    return a; 
  }; 

/**************** *****************/ 
  var plus = function(){ 
    var a = 0; 
    for ( var i = 0, l = arguments.length; i < l; i++ ) { 
      a = a + arguments[i]; 
    } 
    return a; 
  }; 
/**************** *****************/ 
  var createProxyFactory = function( fn ) { 
    var cache = {}; 
    return function() { 
      var args = Array.prototype.join.call( arguments, ',' ); 
      if ( args in cache ) {
        return cache[ args ]; 
      } 
      return cache[ args ] = fn.apply( this, arguments ); 
    } 
  }; 
  var proxyMult = createProxyFactory( mult ), 
  proxyPlus = createProxyFactory( plus ); 

```

### 迭代器模式

### 发布-订阅模式
```
  var salesOffices = {} //定义售楼处
  salesOffices.clientList = [] //缓存列表，存放订阅者的回调函数
  salesOffices.listen = function (fn) {
    //增加订阅者
    this.clientList.push(fn)
  }

  salesOffices.trigger = function () {
    //发布消息
    for (var i = 0, fn; fn = this.clientList[i]; i++) {
      fn.apply(this, arguments) //arguments是发布消息时带上的参数
    }
  }
  //测试
  salesOffices.listen(function (price, squareMeter) {
    console.log('价格= ' + price)
    console.log('squareMeter= ' + squareMeter)
  })
  salesOffices.listen(function (price, squareMeter) {
    console.log('价格= ' + price)
    console.log('squareMeter= ' + squareMeter)
  })
  salesOffices.trigger(20000000, 88)
```
```
  var dep = {
    event: [],
    listen: function (fn) {
      this.event.push(fn)
    },
    trigger: function () {
      for (let i = 0; i < this.event.length; i++) {
        this.event[i].apply(this, arguments)
      }
    }
  }

  dep.listen(function (price, squareMeter) {
    console.log('价格= ' + price)
    console.log('squareMeter= ' + squareMeter)
  })

  dep.trigger(20000000, 88)
```

### 命令模式

### 组合模式

