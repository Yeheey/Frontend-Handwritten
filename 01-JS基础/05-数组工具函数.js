/**
 * 手写数组工具函数 —— 去重、扁平化、分块、交集、差集
 *
 * 高频考点：数组操作是面试中最常见的手写题之一
 */

// ==================== 数组去重 ====================
/**
 * 数组去重
 * 支持普通数组去重和对象数组按指定 key 去重
 * @param {Array} arr - 待去重的数组
 * @param {string} [key] - 对象数组去重时依据的键名
 * @returns {Array} 去重后的新数组
 */
function unique(arr, key) {
  if (!Array.isArray(arr)) return arr;

  // 普通数组去重：使用 Set
  if (!key) {
    return [...new Set(arr)];
  }

  // 对象数组按指定 key 去重：使用 Map 记录已出现的值
  const seen = new Map();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.set(val, true);
    return true;
  });
}

// ==================== 数组扁平化 ====================
/**
 * 数组扁平化
 * 使用 reduce 实现，支持 depth 参数控制深度
 * @param {Array} arr - 待扁平化的数组
 * @param {number} [depth=Infinity] - 扁平化深度，默认无限
 * @returns {Array} 扁平化后的新数组
 */
function flatArray(arr, depth = Infinity) {
  if (!Array.isArray(arr) || depth <= 0) {
    return arr.slice(); // 返回副本
  }

  return arr.reduce((acc, cur) => {
    if (Array.isArray(cur) && depth > 0) {
      // 递归扁平化，深度减 1
      return acc.concat(flatArray(cur, depth - 1));
    }
    return acc.concat(cur);
  }, []);
}

// ==================== 数组分块 ====================
/**
 * 数组分块
 * 将数组按指定大小分割成多个子数组
 * @param {Array} arr - 原数组
 * @param {number} size - 每块的大小
 * @returns {Array} 分块后的二维数组
 */
function chunk(arr, size) {
  if (!Array.isArray(arr) || size <= 0) return [];

  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

// ==================== 数组交集 ====================
/**
 * 数组交集
 * 返回两个数组中都存在的元素（去重）
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {Array} 交集结果
 */
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  // 用 Set 去重后过滤
  return [...new Set(arr1)].filter(item => set2.has(item));
}

// ==================== 数组差集 ====================
/**
 * 数组差集
 * 返回在 arr1 中但不在 arr2 中的元素
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {Array} 差集结果
 */
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter(item => !set2.has(item));
}

// ==================== 测试用例 ====================

// 去重
console.log(unique([1, 2, 2, 3, 1, 4])); // [1, 2, 3, 4]

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
];
console.log(unique(users, 'id')); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// 扁平化
console.log(flatArray([1, [2, [3, [4]]]]));       // [1, 2, 3, 4]
console.log(flatArray([1, [2, [3, [4]]]], 1));     // [1, 2, [3, [4]]]

// 分块
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]

// 交集与差集
console.log(intersection([1, 2, 3, 4], [3, 4, 5, 6])); // [3, 4]
console.log(difference([1, 2, 3, 4], [3, 4, 5, 6]));   // [1, 2]
