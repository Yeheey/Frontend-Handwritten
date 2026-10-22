/**
 * 手写 Promise 串行执行 / 异步并发调度器 / Promise 重试函数
 *
 * 高频考点：Promise 流程控制，大厂二面常考
 */

// ==================== Promise 串行执行 ====================
/**
 * 手写 Promise 串行执行
 * 按顺序依次执行 Promise 函数数组，前一个的结果作为后一个的输入
 * @param {Array<Function>} tasks - Promise 函数数组，每个函数返回 Promise
 * @param {*} initialValue - 可选的初始值，作为第一个任务的参数
 * @returns {Promise<Array>} 按顺序执行后的所有结果数组
 */
function promiseSeries(tasks, initialValue) {
  const results = [];                          // 结果收集数组
  let current = Promise.resolve(initialValue); // 初始 Promise

  for (let i = 0; i < tasks.length; i++) {
    // 每次将当前任务链入 Promise 链
    current = current
      .then((prevResult) => {
        // 将前一个结果作为当前任务的参数传入
        return tasks[i](prevResult);
      })
      .then((result) => {
        // 将每个任务的结果存入数组
        results.push(result);
        return result; // 传递给下一个任务
      });
  }

  // 返回包含所有结果的 Promise
  return current.then(() => results);
}

// ==================== 异步并发调度器/限流器 ====================
/**
 * 手写异步并发调度器
 * 控制同时运行的 Promise 数量不超过 limit
 * @param {Array<Function>} tasks - Promise 函数数组
 * @param {number} limit - 最大并发数
 * @returns {Promise<Array>} 保持原始顺序的结果数组
 */
function promisePool(tasks, limit) {
  return new Promise((resolve) => {
    if (!tasks || tasks.length === 0) {
      return resolve([]);
    }

    const results = [];        // 结果数组，保持原始顺序
    let runningCount = 0;      // 当前正在运行的任务数
    let nextIndex = 0;         // 下一个待执行任务的索引
    let completedCount = 0;    // 已完成任务数

    // 调度函数：尽可能多地启动任务，直到达到并发上限
    function schedule() {
      while (runningCount < limit && nextIndex < tasks.length) {
        const currentIndex = nextIndex; // 记录当前任务的原始索引
        nextIndex++;
        runningCount++;

        // 执行任务并处理结果
        tasks[currentIndex]()
          .then(
            (value) => {
              // 按原始索引存入结果，保证顺序
              results[currentIndex] = value;
            },
            (reason) => {
              // 失败也存入结果（可根据需求改为 reject）
              results[currentIndex] = reason;
            }
          )
          .finally(() => {
            // 任务完成（无论成功失败）
            runningCount--;
            completedCount++;

            // 如果还有任务，继续调度
            if (nextIndex < tasks.length) {
              schedule();
            }
            // 所有任务都完成，resolve 结果
            else if (completedCount === tasks.length) {
              resolve(results);
            }
          });
      }
    }

    // 启动初始调度
    schedule();
  });
}

// ==================== Promise 重试函数 ====================
/**
 * 手写 Promise 重试函数
 * 异步函数失败后自动重试，支持自定义重试判断
 * @param {Function} fn - 异步函数，返回 Promise
 * @param {number} retries - 最大重试次数
 * @param {number} delay - 每次重试之间的延迟（毫秒）
 * @param {Function} [shouldRetry] - 可选，自定义重试判断函数
 * @returns {Promise} 重试成功返回结果，达到上限抛出最终错误
 */
function promiseRetry(fn, retries, delay, shouldRetry) {
  let tryCount = 0; // 当前尝试次数

  function attempt() {
    tryCount++;

    return fn().catch((error) => {
      // 判断是否还能重试
      const canRetry =
        tryCount <= retries &&
        (!shouldRetry || shouldRetry(tryCount, error));

      if (canRetry) {
        // 延迟后重试
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(attempt());
          }, delay);
        });
      }

      // 达到最大重试次数或不满足重试条件，抛出最终错误
      return Promise.reject(error);
    });
  }

  return attempt();
}

// ==================== 测试用例 ====================

// Promise 串行执行测试
const task1 = (val) => Promise.resolve(val + 1);
const task2 = (val) => Promise.resolve(val * 2);
const task3 = (val) => Promise.resolve(val + 10);

promiseSeries([task1, task2, task3], 0).then(console.log);
// 执行过程：0 → task1(0)=1 → task2(1)=2 → task3(2)=12
// 输出：[1, 2, 12]

// 并发调度器测试
const createTask = (id, ms) => () =>
  new Promise((resolve) => {
    console.log(`Task ${id} started`);
    setTimeout(() => {
      console.log(`Task ${id} done`);
      resolve(`result-${id}`);
    }, ms);
  });

promisePool(
  [createTask(1, 300), createTask(2, 100), createTask(3, 200), createTask(4, 50)],
  2
).then(console.log);
// 最多同时运行 2 个任务，结果保持原始顺序

// Promise 重试测试
let retryAttempt = 0;
const unreliableFn = () =>
  new Promise((resolve, reject) => {
    retryAttempt++;
    if (retryAttempt < 3) {
      reject(new Error(`Attempt ${retryAttempt} failed`));
    } else {
      resolve('Success on attempt 3!');
    }
  });

promiseRetry(unreliableFn, 5, 100).then(console.log);
// 第 3 次尝试成功，输出：Success on attempt 3!
