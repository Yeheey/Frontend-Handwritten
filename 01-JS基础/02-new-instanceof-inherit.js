/**
 * 手写 new / instanceof / 原型继承
 *
 * 高频考点：原型链相关题目，面试出现频率极高
 * 核心思路：理解原型链、构造函数、实例三者的关系
 */

// ==================== 手写 new 操作符 ====================
/**
 * 手写 new 操作符
 * new 的核心步骤：
 *   1. 创建一个空对象
 *   2. 将空对象的原型指向构造函数的 prototype
 *   3. 以空对象为 this 执行构造函数
 *   4. 根据构造函数返回值决定最终返回什么
 * @param {Function} Constructor - 构造函数
 * @param  {...any} args - 传给构造函数的参数
 * @returns {Object} 新创建的实例对象
 */
function myNew(Constructor, ...args) {
  // 1. 检查是否为函数
  if (typeof Constructor !== 'function') {
    throw new TypeError(`${Constructor} is not a constructor`);
  }

  // 2. 创建空对象，并设置原型链
  const obj = Object.create(Constructor.prototype);

  // 3. 绑定 this 并执行构造函数
  const result = Constructor.apply(obj, args);

  // 4. 处理返回值：
  //    如果构造函数返回了对象（非 null），则返回该对象
  //    否则返回新创建的空对象
  return (result !== null && typeof result === 'object') ? result : obj;
}

// ==================== 手写 instanceof ====================
/**
 * 手写 instanceof
 * 核心逻辑：沿原型链向上查找，判断构造函数的 prototype 是否在链上
 * @param {any} left - 待检测的实例对象
 * @param {Function} right - 构造函数
 * @returns {boolean} left 是否是 right 的实例
 */
function myInstanceof(left, right) {
  // 1. 处理 null 和非对象类型，直接返回 false
  if (left === null || (typeof left !== 'object' && typeof left !== 'function')) {
    return false;
  }

  // 2. 获取构造函数的 prototype
  const prototype = right.prototype;

  // 3. 获取左值的原型
  let proto = Object.getPrototypeOf(left);

  // 4. 沿原型链向上查找
  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

// ==================== 手写原型继承 ====================
/**
 * 手写原型继承
 * 使用空函数作为中间对象，避免直接引用父类原型导致修改互相影响
 * @param {Function} Child - 子类构造函数
 * @param {Function} Parent - 父类构造函数
 */
function inherit(Child, Parent) {
  // 1. 创建空函数作为中间对象
  const Temp = function () {};

  // 2. 将中间函数的原型指向父类的原型
  Temp.prototype = Parent.prototype;

  // 3. 子类的原型指向中间函数的实例
  Child.prototype = new Temp();

  // 4. 修复 constructor 指向，使其指回子类构造函数
  Child.prototype.constructor = Child;

  // 5. 保留对父类的引用，方便调用父类方法
  Child.super = Parent;
}

// ==================== 测试用例 ====================

// 测试 myNew
function Animal(type) {
  this.type = type;
}
Animal.prototype.speak = function () {
  return `${this.type} makes a sound`;
};

const dog = myNew(Animal, 'Dog');
console.log(dog.type);       // Dog
console.log(dog.speak());    // Dog makes a sound
console.log(dog instanceof Animal); // true

// 测试 myInstanceof
console.log(myInstanceof(dog, Animal)); // true
console.log(myInstanceof(dog, Object)); // true
console.log(myInstanceof('hello', Array)); // false

// 测试 inherit
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function () {
  return `${this.name} says woof!`;
};

function GoldenRetriever(name) {
  GoldenRetriever.super.call(this, name);
}
inherit(GoldenRetriever, Dog);

const buddy = new GoldenRetriever('Buddy');
console.log(buddy.bark()); // Buddy says woof!
console.log(buddy instanceof Dog);            // true
console.log(buddy instanceof GoldenRetriever); // true
