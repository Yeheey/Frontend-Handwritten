/**
 * 手写 Promise.all / Promise.race / Promise.allSettled / Promise.any
 *
 * 高频考点：大厂二面核心，Promise 静态方法的实现原理
 */

// ==================== Promise.all ====================
/**
 * 手写 Promise.all
 * 全部成功则返回结果数组，任一失败立即 reject
 * @param {Array} promises - Promise 数组（可包含非 Promise 值）
 * @returns {Promise<Array>} 所有 Promise 成功后的结果数组
 */
function myAll(promises) {
  return new Promise((resolve, reject) => {
    // 处理空数组情况：直接 resolve 空数组
    if (!promises || promises.length === 0) {
      return resolve([]);
    }

    const results = [];       // 存储结果，保持原始顺序
    let completedCount = 0;   // 已完成计数器

    // 遍历所有项，用 Promise.resolve 包裹以处理非 Promise 值
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          // 成功：按原始索引存入结果
          results[i] = value;
          completedCount++;
          // 当所有 Promise 都成功时，resolve 结果数组
          if (completedCount === promises.length) {
            resolve(results);
          }
        },
        (reason) => {
          // 任一失败：立即 reject，不再等待其他
          reject(reason);
        }
      );
    }
  });
}

// ==================== Promise.race ====================
/**
 * 手写 Promise.race
 * 返回第一个改变状态的 Promise 的结果
 * @param {Array} promises - Promise 数组（可包含非 Promise 值）
 * @returns {Promise} 第一个 settled 的 Promise 的结果
 */
function myRace(promises) {
  return new Promise((resolve, reject) => {
    // 处理空数组：返回一个永远 pending 的 Promise（与原生行为一致）
    if (!promises || promises.length === 0) {
      return;
    }

    // 遍历所有项，用 Promise.resolve 包裹处理非 Promise 值
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          // 第一个成功的，立即 resolve
          resolve(value);
        },
        (reason) => {
          // 第一个失败的，立即 reject
          reject(reason);
        }
      );
    }
  });
}

// ==================== Promise.allSettled ====================
/**
 * 手写 Promise.allSettled
 * 等待所有 Promise 完成（无论成功失败），返回每个的状态结果数组
 * @param {Array} promises - Promise 数组（可包含非 Promise 值）
 * @returns {Promise<Array>} 每个 Promise 的状态结果数组
 */
function myAllSettled(promises) {
  return new Promise((resolve) => {
    // 处理空数组
    if (!promises || promises.length === 0) {
      return resolve([]);
    }

    const results = [];       // 存储每个 Promise 的结果对象
    let completedCount = 0;   // 已完成计数器

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          // 成功：记录 fulfilled 状态和 value
          results[i] = { status: 'fulfilled', value };
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        },
        (reason) => {
          // 失败：记录 rejected 状态和 reason
          results[i] = { status: 'rejected', reason };
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        }
      );
    }
  });
}

// ==================== Promise.any ====================
/**
 * 手写 Promise.any
 * 第一个成功的即返回结果，全部失败抛出 AggregateError
 * @param {Array} promises - Promise 数组（可包含非 Promise 值）
 * @returns {Promise} 第一个成功的结果
 */
function myAny(promises) {
  return new Promise((resolve, reject) => {
    // 处理空数组：直接返回 AggregateError
    if (!promises || promises.length === 0) {
      return reject(
        new AggregateError([], 'All promises were rejected')
      );
    }

    const errors = [];        // 收集所有失败原因
    let rejectedCount = 0;    // 已失败计数器

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          // 第一个成功的：立即 resolve
          resolve(value);
        },
        (reason) => {
          // 失败：记录错误原因
          errors[i] = reason;
          rejectedCount++;
          // 全部失败：抛出 AggregateError
          if (rejectedCount === promises.length) {
            reject(
              new AggregateError(errors, 'All promises were rejected')
            );
          }
        }
      );
    }
  });
}

// ==================== 测试用例 ====================
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

// Promise.all
myAll([p1, p2, p3]).then(console.log); // [1, 2, 3]

// Promise.race
myRace([
  new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('slow'), 500)),
]).then(console.log); // 'fast'

// Promise.allSettled
myAllSettled([
  Promise.resolve('ok'),
  Promise.reject('err'),
]).then(console.log);
// [{ status: 'fulfilled', value: 'ok' }, { status: 'rejected', reason: 'err' }]

// Promise.any
myAny([
  Promise.reject('fail1'),
  Promise.resolve('success'),
]).then(console.log); // 'success'
