/*
五、防抖函数（Debounce）
📌 题目要求
实现防抖函数，触发后等待指定时间再执行，期间重复触发则重新计时，支持立即执行模式。

适用场景：搜索框联想、输入校验、按钮防重复点击

🧠 核心原理
闭包保存定时器ID，每次触发先清除旧定时器、再新建定时器，确保仅最后一次触发有效。*/
/**
 * 防抖函数
 * @param {Function} fn - 目标函数
 * @param {number} wait - 等待时间，默认300ms
 * @param {boolean} immediate - 是否立即执行，默认false
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, wait = 300, immediate = false) {
    if (typeof fn !== 'function') throw new Error('fn需为函数');
    let timer = null;

    return function(...args) {
        // 立即执行逻辑
        if (immediate && !timer) fn.apply(this, args);
        // 清除旧定时器，重新计时
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!immediate) fn.apply(this, args);
            timer = null;
        }, wait);
    };
}

// 测试
const handleSearch = debounce((e) => {
    console.log('搜索内容：', e.target.value);
}, 500);
// 实际使用可绑定input事件
// input.addEventListener('input', handleSearch);
