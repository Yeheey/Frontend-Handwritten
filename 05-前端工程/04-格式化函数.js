/**
 * 时间格式化 / 数字千分位 / 金额格式化
 *
 * 高频考点：实际工程中常用的工具函数手写
 */

// ==================== 时间格式化函数 ====================
/**
 * 时间格式化函数
 * @param {Date|number} date - Date 对象或毫秒时间戳
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式模板
 * @returns {string} 格式化后的时间字符串
 *
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD');          // '2024-01-15'
 * formatDate(1705300000000, 'YYYY/MM/DD HH:mm'); // '2024/01/15 10:26'
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  // 如果传入的是时间戳（数字），转换为 Date 对象
  if (typeof date === 'number') {
    date = new Date(date);
  }

  // 校验 date 是否为有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  // 提取各时间部分
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回 0-11
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 补零函数：将个位数补为两位
  const padZero = (num) => String(num).padStart(2, '0');

  // 构建替换映射表
  const replacements = {
    'YYYY': year,
    'MM': padZero(month),
    'DD': padZero(day),
    'HH': padZero(hours),
    'mm': padZero(minutes),
    'ss': padZero(seconds),
  };

  // 按模板中的占位符进行替换（注意替换顺序，长占位符优先）
  let result = format;
  for (const [token, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(token, 'g'), value);
  }

  return result;
}

// ==================== 数字千分位格式化 ====================
/**
 * 数字千分位格式化函数
 * @param {number|string} num - 待格式化的数字
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的字符串，非数字返回原值
 *
 * @example
 * formatThousands(1234567.89);     // '1,234,567.89'
 * formatThousands(1234567, 0);     // '1,234,567'
 * formatThousands(-9876543.21);    // '-9,876,543.21'
 */
function formatThousands(num, decimals = 2) {
  // 处理非数字输入
  if (num === null || num === undefined || num === '') return String(num);

  // 尝试转换为数字
  const number = Number(num);
  if (isNaN(number)) return String(num);

  // 判断是否为负数
  const isNegative = number < 0;
  const absNum = Math.abs(number);

  // 保留指定小数位数并转为字符串
  const fixedStr = absNum.toFixed(decimals);
  const [intPart, decPart] = fixedStr.split('.');

  // 使用正则对整数部分进行千分位分隔
  // 匹配规则：从右往左，每三位数字前插入逗号（排除开头的数字）
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 拼接整数部分和小数部分
  const result = decPart ? `${formattedInt}.${decPart}` : formattedInt;

  // 如果是负数，添加负号前缀
  return isNegative ? `-${result}` : result;
}

// ==================== 金额格式化 ====================
/**
 * 金额格式化函数
 * @param {number|string} amount - 金额数值
 * @param {Object} [options] - 配置选项
 * @param {number} [options.decimals=2] - 小数位数
 * @param {string} [options.prefix=''] - 货币符号前缀，如 '¥'、'$'
 * @returns {string} 格式化后的金额字符串
 *
 * @example
 * formatCurrency(1234567.8);               // '1,234,567.80'
 * formatCurrency(1234567.8, { prefix: '¥' }); // '¥1,234,567.80'
 * formatCurrency(-999, { prefix: '$' });    // '-$999.00'
 */
function formatCurrency(amount, options = {}) {
  const { decimals = 2, prefix = '' } = options;

  // 处理空值和零值
  if (amount === null || amount === undefined || amount === '') {
    const zeroStr = `0.${'0'.repeat(decimals)}`;
    return prefix ? `${prefix}${zeroStr}` : zeroStr;
  }

  // 转换为数字
  const num = Number(amount);
  if (isNaN(num)) {
    const zeroStr = `0.${'0'.repeat(decimals)}`;
    return prefix ? `${prefix}${zeroStr}` : zeroStr;
  }

  // 判断正负
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // 固定小数位数
  const fixedStr = absNum.toFixed(decimals);
  const [intPart, decPart] = fixedStr.split('.');

  // 整数部分千分位分隔
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 拼接结果
  let result = decPart ? `${formattedInt}.${decPart}` : formattedInt;

  // 添加负号和货币前缀
  if (isNegative) {
    result = `-${result}`;
  }

  return prefix ? `${prefix}${result}` : result;
}

// ==================== 测试用例 ====================

// 时间格式化
console.log(formatDate(new Date('2024-01-15T10:30:45')));
// '2024-01-15 10:30:45'

console.log(formatDate(new Date('2024-01-15T10:30:45'), 'YYYY/MM/DD'));
// '2024/01/15'

console.log(formatDate(new Date('2024-01-15T10:30:45'), 'HH:mm:ss'));
// '10:30:45'

// 千分位格式化
console.log(formatThousands(1234567.89));    // '1,234,567.89'
console.log(formatThousands(1234567, 0));    // '1,234,567'
console.log(formatThousands(-9876543.21));   // '-9,876,543.21'
console.log(formatThousands(0));             // '0.00'

// 金额格式化
console.log(formatCurrency(1234567.8));             // '1,234,567.80'
console.log(formatCurrency(1234567.8, { prefix: '¥' })); // '¥1,234,567.80'
console.log(formatCurrency(-999, { prefix: '$' }));      // '-$999.00'
console.log(formatCurrency(null));                        // '0.00'
