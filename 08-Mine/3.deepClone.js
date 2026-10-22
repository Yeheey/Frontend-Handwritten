/*
三、深拷贝（递归+特殊类型+循环引用）
实现深拷贝函数，完整复制对象层级，不共享内存，支持Date、RegExp等特殊类型，解决循环引用问题。
🧠 核心原理

基本类型直接返回，引用类型递归拷贝
特殊对象（Date/RegExp）新建实例继承属性
WeakMap缓存已拷贝对象，避免循环引用导致死循环

❌ 常见易错点
遗漏Date、RegExp等特殊类型，拷贝后丢失原有特性
未处理循环引用，递归陷入死循环
拷贝原型链属性，产生冗余数据
*/
/**
 * 深拷贝（支持Date/RegExp/循环引用）
 * @param {*} obj - 待拷贝数据
 * @param {WeakMap} cache - 缓存已拷贝对象
 * @returns {*} 拷贝结果
 */
function deepClone(obj, cache = new WeakMap()) {
    // 基本类型直接返回
    if (typeof obj !== 'object' || obj === null) return obj;
    // 处理循环引用
    if (cache.has(obj)) return cache.get(obj);

    let result;
    // 特殊类型处理
    if (obj instanceof Date) {
        result = new Date(obj);
        cache.set(obj, result);
        return result;
    }
    if (obj instanceof RegExp) {
        result = new RegExp(obj.source, obj.flags);
        cache.set(obj, result);
        return result;
    }

    // 初始化容器
    result = Array.isArray(obj) ? [] : {};
    cache.set(obj, result);

    // 递归拷贝自身属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key], cache);
        }
    }
    return result;
}

// 测试
const obj = {
    a: 1,
    b: [2, 3],
    c: new Date(),
    d: /test/g
};
obj.self = obj; // 循环引用
const newObj = deepClone(obj);
console.log(newObj.b === obj.b); // false
console.log(newObj.self === newObj); // true
