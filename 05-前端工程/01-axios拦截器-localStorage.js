/**
 * 简易 axios 拦截器封装 & localStorage 增强封装
 *
 * 高频考点：请求拦截器链式调用、本地存储增强（过期时间、序列化）
 */

// ==================== 简易 axios 拦截器封装 ====================
/**
 * 简易 axios 拦截器封装
 * 支持请求/响应拦截器链式调用、统一错误处理、baseURL 配置
 */
class SimpleAxios {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';

    // 拦截器存储：请求和响应各自维护一个数组
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * 注册拦截器
   * @param {string} type - 'request' | 'response'
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {number} 拦截器 ID
   */
  use(type, onFulfilled, onRejected) {
    this.interceptors[type].push({ onFulfilled, onRejected });
    return this.interceptors[type].length - 1;
  }

  /**
   * 发送请求，按顺序执行拦截器链
   * @param {Object} config - 请求配置
   * @returns {Promise} 响应结果
   */
  async request(config) {
    // 合并 baseURL
    if (this.baseURL && !config.url.startsWith('http')) {
      config.url = this.baseURL + config.url;
    }

    // 构建拦截器链：请求拦截器 → 实际请求 → 响应拦截器
    let chain = [
      // 实际请求作为核心
      (cfg) =>
        fetch(cfg.url, cfg).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        }),
    ];

    // 请求拦截器从前往后插入到链的前面
    this.interceptors.request.forEach(({ onFulfilled, onRejected }) => {
      chain.unshift(onFulfilled, onRejected);
    });

    // 响应拦截器从后往前追加到链的后面
    this.interceptors.response.forEach(({ onFulfilled, onRejected }) => {
      chain.push(onFulfilled, onRejected);
    });

    // 构建 Promise 链
    let promise = Promise.resolve(config);
    while (chain.length) {
      const handler = chain.shift();
      if (typeof handler === 'function') {
        promise = promise.then(handler, chain.shift());
      }
    }

    return promise;
  }

  // 便捷方法
  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request({
      ...config,
      url,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// ==================== localStorage 增强封装 ====================
/**
 * localStorage 增强封装
 * 支持自动序列化、过期时间（TTL）、批量操作
 */
const storage = {
  /**
   * 获取存储值，自动检查过期
   * @param {string} key - 键名
   * @returns {any} 解析后的值，过期或不存在返回 null
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      const { value, expiry } = JSON.parse(raw);

      // 检查是否过期
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch {
      return null;
    }
  },

  /**
   * 设置存储值，支持过期时间
   * @param {string} key - 键名
   * @param {any} value - 值
   * @param {Object} [options] - 配置项
   * @param {number} [options.ttl] - 过期时间（毫秒），0 或 undefined 表示永不过期
   */
  set(key, value, options = {}) {
    try {
      const { ttl = 0 } = options;
      const data = {
        value,
        expiry: ttl > 0 ? Date.now() + ttl : null,
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`storage.set: 写入 key "${key}" 失败`, error);
    }
  },

  /**
   * 删除指定键
   * @param {string} key - 键名
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * 清空所有存储
   */
  clear() {
    localStorage.clear();
  },

  /**
   * 批量获取多个键的值
   * @param {string[]} keys - 键名数组
   * @returns {Object} 键值对映射
   */
  multiGet(keys) {
    const result = {};
    keys.forEach((key) => {
      result[key] = this.get(key);
    });
    return result;
  },

  /**
   * 批量设置多个键值
   * @param {Object} entries - 键值对映射
   * @param {Object} [options] - 配置项（同 set）
   */
  multiSet(entries, options = {}) {
    Object.entries(entries).forEach(([key, value]) => {
      this.set(key, value, options);
    });
  },
};

// ==================== 测试用例 ====================

// SimpleAxios 测试
const axios = new SimpleAxios({ baseURL: 'https://api.example.com' });

// 注册请求拦截器：添加 token
axios.use('request', (config) => {
  config.headers = {
    ...config.headers,
    Authorization: 'Bearer xxx',
  };
  return config;
});

// 注册响应拦截器：统一处理错误
axios.use('response', (response) => {
  console.log('响应成功:', response);
  return response;
}, (error) => {
  console.error('响应失败:', error);
  return Promise.reject(error);
});

// localStorage 封装测试
storage.set('user', { name: 'Alice', age: 25 });
console.log(storage.get('user')); // { name: 'Alice', age: 25 }

storage.set('temp', 'expires soon', { ttl: 1000 }); // 1 秒后过期
console.log(storage.get('temp')); // 'expires soon'

// 批量操作
storage.multiSet({ a: 1, b: 2, c: 3 });
console.log(storage.multiGet(['a', 'b', 'c'])); // { a: 1, b: 2, c: 3 }
