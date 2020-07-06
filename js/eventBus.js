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