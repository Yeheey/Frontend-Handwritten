/**
 * 反转单链表
 *
 * 高频考点：链表操作是面试算法题的基础，反转链表出现频率极高
 */

// ==================== 迭代方式反转单链表 ====================
/**
 * 迭代方式反转单链表
 * 核心逻辑：使用三个指针（prev, curr, next）在遍历过程中逐个反转节点的 next 指向
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * @param {object|null} head - 链表头节点 { val, next }
 * @returns {object|null} 反转后的新头节点
 *
 * @example
 * // 构建链表：1 -> 2 -> 3 -> null
 * const head = { val: 1, next: { val: 2, next: { val: 3, next: null } } };
 * const newHead = reverseLinkedList(head);
 * // 结果：3 -> 2 -> 1 -> null
 */
function reverseLinkedList(head) {
  let prev = null;  // 前一个节点，初始为 null
  let curr = head;  // 当前节点

  while (curr !== null) {
    const next = curr.next; // 暂存下一个节点，防止断链
    curr.next = prev;       // 反转指向：当前节点指向前一个节点
    prev = curr;            // prev 前进
    curr = next;            // curr 前进
  }

  // 循环结束时，prev 即为新的头节点
  return prev;
}

// ==================== 递归方式反转单链表 ====================
/**
 * 递归方式反转单链表
 * 核心逻辑：递归到链表末尾，然后在回溯过程中反转每个节点的 next 指向
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)（递归调用栈）
 *
 * @param {object|null} head - 链表头节点
 * @returns {object|null} 反转后的新头节点
 */
function reverseLinkedListRecursive(head) {
  // 递归终止条件：空链表或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }

  // 递归反转后续链表，得到新的头节点
  const newHead = reverseLinkedListRecursive(head.next);

  // 反转当前节点和下一个节点的指向
  head.next.next = head;
  head.next = null;

  return newHead;
}

// ==================== 辅助函数 ====================

/**
 * 根据数组创建链表
 * @param {Array} arr - 元素数组
 * @returns {object|null} 链表头节点
 */
function createLinkedList(arr) {
  if (arr.length === 0) return null;

  const dummy = { val: 0, next: null };
  let current = dummy;

  for (const val of arr) {
    current.next = { val, next: null };
    current = current.next;
  }

  return dummy.next;
}

/**
 * 将链表转为数组（方便打印）
 * @param {object|null} head - 链表头节点
 * @returns {Array} 元素数组
 */
function linkedListToArray(head) {
  const result = [];
  let current = head;

  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

// ==================== 测试用例 ====================

// 迭代方式
const list1 = createLinkedList([1, 2, 3, 4, 5]);
console.log('原始链表:', linkedListToArray(list1));       // [1, 2, 3, 4, 5]

const reversed1 = reverseLinkedList(list1);
console.log('迭代反转:', linkedListToArray(reversed1));   // [5, 4, 3, 2, 1]

// 递归方式
const list2 = createLinkedList([1, 2, 3, 4, 5]);
const reversed2 = reverseLinkedListRecursive(list2);
console.log('递归反转:', linkedListToArray(reversed2));   // [5, 4, 3, 2, 1]

// 边界测试
console.log('空链表:', linkedListToArray(reverseLinkedList(null)));         // []
console.log('单节点:', linkedListToArray(reverseLinkedList({ val: 1, next: null }))); // [1]
