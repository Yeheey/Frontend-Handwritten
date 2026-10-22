/**
 * 手写 call / apply / bind —— 改变 this 指向
 *
 * 高频考点：面试必问，一面开场题
 * 核心思路：将函数临时挂载到目标对象上执行，执行后删除
 */

// ==================== myCall 实现 ====================
/**
 * 手写 call 方法
 * 核心逻辑：将函数作为对象的方法执行，执行后删除该方法
 * @param {Object} context - this 指向的目标对象
 * @param  {...any} args - 传入的参数列表
 * @returns {any} 函数执行的返回值
 */
Function.prototype.myCall = function (context, ...args) {
  // 1. 处理非函数调用情况
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not a function`);
  }

  // 2. context 为 null/undefined 时指向 globalThis（浏览器为 window，Node 为 global）
  context = context ?? globalThis;

  // 3. 使用 Symbol 作为临时属性名，避免覆盖对象原有属性
  const fnKey = Symbol('tempFn');
  context[fnKey] = this;

  // 4. 执行函数并传入可变参数，捕获返回值
  const result = context[fnKey](...args);

  // 5. 执行完毕后删除临时属性
  delete context[fnKey];

  return result;
};

// ==================== myApply 实现 ====================
/**
 * 手写 apply 方法
 * 与 call 的区别：第二个参数是数组或类数组
 * @param {Object} context - this 指向的目标对象
 * @param {Array|ArrayLike} args - 参数数组
 * @returns {any} 函数执行的返回值
 */
Function.prototype.myApply = function (context, args) {
  // 1. 处理非函数调用情况
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not a function`);
  }

  // 2. context 为 null/undefined 时指向 globalThis
  context = context ?? globalThis;

  // 3. 处理 args 参数，如果不是数组或类数组则忽略
  const argsArray = args != null ? Array.from(args) : [];

  // 4. 使用 Symbol 作为临时属性名
  const fnKey = Symbol('tempFn');
  context[fnKey] = this;

  // 5. 执行函数并传入参数数组
  const result = context[fnKey](...argsArray);

  // 6. 删除临时属性
  delete context[fnKey];

  return result;
};

// ==================== myBind 实现（支持 new 调用） ====================
/**
 * 手写 bind 方法（支持 new 调用）
 * bind 返回一个新函数，该函数：
 *   1. 调用时 this 绑定到指定 context
 *   2. 支持部分应用（预置参数）
 *   3. 作为构造函数（new）调用时，this 指向新创建的实例
 * @param {Object} context - this 指向的目标对象
 * @param  {...any} bindArgs - 预置参数
 * @returns {Function} 绑定后的新函数
 */
Function.prototype.myBind = function (context, ...bindArgs) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not a function`);
  }

  const self = this;

  // 使用空函数作为中间对象，用于保留原型链
  const BoundFunction = function (...callArgs) {
    // 合并 bind 时预置的参数和调用时传入的参数
    const finalArgs = [...bindArgs, ...callArgs];

    // 判断是否通过 new 调用：
    // 如果 this 是 BoundFunction 的实例，说明是 new 调用，this 指向新实例
    // 否则使用指定的 context
    const isCalledAsNew = this instanceof BoundFunction;
    const thisArg = isCalledAsNew ? this : context;

    return self.apply(thisArg, finalArgs);
  };

  // 保留原型链：BoundFunction 的原型指向原函数的 prototype
  // 这样 new BoundFunction() 创建的实例能访问原函数原型上的方法
  if (self.prototype) {
    BoundFunction.prototype = Object.create(self.prototype);
  }

  return BoundFunction;
};

// ==================== 测试用例 ====================
const obj = { name: 'Alice' };

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

// 测试 myCall
greet.myCall(obj, 'Hello', '!'); // Hello, Alice!

// 测试 myApply
greet.myApply(obj, ['Hi', '~']); // Hi, Alice~

// 测试 myBind
const boundGreet = greet.myBind(obj, 'Hey');
boundGreet('!!!'); // Hey, Alice!!!

// 测试 new 调用
function Person(name) {
  this.name = name;
}
const BoundPerson = Person.myBind(null, 'Bob');
const p = new BoundPerson();
console.log(p.name); // Bob
