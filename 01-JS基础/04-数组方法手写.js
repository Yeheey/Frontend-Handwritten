/**
 * 手写数组方法 —— 不调用原生 API 实现 map / filter / reduce / some / every
 *
 * 高频考点：理解数组方法内部机制，注意稀疏数组处理
 */

// ==================== 手写 Array.prototype.map ====================
/**
 * 手写 map 方法
 * 对数组每个元素执行回调，返回新数组
 * @param {Function} callback - 回调函数 (currentValue, index, array)
 * @param {any} thisArg - 回调函数的 this 指向
 * @returns {Array} 新数组
 */
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const arr = this;
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    // 跳过稀疏数组中的空位
    if (i in arr) {
      // 传入三个参数：当前值、索引、原数组
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }

  return result;
};

// ==================== 手写 Array.prototype.filter ====================
/**
 * 手写 filter 方法
 * 过滤出满足条件的元素，返回新数组
 * @param {Function} callback - 判断函数 (currentValue, index, array)
 * @param {any} thisArg - 回调函数的 this 指向
 * @returns {Array} 过滤后的新数组
 */
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const arr = this;
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      if (callback.call(thisArg, arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
  }

  return result;
};

// ==================== 手写 Array.prototype.reduce ====================
/**
 * 手写 reduce 方法
 * 关键：有初始值从索引 0 开始，无初始值从索引 1 开始
 * @param {Function} callback - 归约函数 (accumulator, currentValue, index, array)
 * @param {any} initialValue - 可选的初始值
 * @returns {any} 归约后的最终结果
 */
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const arr = this;

  // 空数组且没有初始值，抛出 TypeError
  if (arr.length === 0 && arguments.length < 2) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  // 确定起始索引和初始累加器值
  let startIndex = 0;
  let accumulator;

  if (arguments.length >= 2) {
    // 有初始值：从索引 0 开始
    accumulator = initialValue;
  } else {
    // 无初始值：从索引 1 开始，取第一个有效元素作为初始累加器
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        accumulator = arr[i];
        startIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }

  // 从 startIndex 开始遍历
  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};

// ==================== 手写 Array.prototype.some ====================
/**
 * 手写 some 方法
 * 找到满足条件的元素立即返回 true，全部不满足返回 false
 * @param {Function} callback - 判断函数
 * @param {any} thisArg - 回调函数的 this 指向
 * @returns {boolean}
 */
Array.prototype.mySome = function (callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    if (i in arr && callback.call(thisArg, arr[i], i, arr)) {
      return true; // 找到即返回
    }
  }

  return false;
};

// ==================== 手写 Array.prototype.every ====================
/**
 * 手写 every 方法
 * 遇到不满足条件的元素立即返回 false，全部满足返回 true
 * @param {Function} callback - 判断函数
 * @param {any} thisArg - 回调函数的 this 指向
 * @returns {boolean}
 */
Array.prototype.myEvery = function (callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    if (i in arr && !callback.call(thisArg, arr[i], i, arr)) {
      return false; // 不满足即返回
    }
  }

  return true;
};

// ==================== 测试用例 ====================
const nums = [1, 2, 3, 4, 5];

// myMap
console.log(nums.myMap(x => x * 2)); // [2, 4, 6, 8, 10]

// myFilter
console.log(nums.myFilter(x => x > 3)); // [4, 5]

// myReduce
console.log(nums.myReduce((acc, cur) => acc + cur, 0)); // 15

// mySome
console.log(nums.mySome(x => x > 4));  // true
console.log(nums.mySome(x => x > 10)); // false

// myEvery
console.log(nums.myEvery(x => x > 0)); // true
console.log(nums.myEvery(x => x > 3)); // false
