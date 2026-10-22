/*
六、数组扁平化（递归+栈）
📌 题目要求
将多维数组转为一维数组，实现递归和非递归（栈）两种方案，面试可灵活作答。
*/

/*拓展：ES6+ 可使用 arr.flat(Infinity) 快速实现任意维度扁平化，面试可作为补充思路。*/

// 方案1：递归实现（简洁易懂）
// 递归版数组扁平化
function flatten1(arr) {
    if (!Array.isArray(arr)) return [arr];
    return arr.reduce((acc, val) => {
        return acc.concat(Array.isArray(val) ? flatten1(val) : val);
    }, []);
}

// 方案2：栈实现（非递归，性能更优）
// 栈版数组扁平化
function flatten2(arr) {
    if (!Array.isArray(arr)) return [arr];
    const res = [];
    const stack = [...arr];

    while (stack.length) {
        const cur = stack.pop();
        if (Array.isArray(cur)) {
            stack.push(...cur);
        } else {
            res.push(cur);
        }
    }
    return res.reverse();
}

// 测试
const multiArr = [1, [2, [3, 4], 5], 6];
console.log(flatten1(multiArr)); // [1,2,3,4,5,6]
