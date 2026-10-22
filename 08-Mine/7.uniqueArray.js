/*
题目：手写数组去重（3种方案）

实现函数去除数组重复元素，支持基本类型去重，推荐三种写法：

1.双重循环 + indexOf
2.Set 数据结构去重
3.reduce 累加去重
示例：输入 [1,2,2,3,3,3] → 输出 [1,2,3]
*/

// 核心原理：利用 indexOf 返回 -1 的特性来判断元素是否重复。
// 优缺点：兼容性好（ES5 即可），但时间复杂度为 O(n²)，性能较差。
function unique1(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        // 如果 result 中不存在当前元素，则推入
        if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    return result;
}

// 这是目前最推荐、最简洁的写法，利用了 ES6 Set 成员唯一性的特性。
// 核心原理：Set 内部使用类似哈希表的机制，保证元素不重复。
// 优缺点：代码极其简洁，时间复杂度为 O(n)，性能优异。但需要注意，Set 认为 NaN === NaN（即会去重 NaN），且无法区分 {} 和 {}（引用类型地址不同，视为不同元素）
function unique2(arr) {
    // Set 会自动剔除重复值，再通过 Array.from 或展开运算符转回数组
    return Array.from(new Set(arr));
    // 或者简写为： return [...new Set(arr)];
}

// 用 reduce 的累加器特性，在遍历过程中逐步构建去重后的数组。
// 核心原理：reduce 接收一个初始值（这里是空数组 []），每次迭代时判断并返回新的数组。
// 优缺点：函数式编程风格，代码优雅。但由于每次使用了展开运算符 [...prev]，会不断创建新数组，在处理超大数组时内存开销较大。
function unique3(arr) {
    return arr.reduce((prev, cur) => {
        // 如果累加器数组中不包含当前元素，则拼接
        return prev.includes(cur) ? prev : [...prev, cur];
    }, []);
}

//如果面试官追问“如何对引用类型（如对象数组）去重？”，可以补充以下思路：
// 利用 Map 或者 对象键值对 来记录已经出现过的唯一标识（如对象的某个 ID）：
function uniqueObjects(arr, key) {
    const map = new Map();
    return arr.filter(item => !map.has(item[key]) && map.set(item[key], 1));
}
// 示例：uniqueObjects([{id:1}, {id:1}, {id:2}], 'id')

// 测试
const testArr = [1, 2, 2, 3, 3, 3, 4];
console.log('indexOf 去重:', unique1(testArr));   // [1, 2, 3, 4]
console.log('Set 去重:', unique2(testArr));        // [1, 2, 3, 4]
console.log('reduce 去重:', unique3(testArr));     // [1, 2, 3, 4]

const objArr = [{ id: 1 }, { id: 1 }, { id: 2 }];
console.log('对象数组去重:', uniqueObjects(objArr, 'id')); // [{ id: 1 }, { id: 2 }]