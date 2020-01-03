javascript 动态类型语言 弱类型语言 
鸭子类型：只关注对象的行为，而不关注对象本身

## 设计模式原则
- 单一职责原则
> 一个程序只做好一件事
> 如果功能过于复杂就拆分开，每个部分保持独立
> 体现较多的设计模式 代理模式、迭代器模式、单例模式、装饰者模式

- 最少知识原则
> 体现较多的设计模式 中介者模式、外观模式

- 开放/封闭原则
> 对扩展开放，对修改封闭
> 增加需求时，扩展新代码，而非修改已有代码
> 1.可以放置挂钩 2.使用回调函数
> 体现较多的设计模式 发布-订阅模式、模板方法模式、策略模式、代理模式、职责链模式

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
var makeSound = function( animal ) {
  if( animal instanceof Duck ) {
    console.log('gagaga')
  } else if( animal instanceof Chicken ) {
    console.log('lololo')
  }
}
var Duck = function () {}
var Chicken = function () {}

makeSound( new Dog() )
makeSound( new Chicken() )
```
- 开闭原则拆分
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

// 添加动物叫声， 不用改原有的makeSound函数
var Duck = function() {}
Duck.prototype.sound = function() {
  console.log('gagaga')
}
makeSound( new Duck() )
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

### 职责链模式
- 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对
象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止
- 最大优点：请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之间
的强联系.
```
  //采用一种更灵活的方式，让各个节点可以灵活拆分和重组

  // 500元订单
  var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预定，得到100元优惠卷')
    } else {
      //我不知道下一个节点是谁，反正把请求往后传递
      return 'nextSuccessor'
    }
  }
  //200元订单
  var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200元定金预定，得到50元优惠卷')
    } else {
      //我不知道下一个节点是谁，反正把请求往后传递
      return 'nextSuccessor'
    }
  }
  //普通的购买订单
  var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买，无优惠卷');
    } else {
      console.log('手机库存不足');
    }
  }

  var Chain = function (fn) {
    this.fn = fn;
    this.successor = null
  }
  Chain.prototype.setNextSuccessor = function (successor) {
    return this.successor = successor
  }
  Chain.prototype.passRequest = function () {
    var ret = this.fn.apply(this, arguments)
    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
    return ret
  }

  var chainOrder500 = new Chain(order500)
  var chainOrder200 = new Chain(order200)
  var chainOrderNormal = new Chain(orderNormal)

  chainOrder500.setNextSuccessor(chainOrder200)
  chainOrder200.setNextSuccessor(chainOrderNormal)

  chainOrder500.passRequest(1, true, 500);
  chainOrder500.passRequest(3, true, 500);
  chainOrder500.passRequest(1, false, 0);
  //假如又想出了300元方案，我们就在该链中加一个节点即可
```
```
  //利用js的函数型特性,用一种更加方便的方法来创建职责链
  Function.prototype.after = function (fn) {
    var self = this
    return function () {
      var ret = self.apply(this, arguments)
      if (ret === 'nextSuccessor') {
        return fn.apply(this, arguments)
      }
    }
  }

  // 500元订单
  var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预定，得到100元优惠卷')
    } else {
      //我不知道下一个节点是谁，反正把请求往后传递
      return 'nextSuccessor'
    }
  }
  //200元订单
  var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200元定金预定，得到50元优惠卷')
    } else {
      //我不知道下一个节点是谁，反正把请求往后传递
      return 'nextSuccessor'
    }
  }
  //普通的购买订单
  var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买，无优惠卷');
    } else {
      console.log('手机库存不足');
    }
  }

  var order = order500.after(order200).after(orderNormal)

  order(1, true, 500)
  order(2, true, 500)
  order(1, false, 500)
```

### 中介者模式
- 中介者模式的作用就是解除对象与对象之间的紧耦合关系
- 以中介者和对象之间的一对多关系取代了对死昂之间的网状多对多关系
```
  function Player(name, teamColor) {
    this.name = name //角色名字
    this.teamColor = teamColor //队伍颜色
    this.state = 'alive'
  }
  Player.prototype.win = function () {
    console.log(this.name + ' win ')
  }
  Player.prototype.lose = function () {
    console.log(this.name + ' lost ')
  }
  Player.prototype.die = function () {
    this.state = 'dead'
    //给中介者发送消息，玩家死亡
    playerDirector.receiveMessage('playerDead', this)
  }
  Player.prototype.remove = function () {
    console.log(this.name + ' remove ')
    //给中介者发送消息，移除一个玩家
    playerDirector.receiveMessage('removePlayer', this)
  }
  Player.prototype.changeTeam = function (color) {
    playerDirector.receiveMessage('changeTeam', this, color)
  }

  //    实现中介者对象，一般有以下两种方法
  //    利用发布-订阅模式。将playerDirector实现为订阅者，各player作为发布者
  //    一旦player的状态改变，便推送消息给playerDirector，playerDirector处理消息后将反馈发送给其他player
  //
  //    在playerDirector中开放一些接收消息的接口，各player可以直接调用该接口来给
  //    playerDirector发送消息，player只需要传递一个参数给playerDirector，这个参数的目的是使
  //    playerDirector可以识别发送者，同样，playerDirector接收到信息之后会处理结果反馈给其他player

  var playerDirector = (function () {
    var players = {}, //保存所有玩家
      operations = {}

    operations.addPlayer = function (player) {
      var teamColor = player.teamColor;
      //如果该颜色的玩家还没有成立队伍，则成立一个队伍
      players[teamColor] = players[teamColor] || []
      //添加玩家进队伍
      players[teamColor].push(player)
    }
    operations.removePlayer = function (player) {
      var teamColor = player.teamColor,
        teamPlayers = players[teamColor] || []
      for (var i = teamPlayers.length - 1; i >= 0; i--) {
        if (teamPlayers[i] === player) {
          teamPlayers.splice(i, 1)
        }
      }
    }
    operations.changeTeam = function (player, newTeamColor) {
      operations.removePlayer(player) //从原来队伍中删除
      player.teamColor = newTeamColor //改变队伍颜色
      operations.addPlayer(player) //增加到队伍中
    }
    operations.playerDead = function (player) {
      var teamColor = player.teamColor,
        teamPlayers = players[teamColor] || []

      var all_dead = true

      for (var i = 0, player; player = teamPlayers[i]; i++) {
        if (player.state !== 'dead') {
          all_dead = false
          break
        }
      }

      if (all_dead) {
        for (var i = 0, player; player = teamPlayers[i]; i++) {
          //本队所有玩家lose
          player.lose()
        }
        for (var color in players) {
          if (color !== teamColor) {
            //其他队伍的玩家
            var otherTeamPlayers = players[color]
            for (var i = 0, player; player = otherTeamPlayers[i]; i++) {
              //其他队伍的所有玩家win
              player.win()
            }
          }
        }
      }
    }

    var receiveMessage = function () {
      //arguments的第一个参数为消息名称
      var message = Array.prototype.shift.call(arguments)
      operations[message].apply(this, arguments)
    }

    return {
      receiveMessage: receiveMessage
    }
  })()

  //工厂函数
  var playerFactory = function (name, teamColor) {
    var newPlayer = new Player(name, teamColor)
    playerDirector.receiveMessage('addPlayer', newPlayer)
    return newPlayer
  }

  //红队
  var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red');

  //蓝队
  var player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue');

  player1.changeTeam('blue');
  player2.remove();
  player3.die();
  player4.die();
```

### 装饰器模式
- 给对象动态地增加职责的方式称为装饰器(decorator)模式
- 装饰器模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责
- 跟继承相比，这是一种更轻便灵活的做法，这是一种‘即用即付’的方式
- 装饰器其实也是一种包装器(wrapper)
```
  var Plane = function () { }

  Plane.prototype.fire = function () {
    console.log('发射普通子弹')
  }
  
  //接下来增加两个装饰类，分别是导弹和原子弹
  var MissileDecorator = function (plane) {
    this.plane = plane
  }
  MissileDecorator.prototype.fire = function () {
    this.plane.fire()
    console.log('发射导弹')
  }

  var AtomDecorator = function (plane) {
    this.plane = plane;
  }
  AtomDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射原子弹');
  }
  //这种给对象动态增加职责的方式，并没有真正地改动对象自身，
  //而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，形成一个聚合对象

  var plane = new Plane()
  plane = new MissileDecorator(plane)
  plane = new AtomDecorator(plane)

  plane.fire()
```
很多时候我们不想去碰原函数,也许原函数是由其他同事编写的,里面的实现作常杂乱。甚至
在一个古老的顶目中，这个函数的源代码被隐藏在一个完美不愿碰触的阴暗角落里。
现在需要一个办法，在不改变函数源代码的情况下．能给函数增加功能．这正是开放一封闭
原则给我们指出的光明道路。
```
  var a = function () {
    console.log(1)
  }
  var _a = a;
  
  a = function () {
    _a()
    console.log(2)
  }
  a()
```
```
  //采取不污染原型的方式
  var before = function (fn, beforeFn) {
    return function () {
      beforeFn.apply(this, arguments)
      return fn.apply(this, arguments)
    }
  }

  var a = before(function () {
    console.log('原函数')
  }, function () {
    console.log('before函数 1')
  })
  a = before(a, function () {
    console.log('before函数 2')
  })

  a()
```

### 状态模式

### 适配器模式