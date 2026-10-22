/**
 * 二叉树遍历 —— 前序 / 中序 / 后序（递归 + 迭代）
 *
 * 高频考点：二叉树遍历是面试算法题的基础，必须熟练掌握递归和迭代两种写法
 */

// ==================== 前序遍历（递归） ====================
/**
 * 二叉树前序遍历（递归）
 * 遍历顺序：根节点 → 左子树 → 右子树
 * @param {object|null} root - 二叉树根节点 { val, left, right }
 * @returns {number[]} 前序遍历结果数组
 */
function preorderRecursive(root) {
  const result = [];

  function traverse(node) {
    if (node === null) return;
    result.push(node.val);     // 1. 访问根节点
    traverse(node.left);       // 2. 遍历左子树
    traverse(node.right);      // 3. 遍历右子树
  }

  traverse(root);
  return result;
}

// ==================== 前序遍历（迭代） ====================
/**
 * 二叉树前序遍历（迭代 - 使用栈）
 * 核心逻辑：利用栈的后进先出特性，先将右子节点入栈，再将左子节点入栈，
 * 保证出栈时先处理左子树
 * @param {object|null} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果数组
 */
function preorderIterative(root) {
  if (!root) return [];

  const result = [];
  const stack = [root]; // 初始化栈，根节点入栈

  while (stack.length > 0) {
    const node = stack.pop();     // 弹出栈顶节点
    result.push(node.val);        // 访问根节点

    // 注意：先压入右子节点，再压入左子节点
    // 这样出栈时左子节点先被处理，符合 根→左→右 的顺序
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}

// ==================== 中序遍历（递归） ====================
/**
 * 二叉树中序遍历（递归）
 * 遍历顺序：左子树 → 根节点 → 右子树
 * @param {object|null} root - 二叉树根节点
 * @returns {number[]} 中序遍历结果数组
 */
function inorderRecursive(root) {
  const result = [];

  function traverse(node) {
    if (node === null) return;
    traverse(node.left);       // 1. 遍历左子树
    result.push(node.val);     // 2. 访问根节点
    traverse(node.right);      // 3. 遍历右子树
  }

  traverse(root);
  return result;
}

// ==================== 中序遍历（迭代） ====================
/**
 * 二叉树中序遍历（迭代 - 使用栈）
 * 核心逻辑：不断将左子节点入栈直到最左端，然后弹出访问，再转向其右子树
 * @param {object|null} root - 二叉树根节点
 * @returns {number[]} 中序遍历结果数组
 */
function inorderIterative(root) {
  const result = [];
  const stack = [];
  let curr = root;

  // 当当前节点不为空或栈不为空时继续
  while (curr !== null || stack.length > 0) {
    // 1. 将当前节点及其所有左子节点依次入栈
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }

    // 2. 弹出栈顶节点（即最左端的节点）并访问
    curr = stack.pop();
    result.push(curr.val);

    // 3. 转向右子树
    curr = curr.right;
  }

  return result;
}

// ==================== 后序遍历（递归） ====================
/**
 * 二叉树后序遍历（递归）
 * 遍历顺序：左子树 → 右子树 → 根节点
 * @param {object|null} root - 二叉树根节点
 * @returns {number[]} 后序遍历结果数组
 */
function postorderRecursive(root) {
  const result = [];

  function traverse(node) {
    if (node === null) return;
    traverse(node.left);       // 1. 遍历左子树
    traverse(node.right);      // 2. 遍历右子树
    result.push(node.val);     // 3. 访问根节点
  }

  traverse(root);
  return result;
}

// ==================== 后序遍历（迭代） ====================
/**
 * 二叉树后序遍历（迭代）
 * 核心逻辑：后序遍历是 左→右→根，可以借助前序遍历（根→左→右）的变体：
 * 先按 根→右→左 的顺序收集结果，最后将结果数组反转，即得到 左→右→根
 * @param {object|null} root - 二叉树根节点
 * @returns {number[]} 后序遍历结果数组
 */
function postorderIterative(root) {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);      // 先收集根节点

    // 先压左子节点，再压右子节点（与前序相反）
    // 出栈时右子节点先被处理，形成 根→右→左 的顺序
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  // 反转结果数组：根→右→左 变为 左→右→根
  return result.reverse();
}

// ==================== 辅助函数 ====================

/**
 * 根据数组创建二叉树（层序构建）
 * @param {Array} arr - 层序遍历数组，null 表示空节点
 * @returns {object|null} 二叉树根节点
 *
 * @example
 * // 构建二叉树：
 * //       1
 * //      / \
 * //     2   3
 * //    / \
 * //   4   5
 * createTree([1, 2, 3, 4, 5]);
 */
function createTree(arr) {
  if (arr.length === 0 || arr[0] === null) return null;

  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;

  while (i < arr.length) {
    const current = queue.shift();

    // 左子节点
    if (i < arr.length && arr[i] !== null) {
      current.left = { val: arr[i], left: null, right: null };
      queue.push(current.left);
    }
    i++;

    // 右子节点
    if (i < arr.length && arr[i] !== null) {
      current.right = { val: arr[i], left: null, right: null };
      queue.push(current.right);
    }
    i++;
  }

  return root;
}

// ==================== 测试用例 ====================

// 构建测试二叉树：
//       1
//      / \
//     2   3
//    / \
//   4   5
const tree = createTree([1, 2, 3, 4, 5]);

// 前序遍历：1, 2, 4, 5, 3
console.log('前序(递归):', preorderRecursive(tree));
console.log('前序(迭代):', preorderIterative(tree));

// 中序遍历：4, 2, 5, 1, 3
console.log('中序(递归):', inorderRecursive(tree));
console.log('中序(迭代):', inorderIterative(tree));

// 后序遍历：4, 5, 2, 3, 1
console.log('后序(递归):', postorderRecursive(tree));
console.log('后序(迭代):', postorderIterative(tree));
