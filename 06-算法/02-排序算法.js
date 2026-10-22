/**
 * 排序算法 —— 冒泡排序 / 快速排序 / 归并排序
 *
 * 高频考点：排序算法是面试中最常见的算法手写题
 * 重点掌握快排（分治）和归并（稳定排序）
 */

// ==================== 冒泡排序 ====================
/**
 * 冒泡排序（带提前退出优化）
 * 核心逻辑：相邻元素两两比较，将较大的元素"冒泡"到数组末尾
 * 优化点：如果某一轮遍历没有发生任何交换，说明数组已有序，提前退出
 * 时间复杂度：最优 O(n)，最差 O(n²)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 *
 * @param {number[]} arr - 待排序数组（原地修改）
 * @param {Function} [compareFn] - 可选的自定义比较函数
 * @returns {number[]} 排序后的数组
 */
function bubbleSort(arr, compareFn = (a, b) => a - b) {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let swapped = false; // 标志位：记录本轮是否发生过交换

    // 每轮遍历后，末尾的 i 个元素已就位，无需再比较
    for (let j = 0; j < len - 1 - i; j++) {
      if (compareFn(arr[j], arr[j + 1]) > 0) {
        // 交换相邻元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果本轮没有发生交换，说明已经有序，提前退出
    if (!swapped) break;
  }

  return arr;
}

// ==================== 快速排序 ====================
/**
 * 快速排序
 * 核心逻辑：分治思想。选择一个基准值（pivot），将数组分为小于、等于、大于基准值的三部分，递归排序后合并
 * 时间复杂度：平均 O(n log n)，最差 O(n²)
 * 空间复杂度：O(n)
 * 稳定性：不稳定
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的新数组
 */
function quickSort(arr) {
  // 递归终止条件：数组长度小于等于 1
  if (arr.length <= 1) return arr;

  // 选择基准值（这里选择中间元素，避免最坏情况）
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];

  // 分区：将数组分为三部分
  const left = [];   // 小于基准值的元素
  const middle = []; // 等于基准值的元素
  const right = [];  // 大于基准值的元素

  for (const num of arr) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else middle.push(num);
  }

  // 递归排序左右子数组，并与中间部分合并
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// ==================== 归并排序 ====================
/**
 * 归并排序
 * 核心逻辑：分治思想。将数组不断二分直到单个元素，然后自底向上合并两个有序数组
 * 特点：时间复杂度稳定 O(n log n)，且是稳定排序
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 * 稳定性：稳定
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的新数组
 */
function mergeSort(arr) {
  // 递归终止条件
  if (arr.length <= 1) return arr;

  // 1. 分解：找到中间索引，将数组一分为二
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // 2. 合并：将两个有序数组合并为一个有序数组
  return merge(left, right);
}

/**
 * 合并两个有序数组
 * @param {number[]} left - 左有序数组
 * @param {number[]} right - 右有序数组
 * @returns {number[]} 合并后的有序数组
 */
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  // 双指针比较，将较小的元素放入结果数组
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) { // <= 保证稳定性
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // 将剩余元素追加到结果数组
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// ==================== 测试用例 ====================
const testArr = [5, 3, 8, 4, 2, 7, 1, 6];

console.log('冒泡排序:', bubbleSort([...testArr]));
// [1, 2, 3, 4, 5, 6, 7, 8]

console.log('快速排序:', quickSort([...testArr]));
// [1, 2, 3, 4, 5, 6, 7, 8]

console.log('归并排序:', mergeSort([...testArr]));
// [1, 2, 3, 4, 5, 6, 7, 8]

// 边界测试
console.log(quickSort([]));          // []
console.log(quickSort([1]));         // [1]
console.log(quickSort([3, 3, 3]));   // [3, 3, 3]
console.log(quickSort([5, 4, 3, 2, 1])); // [1, 2, 3, 4, 5]
