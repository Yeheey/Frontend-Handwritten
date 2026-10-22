/**
 * 手写对象工具 —— 深度相等判断 / 防抖 / 节流
 *
 * 高频考点：isEqual、debounce、throttle 是面试出现频率最高的工具函数
 */

// ==================== 深度相等判断 ====================
/**
 * 深度相等判断
 * 处理 NaN、-0、嵌套对象、数组等边界情况
 * @param {any} a - 比较对象 A
 * @param {any} b - 比较对象 B
 * @returns {boolean} 是否深度相等
 */
function isEqual(a, b) {
  // 处理 NaN：NaN !== NaN，但两个 NaN 应该相等
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  // 处理 -0 和 +0：Object.is 可以区分
  if (Object.is(a, b)) return true;

  // 处理 null 和非对象类型
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 处理 Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 处理 RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // 获取两个对象的键
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // 键数量不同，直接不相等
  if (keysA.length !== keysB.length) return false;

  // 递归比较每个键的值
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }

  return true;
}

// ==================== 防抖 debounce ====================
/**
 * 防抖函数
 * 在事件触发后等待 delay 毫秒再执行，期间重复触发会重新计时
 * 支持 immediate 立即执行和 cancel 取消
 * @param {Function} fn - 需要防抖的函数
 * @param {number} [delay=300] - 延迟时间（毫秒）
 * @param {boolean} [immediate=false] - 是否立即执行
 * @returns {Function} 防抖后的函数（附带 cancel 方法）
 */
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;
  let isInvoked = false; // 标记是否已经立即执行过

  const debounced = function (...args) {
    const context = this;

    // 清除之前的定时器
    if (timer !== null) {
      clearTimeout(timer);
    }

    // 立即执行模式：第一次触发时立即执行
    if (immediate && !isInvoked) {
      fn.apply(context, args);
      isInvoked = true;
      return;
    }

    // 延迟执行
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
      isInvoked = false; // 重置标记，允许下次立即执行
    }, delay);
  };

  // 提供 cancel 方法，用于取消防抖
  debounced.cancel = function () {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      isInvoked = false;
    }
  };

  return debounced;
}

// ==================== 节流 throttle - 时间戳版 ====================
/**
 * 节流 - 时间戳版
 * 第一次触发立即执行，之后每隔 delay 毫秒最多执行一次
 * 停止触发后不会补执行最后一次
 * @param {Function} fn - 需要节流的函数
 * @param {number} [delay=300] - 节流间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttleTimestamp(fn, delay = 300) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    // 距离上次执行超过 delay，才执行
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

// ==================== 节流 throttle - 定时器版 ====================
/**
 * 节流 - 定时器版
 * 第一次触发后设置定时器，delay 后执行
 * 停止触发后会补执行最后一次
 * @param {Function} fn - 需要节流的函数
 * @param {number} [delay=300] - 节流间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttleTimer(fn, delay = 300) {
  let timer = null;

  return function (...args) {
    const context = this;

    // 如果已有定时器在运行，直接返回（等待执行）
    if (timer !== null) return;

    // 设置定时器，delay 后执行
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null; // 执行完毕后清空，允许下次触发
    }, delay);
  };
}

// ==================== 测试用例 ====================

// isEqual 测试
console.log(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(isEqual(NaN, NaN));           // true
console.log(isEqual(new Date(2024, 0, 1), new Date(2024, 0, 1))); // true
console.log(isEqual([1, 2, 3], [1, 2, 4])); // false

// debounce 测试
const debouncedFn = debounce((msg) => {
  console.log('debounced:', msg);
}, 500);

debouncedFn('hello');
debouncedFn('world'); // 只有最后一次会在 500ms 后执行

// throttle 测试
const throttledFn = throttleTimestamp((msg) => {
  console.log('throttled:', msg);
}, 1000);

throttledFn('first');  // 立即执行
throttledFn('second'); // 被忽略（未到间隔）
