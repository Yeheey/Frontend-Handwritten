/**
 * 驼峰互转 & 回文字符串判断
 *
 * 高频考点：正则表达式应用、双指针算法
 */

// ==================== camelCase 转 kebab-case ====================
/**
 * 将 camelCase 字符串转换为 kebab-case
 * 核心逻辑：使用正则匹配大写字母，并在其前面插入连字符，最后统一转小写
 * @param {string} str - 驼峰命名法字符串
 * @returns {string} 连字符命名法字符串
 *
 * @example
 * camelToKebab('myVariableName'); // 'my-variable-name'
 */
function camelToKebab(str) {
  if (typeof str !== 'string') return '';

  // 匹配所有大写字母，并在前面加上 '-'，最后全部转为小写
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// ==================== kebab-case 转 camelCase ====================
/**
 * 将 kebab-case 字符串转换为 camelCase
 * 核心逻辑：匹配连字符及其后的字母，将字母转为大写并替换原连字符
 * @param {string} str - 连字符命名法字符串
 * @returns {string} 驼峰命名法字符串
 *
 * @example
 * kebabToCamel('my-variable-name'); // 'myVariableName'
 */
function kebabToCamel(str) {
  if (typeof str !== 'string') return '';

  // 匹配 '-' 后跟任意字母，将捕获到的字母转为大写
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ==================== 回文字符串判断 ====================
/**
 * 判断字符串是否为回文串
 * 核心逻辑：预处理（去除非字母数字字符并转小写），然后使用双指针从两端向中间逼近比较
 * @param {string} s - 待判断的字符串
 * @returns {boolean} 是否为回文
 *
 * @example
 * isPalindrome('A man, a plan, a canal: Panama'); // true
 * isPalindrome('race a car');                      // false
 */
function isPalindrome(s) {
  // 1. 预处理：使用正则只保留字母和数字，并全部转为小写
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // 2. 双指针初始化
  let left = 0;
  let right = cleaned.length - 1;

  // 3. 向中间逼近比较
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false; // 只要有一对不匹配，直接返回 false
    }
    left++;
    right--;
  }

  return true; // 循环正常结束，说明是回文
}

// ==================== 测试用例 ====================

// 驼峰互转
console.log(camelToKebab('myVariableName'));       // 'my-variable-name'
console.log(camelToKebab('getElementById'));        // 'get-element-by-id'
console.log(kebabToCamel('my-variable-name'));      // 'myVariableName'
console.log(kebabToCamel('get-element-by-id'));     // 'getElementById'

// 回文判断
console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
console.log(isPalindrome('race a car'));                      // false
console.log(isPalindrome('abcba'));                           // true
console.log(isPalindrome('hello'));                           // false
console.log(isPalindrome('Was it a car or a cat I saw'));     // true
