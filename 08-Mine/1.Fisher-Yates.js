// 一、数组乱序：Fisher-Yates 洗牌算法
/*
实现函数随机打乱数组，保证每个元素出现在各位置概率均等，兼顾性能，不随意修改原数组。

示例：输入 [1,2,3] → 输出可为 [2,1,3]、[3,1,2] 等随机结果

采用 Fisher-Yates 洗牌算法，时间复杂度 O(n)，空间复杂度 O(1)（原地洗牌），是业界公认的均匀洗牌方案：

从数组末尾向前遍历，减少重复交换
每次生成 [0, 当前索引] 范围内的随机下标
交换当前元素与随机位置元素，保证随机性

避坑提示：不建议用 sort(() => Math.random() - 0.5) 打乱数组，该方式概率分布不均，属于面试常见易错点。
*/

/**
 * 数组洗牌（Fisher-Yates 算法）
 * @param {Array} arr - 原始数组
 * @param {boolean} isMutate - 是否修改原数组，默认false
 * @returns {Array} 乱序后的数组
 */
function getArrRandom(arr, isMutate = false) {
    // 参数校验
    if (!Array.isArray(arr)) throw new Error('参数必须为数组');
    // 非原地洗牌，避免副作用
    const newArr = isMutate ? arr : [...arr];
    const len = newArr.length;

    for (let i = len - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // 解构交换
        [newArr[randomIndex], newArr[i]] = [newArr[i], newArr[randomIndex]];
    }
    return newArr;
}

// 测试
const arr = [1,2,3,4,5];
console.log(getArrRandom(arr));
console.log(arr); // 原数组不变
