/**
 * 懒加载 & 单例模式
 *
 * 高频考点：IntersectionObserver 实现图片懒加载，闭包实现单例
 */

// ==================== 图片懒加载（类封装版） ====================
/**
 * 基于 IntersectionObserver 的图片懒加载类
 * 支持批量监听、进入视口自动加载、销毁监听
 */
class LazyLoader {
  /**
   * @param {Object} options - 配置项
   * @param {string} [options.attr='data-src'] - 真实图片地址的属性名
   * @param {string} [options.rootMargin='0px'] - 提前加载的距离
   */
  constructor(options = {}) {
    this.attr = options.attr || 'data-src';
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当元素进入视口时
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute(this.attr);
            if (src) {
              img.src = src;
              img.removeAttribute(this.attr);
            }
            // 加载后取消监听
            this.observer.unobserve(img);
          }
        });
      },
      { rootMargin: options.rootMargin || '0px' }
    );
  }

  /**
   * 监听单个图片元素
   * @param {HTMLImageElement} img - 图片 DOM 元素
   */
  observe(img) {
    if (img && img.getAttribute(this.attr)) {
      this.observer.observe(img);
    }
  }

  /**
   * 批量监听所有带 data-src 的图片
   * @param {string} [selector='[data-src]'] - CSS 选择器
   */
  observeAll(selector = '[data-src]') {
    const imgs = document.querySelectorAll(selector);
    imgs.forEach((img) => this.observe(img));
  }

  /**
   * 销毁监听器，释放资源
   */
  destroy() {
    this.observer.disconnect();
    this.observer = null;
  }
}

// ==================== 图片懒加载（IIFE 单例版） ====================
/**
 * 图片懒加载控制器（单例模式 + 模块模式）
 * 使用 IntersectionObserver API 实现，当图片进入视口时加载真实图片
 */
const LazyLoad = (() => {
  let observer = null;

  return {
    /**
     * 初始化懒加载监听
     * @param {Object} [options] - 配置选项
     * @param {string} [options.rootMargin='0px'] - 提前加载的距离
     */
    init(options = {}) {
      const { rootMargin = '0px' } = options;

      // 如果已存在观察者，先销毁
      if (observer) {
        observer.disconnect();
      }

      // 创建 IntersectionObserver 实例
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const realSrc = img.getAttribute('data-src');
              if (realSrc) {
                img.src = realSrc;
                img.removeAttribute('data-src');
              }
              observer.unobserve(img);
            }
          });
        },
        { rootMargin }
      );

      // 查找所有带有 data-src 属性的 img 元素并开始观察
      const images = document.querySelectorAll('img[data-src]');
      images.forEach((img) => observer.observe(img));
    },

    /**
     * 销毁所有监听，释放资源
     */
    destroy() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
})();

// ==================== 单例模式工厂函数 ====================
/**
 * 单例模式工厂函数
 * 使用闭包保存实例，确保只创建一个实例
 * @param {Function} Creator - 构造函数
 * @returns {Function} 返回 getInstance 方法
 *
 * @example
 * class Database {
 *   constructor(name) { this.name = name; }
 * }
 * const getDB = createSingleton(Database);
 * const db1 = getDB('myDB');
 * const db2 = getDB('otherDB');
 * console.log(db1 === db2); // true
 * console.log(db1.name);    // 'myDB'
 */
function createSingleton(Creator) {
  let instance = null;

  return function getInstance(...args) {
    if (!instance) {
      instance = new Creator(...args);
    }
    return instance;
  };
}

// ==================== 测试用例 ====================

// 单例模式测试
class Database {
  constructor(name) {
    this.name = name;
  }
}

const getDB = createSingleton(Database);
const db1 = getDB('myDB');
const db2 = getDB('otherDB');

console.log(db1 === db2); // true
console.log(db1.name);    // myDB（第一次创建的实例）

// 懒加载使用示例（需在浏览器环境）
// const loader = new LazyLoader({ rootMargin: '100px' });
// loader.observeAll();

// LazyLoad.init({ rootMargin: '200px' });
