/**
 * 手写拖拽元素 & 图片懒加载
 *
 * 高频考点：DOM 事件操作、IntersectionObserver API
 */

// ==================== 拖拽元素 ====================
/**
 * 创建一个可拖拽的元素控制器
 * @param {HTMLElement} element - 需要被拖拽的 DOM 元素
 * @param {Object} [options] - 配置选项
 * @param {HTMLElement} [options.container] - 限制拖拽边界的父容器
 * @param {Function} [options.onStart] - 拖拽开始时的回调
 * @param {Function} [options.onDrag] - 拖拽过程中的回调，参数为 {x, y, event}
 * @param {Function} [options.onEnd] - 拖拽结束时的回调
 * @returns {{ destroy: Function }} 控制器对象，包含 destroy 方法
 */
function createDraggable(element, options = {}) {
  const {
    container = element.offsetParent || document.body,
    onStart,
    onDrag,
    onEnd,
  } = options;

  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  // 鼠标按下：记录初始位置并绑定移动和释放事件
  function onMouseDown(e) {
    // 防止文本选中和图片默认拖拽行为
    e.preventDefault();
    isDragging = true;

    // 记录鼠标按下时的坐标
    startX = e.clientX;
    startY = e.clientY;

    // 获取元素当前的定位偏移量（需确保元素 position 为 absolute/fixed）
    const computedStyle = window.getComputedStyle(element);
    initialLeft = parseInt(computedStyle.left) || 0;
    initialTop = parseInt(computedStyle.top) || 0;

    // 触发开始回调
    onStart && onStart({ x: initialLeft, y: initialTop, event: e });

    // 绑定全局的 mousemove 和 mouseup 事件，防止鼠标移出元素后丢失事件
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // 鼠标移动：计算偏移量并更新元素位置
  function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    // 计算鼠标移动的差值
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newLeft = initialLeft + deltaX;
    let newTop = initialTop + deltaY;

    // 边界限制：确保元素不超出父容器范围
    const maxLeft = container.clientWidth - element.offsetWidth;
    const maxTop = container.clientHeight - element.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    // 更新元素位置
    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;

    // 触发拖拽中回调
    onDrag && onDrag({ x: newLeft, y: newTop, event: e });
  }

  // 鼠标释放：清理状态并解绑全局事件
  function onMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;

    // 触发结束回调
    onEnd && onEnd({ event: e });

    // 移除全局事件监听，避免内存泄漏
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // 绑定 mousedown 事件到目标元素
  element.addEventListener('mousedown', onMouseDown);

  // 返回销毁方法，用于手动解除拖拽功能
  return {
    destroy() {
      element.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    },
  };
}

// ==================== 图片懒加载 ====================
/**
 * 图片懒加载控制器
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
            // 当元素进入视口（或达到 rootMargin 阈值）时触发
            if (entry.isIntersecting) {
              const img = entry.target;
              const realSrc = img.getAttribute('data-src');
              if (realSrc) {
                // 将 data-src 赋值给 src，触发真实图片加载
                img.src = realSrc;
                // 加载完成后移除 data-src 属性，避免重复处理
                img.removeAttribute('data-src');
              }
              // 图片已加载，停止观察该元素
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

// ==================== 使用示例 ====================
// HTML:
// <div id="container" style="position: relative; width: 500px; height: 500px;">
//   <div id="draggable" style="position: absolute; width: 100px; height: 100px; background: red;">
//     拖拽我
//   </div>
// </div>

// const container = document.getElementById('container');
// const draggable = document.getElementById('draggable');
//
// const controller = createDraggable(draggable, {
//   container,
//   onStart: ({ x, y }) => console.log('开始拖拽', x, y),
//   onDrag: ({ x, y }) => console.log('拖拽中', x, y),
//   onEnd: () => console.log('拖拽结束'),
// });
//
// // 销毁拖拽功能
// controller.destroy();

// 懒加载使用示例
// LazyLoad.init({ rootMargin: '100px' });
