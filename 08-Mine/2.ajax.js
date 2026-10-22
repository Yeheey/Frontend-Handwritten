// 二、原生 AJAX 封装
/*
手写原生AJAX，支持GET异步请求，兼容旧版IE，做好异常处理，通过回调返回结果。
核心原理:
基于 XMLHttpRequest 对象实现异步通信，监听请求状态变化，区分成功、失败场景，兼容IE低版本，做好参数校验和异常捕获。
常见易错点:
忽略IE兼容性，未做 ActiveXObject 兼容处理
未处理状态码为0的网络异常场景
缺少参数校验，回调逻辑无容错
*/
/**
 * 原生AJAX（GET异步）
 * @param {string} method - 请求方法
 * @param {string} url - 请求地址
 * @param {Function} callback - 回调函数 (err, data)
 */
function ajax(method, url, callback) {
    // 参数校验
    if (typeof method !== 'string' || typeof url !== 'string') {
        throw new Error('method和url需为字符串类型');
    }
    if (typeof callback !== 'function') {
        throw new Error('callback需为函数类型');
    }

    // 兼容创建XHR实例
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // 初始化请求
    const upperMethod = method.toUpperCase();
    xhr.open(upperMethod, url, true);
    xhr.send(null);

    // 状态监听
    xhr.onreadystatechange = function() {
        if (!xhr) return;
        if (xhr.readyState === 4) {
            try {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    const errMsg = xhr.status === 0 ? '网络异常或跨域拦截' : `请求失败，状态码：${xhr.status}`;
                    callback(new Error(errMsg), null);
                }
            } catch (e) {
                callback(new Error(`响应处理失败：${e.message}`), null);
            } finally {
                xhr = null;
            }
        }
    };
}

// 测试
ajax('GET', 'https://jsonplaceholder.typicode.com/todos/1', (err, data) => {
    if (err) return console.error('请求失败', err);
    console.log('请求成功', JSON.parse(data));
});

