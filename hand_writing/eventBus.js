class EventEmitter {
  constructor() {
    this.listeners = [];
  }
  on(event, func) {
    const callback = () => (listener) => listener.name === event;
    const idx = this.listeners.findIndex(callback);
    if (idx === -1) {
      this.listeners.push({
        name: event,
        callbacks: [func],
      });
    } else {
      this.listeners[idx].callbacks.push(func);
    }
  }
  emit(event, ...args) {
    if (this.listeners.length === 0) return;
    const callback = () => (listener) => listener.name === event;
    const idx = this.listeners.findIndex(callback);
    this.listeners[idx].callbacks.forEach((cb) => {
      cb(...args);
    });
  }
  once(event, func) {
    const callback = () => (listener) => listener.name === event;
    let idx = this.listeners.findIndex(callback);
    if (idx === -1) {
      this.listeners.push({
        name: event,
        callbacks: [func],
      });
    }
  }
  off(event, func) {
    if (this.listeners.length === 0) return;
    const callback = () => (listener) => listener.name === event;
    let idx = this.listeners.findIndex(callback);
    if (idx !== -1) {
      let callbacks = this.listeners[idx].callbacks;
      for (let i = 0; i < callbacks.length; i++) {
        if (callbacks[i] === func) {
          callbacks.splice(i, 1);
          break;
        }
      }
    }
  }
}


class EventBus {
  constructor() {
    this.events = {}; // 存储事件及其对应的回调函数列表
  }

  // 订阅事件
  subscribe(name, _cb) {
    this.events[name] = this.events[name] || []; // 如果事件不存在，创建一个空的回调函数列表 (空数组)
    this.events[name].push(_cb); // 将回调函数添加到事件的回调函数列表中
  }

  // 发布事件
  publish(name, data) {
    if (this.events[name]) {
      this.events[name].forEach(cb => {
        cb(data); // 执行回调函数，并传递数据作为参数
      });
    }
  }

  // 取消订阅事件
  unsubscribe(name, _cb) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter(cb => cb !== _cb); // 过滤掉要取消的回调函数
    }
  }
}