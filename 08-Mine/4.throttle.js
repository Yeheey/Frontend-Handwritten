/*
四、节流函数（Throttle）
📌 题目要求
实现节流函数，单位时间内仅执行一次目标函数，过滤高频重复触发，保留this指向和参数传递。

适用场景：滚动加载、窗口resize、按钮频繁点击

🧠 核心原理
利用闭包保存上一次执行时间，每次触发判断时间间隔，达到阈值再执行，否则忽略本次触发。

❌ 常见易错点
未绑定this，导致回调中this指向异常
无法接收外部传参，功能受限
缺少参数默认值和类型校验*/

/**
 * 节流函数（时间戳版，立即执行）
 * @param {Function} fn - 目标函数
 * @param {number} wait - 间隔时间，默认300ms
 * @returns {Function} 节流后的函数
 */
function throttle(fn, wait = 300) {
    if (typeof fn !== 'function') throw new Error('fn需为函数');
    let lastTime = 0;

    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

// 测试
const handleScroll = throttle(() => {
    console.log('滚动触发', Date.now());
}, 1000);
window.addEventListener('scroll', handleScroll);

