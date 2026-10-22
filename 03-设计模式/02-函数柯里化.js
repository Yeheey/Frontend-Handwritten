/**
 * 函数柯里化 —— 固定参数版 & 无限参数版
 *
 * 高频考点：理解闭包、参数收集、隐式转换
 */

// ==================== 固定参数柯里化 ====================
/**
 * 固定参数柯里化实现
 * 递归收集参数，直到参数个数满足原函数要求后执行
 * @param {Function} fn - 原始函数
 * @returns {Function} 柯里化后的函数
 *
 * @example
 * const sum = (a, b, c) => a + b + c;
 * const curriedSum = curry(sum);
 * curriedSum(1)(2)(3); // 6
 * curriedSum(1, 2)(3); // 6
 * curriedSum(1)(2, 3); // 6
 */
function curry(fn) {
  return function curried(...args) {
    // 当收集到的参数数量 >= 原函数形参个数时，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个新函数，继续收集参数
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

// ==================== 无限参数柯里化 ====================
/**
 * 无限参数柯里化实现
 * 每次调用返回新函数收集参数，支持传入空参数立即计算
 * 也支持隐式转换（toString / valueOf）时自动计算
 * @param {Function} fn - 原始函数（接收任意数量参数）
 * @returns {Function} 柯里化后的函数
 *
 * @example
 * const sum = (...args) => args.reduce((a, b) => a + b, 0);
 * const curriedSum = infiniteCurry(sum);
 * curriedSum(1, 2)(3, 4)(); // 10
 * +curriedSum(1)(2)(3);      // 6（隐式转换）
 */
function infiniteCurry(fn) {
  // 内部递归收集参数
  function collectArgs(prevArgs) {
    const proxyFn = function (...args) {
      // 如果没有传入参数，立即使用已收集的参数执行原函数
      if (args.length === 0) {
        return fn.apply(this, prevArgs);
      }
      // 否则继续收集参数并返回新函数
      return collectArgs([...prevArgs, ...args]);
    };

    // 重写 toString / valueOf，支持隐式转换时立即计算
    proxyFn.toString = () => fn.apply(null, prevArgs);
    proxyFn.valueOf = () => fn.apply(null, prevArgs);

    return proxyFn;
  }

  return collectArgs([]);
}

// ==================== 测试用例 ====================

// 固定参数柯里化
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6

// 无限参数柯里化
const sum = (...args) => args.reduce((a, b) => a + b, 0);
const curriedSum = infiniteCurry(sum);

console.log(curriedSum(1, 2)(3, 4)()); // 10
console.log(+curriedSum(1)(2)(3));      // 6
console.log(`${curriedSum(10)(20)}`);   // 30
