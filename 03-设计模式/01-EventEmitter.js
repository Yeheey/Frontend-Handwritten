/**
 * 发布订阅模式（EventBus / EventEmitter）
 *
 * 高频考点：设计模式手写题中出现频率最高
 * 核心思路：维护事件名到回调数组的映射，支持 on / off / once / emit
 */

class EventEmitter {
  constructor() {
    // 使用对象存储事件及其回调函数列表
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * 取消订阅
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 要移除的回调函数
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;

    // 过滤掉指定的回调函数
    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback
    );
  }

  /**
   * 一次性订阅，触发后自动移除
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(eventName, callback) {
    // 包装原回调，执行后自动 off
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * 触发事件，传递参数给所有订阅者
   * @param {string} eventName - 事件名称
   * @param  {...any} args - 传递给回调的参数
   */
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;

    // 遍历执行所有回调，防止执行中修改数组导致问题，先复制一份
    [...this.events[eventName]].forEach((callback) => {
      callback(...args);
    });
  }
}

// ==================== 测试用例 ====================
const emitter = new EventEmitter();

// 普通订阅
const handler = (msg) => console.log('received:', msg);
emitter.on('test', handler);
emitter.emit('test', 'hello'); // received: hello

// 取消订阅
emitter.off('test', handler);
emitter.emit('test', 'world'); // 无输出

// 一次性订阅
emitter.once('once-event', (msg) => console.log('once:', msg));
emitter.emit('once-event', 'first');  // once: first
emitter.emit('once-event', 'second'); // 无输出（已自动移除）
