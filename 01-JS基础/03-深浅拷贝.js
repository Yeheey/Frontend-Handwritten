/**
 * 手写浅拷贝与深拷贝
 *
 * 高频考点：深浅拷贝是面试常考题，满分版需处理循环引用、特殊类型、Symbol 键
 *
 * JSON.parse(JSON.stringify()) 的缺陷：
 *   1. 无法处理 undefined / function / symbol —— 属性被忽略，数组元素转为 null
 *   2. 无法处理 RegExp / Date —— RegExp 变 {}，Date 变 ISO 字符串
 *   3. 无法处理 NaN / Infinity —— 转为 null
 *   4. 无法处理循环引用 —— 直接抛出 TypeError
 *   5. 稀疏数组空位会被转为 null
 *   6. 无法处理 Map / Set / WeakMap / WeakSet —— 转为 {}
 *   7. 无法保留不可枚举属性和 Symbol 属性
 *   8. 无法处理 Error 对象 —— 丢失 message 和 stack
 */

// ==================== 浅拷贝 ====================
/**
 * 手写浅拷贝
 * 只拷贝对象自身的一层属性，嵌套对象仍然是引用
 * @param {any} source - 待拷贝的源对象
 * @returns {any} 拷贝后的新对象
 */
function shallowCopy(source) {
  // 处理 null 和非对象类型
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // 区分数组和对象
  const target = Array.isArray(source) ? [] : {};

  // 只拷贝自身属性（不包含原型链上的属性）
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  return target;
}

// ==================== 深拷贝基础递归版 ====================
/**
 * 深拷贝基础递归版
 * 处理 Date、RegExp、嵌套对象和数组
 * @param {any} source - 待拷贝的源对象
 * @returns {any} 深拷贝后的新对象
 */
function deepCloneBasic(source) {
  // 处理 null 和非对象类型
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // 处理 Date 对象
  if (source instanceof Date) {
    return new Date(source.getTime());
  }

  // 处理 RegExp 对象
  if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags);
  }

  // 区分数组和对象
  const target = Array.isArray(source) ? [] : {};

  // 递归拷贝每个属性
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepCloneBasic(source[key]);
    }
  }

  return target;
}

// ==================== 深拷贝满分版（WeakMap 解决循环引用） ====================
/**
 * 深拷贝满分版
 * 使用 WeakMap 解决循环引用问题，兼容特殊类型和 Symbol 键
 * @param {any} source - 待拷贝的源对象
 * @param {WeakMap} map - 用于记录已拷贝对象的缓存，防止循环引用
 * @returns {any} 深拷贝后的新对象
 */
function deepClone(source, map = new WeakMap()) {
  // 处理 null 和非对象类型
  if (source === null || typeof source !== 'object') {
    return source;
  }

  // 解决循环引用：如果已经拷贝过该对象，直接返回缓存的结果
  if (map.has(source)) {
    return map.get(source);
  }

  // 处理 Date 对象
  if (source instanceof Date) {
    return new Date(source.getTime());
  }

  // 处理 RegExp 对象
  if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags);
  }

  // 创建目标对象
  const target = Array.isArray(source) ? [] : {};

  // 将当前对象存入 map，防止循环引用
  map.set(source, target);

  // 拷贝普通字符串键
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone(source[key], map);
    }
  }

  // 处理 Symbol 键（for...in 和 Object.keys 不会遍历 Symbol）
  const symbolKeys = Object.getOwnPropertySymbols(source);
  for (const sym of symbolKeys) {
    if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
      target[sym] = deepClone(source[sym], map);
    }
  }

  return target;
}

// ==================== 测试用例 ====================

// 浅拷贝测试
const original = { a: 1, b: { c: 2 } };
const shallow = shallowCopy(original);
shallow.a = 99;
shallow.b.c = 99;
console.log(original.a); // 1  —— 基本类型互不影响
console.log(original.b.c); // 99 —— 嵌套对象仍然共享引用

// 深拷贝测试
const data = {
  name: 'test',
  date: new Date(),
  regex: /hello/gi,
  nested: { arr: [1, 2, [3, 4]] },
};
const cloned = deepClone(data);
console.log(cloned.nested.arr[2][0]); // 3
console.log(cloned.date instanceof Date);   // true
console.log(cloned.regex instanceof RegExp); // true

// 循环引用测试
const circular = { a: 1 };
circular.self = circular;
const clonedCircular = deepClone(circular);
console.log(clonedCircular.a);        // 1
console.log(clonedCircular.self === clonedCircular); // true（循环引用正确保留）
