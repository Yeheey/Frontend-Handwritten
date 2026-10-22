/**
 * 手写符合 Promise/A+ 规范的简易 Promise
 *
 * 高频考点：理解 Promise 状态机、链式调用、微任务调度
 * 这是前端面试中最难的手写题之一
 */

class PromiseMini {
  // 三种状态常量
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = PromiseMini.PENDING;    // 当前状态
    this.value = undefined;               // 成功时的值
    this.reason = undefined;              // 失败时的原因
    this.onFulfilledCallbacks = [];       // 成功回调队列
    this.onRejectedCallbacks = [];        // 失败回调队列

    // resolve 函数：将状态从 pending 变为 fulfilled
    const resolve = (value) => {
      // 状态不可逆：只有 pending 才能改变
      if (this.status === PromiseMini.PENDING) {
        this.status = PromiseMini.FULFILLED;
        this.value = value;

        // 异步执行所有已注册的成功回调（微任务调度）
        this.onFulfilledCallbacks.forEach((cb) => {
          PromiseMini.microTask(() => cb());
        });
      }
    };

    // reject 函数：将状态从 pending 变为 rejected
    const reject = (reason) => {
      if (this.status === PromiseMini.PENDING) {
        this.status = PromiseMini.REJECTED;
        this.reason = reason;

        // 异步执行所有已注册的失败回调
        this.onRejectedCallbacks.forEach((cb) => {
          PromiseMini.microTask(() => cb());
        });
      }
    };

    // executor 执行出错，直接 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * then 方法：支持链式调用、异步执行、返回值传递、异常处理
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {PromiseMini} 新的 Promise 实例
   */
  then(onFulfilled, onRejected) {
    // 参数默认处理：非函数时透传值或抛出错误
    onFulfilled = typeof onFulfilled === 'function'
      ? onFulfilled
      : (value) => value;
    onRejected = typeof onRejected === 'function'
      ? onRejected
      : (reason) => { throw reason; };

    // then 必须返回一个新的 Promise
    const promise2 = new PromiseMini((resolve, reject) => {
      // 处理成功回调
      const handleFulfilled = () => {
        PromiseMini.microTask(() => {
          try {
            const x = onFulfilled(this.value);
            // 核心：解析 then 的返回值
            PromiseMini.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // then 中抛出异常，转为 reject
            reject(error);
          }
        });
      };

      // 处理失败回调
      const handleRejected = () => {
        PromiseMini.microTask(() => {
          try {
            const x = onRejected(this.reason);
            PromiseMini.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      // 根据当前状态决定立即执行还是加入回调队列
      if (this.status === PromiseMini.FULFILLED) {
        handleFulfilled();
      } else if (this.status === PromiseMini.REJECTED) {
        handleRejected();
      } else {
        // pending 状态：暂存回调，等状态改变后再执行
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise2;
  }

  /**
   * 核心解析函数：处理 then 返回值的所有情况
   * 这是 A+ 规范最关键的部分
   * @param {PromiseMini} promise2 - then 返回的新 Promise
   * @param {any} x - then 回调的返回值
   * @param {Function} resolve - promise2 的 resolve
   * @param {Function} reject - promise2 的 reject
   */
  static resolvePromise(promise2, x, resolve, reject) {
    // 防止循环引用：then 返回的 Promise 不能是自身
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected'));
    }

    // 如果 x 是 PromiseMini 实例，等待其其结果
    if (x instanceof PromiseMini) {
      x.then(resolve, reject);
      return;
    }

    // 如果 x 是 thenable 对象（具有 then 方法）
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false; // 防止多次调用
      try {
        const then = x.then;
        if (typeof then === 'function') {
          // 以 x 为 this 调用 then
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              // 递归解析，因为 y 可能还是 Promise
              PromiseMini.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // x 是普通对象，直接 resolve
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      // x 是普通值，直接 resolve
      resolve(x);
    }
  }

  /**
   * 微任务调度器：使用 Promise.resolve().then 模拟微任务
   * 确保回调异步执行，符合 A+ 规范要求
   */
  static microTask(callback) {
    Promise.resolve().then(callback);
  }

  /**
   * 静态方法 resolve：将值包装为已成功的 Promise
   */
  static resolve(value) {
    if (value instanceof PromiseMini) {
      return value;
    }
    return new PromiseMini((resolve) => resolve(value));
  }

  /**
   * 静态方法 reject：将原因包装为已失败的 Promise
   */
  static reject(reason) {
    return new PromiseMini((_, reject) => reject(reason));
  }
}

// ==================== 测试用例 ====================

// 基础用法
const p = new PromiseMini((resolve, reject) => {
  setTimeout(() => resolve('hello'), 100);
});

p.then((value) => {
  console.log(value); // hello
  return value + ' world';
}).then((value) => {
  console.log(value); // hello world
});

// 链式调用 + 异步
PromiseMini.resolve(1)
  .then((val) => val + 1)
  .then((val) => {
    console.log(val); // 2
    return new PromiseMini((resolve) => {
      setTimeout(() => resolve(val * 10), 100);
    });
  })
  .then((val) => {
    console.log(val); // 20
  });

// 错误处理
PromiseMini.reject('error occurred')
  .then((val) => val)
  .then(null, (reason) => {
    console.log(reason); // error occurred
  });
