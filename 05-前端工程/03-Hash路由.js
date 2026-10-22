/**
 * 简易 Hash 路由实现
 *
 * 高频考点：前端路由原理，hashchange 事件监听，通配符参数匹配
 */

class HashRouter {
  constructor() {
    // 存储注册的路由规则：{ path: callback }
    this.routes = {};

    // 当前匹配到的路由回调
    this.currentHandler = null;

    // 绑定 hashchange 事件监听器
    this._onHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._onHashChange);

    // 初始化时立即执行一次路由匹配（处理首次加载或刷新）
    this._onHashChange();
  }

  /**
   * 注册路由
   * @param {string} path - 路由路径，支持 :param 通配符，如 /user/:id
   * @param {Function} callback - 路由匹配时执行的回调，接收 params 对象
   */
  register(path, callback) {
    this.routes[path] = callback;
  }

  /**
   * 编程式导航：修改 hash 触发路由切换
   * @param {string} path - 目标路径，如 /user/123
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * 获取当前 hash 路径（去除 # 号）
   * @returns {string} 当前路径
   */
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }

  /**
   * 内部方法：hash 变化时的处理逻辑
   */
  _onHashChange() {
    const currentPath = this.getCurrentPath();
    let matched = false;

    // 遍历所有注册的路由进行匹配
    for (const routePath in this.routes) {
      const params = this._matchRoute(routePath, currentPath);
      if (params !== null) {
        // 路由匹配成功，执行回调并传入解析出的参数
        this.routes[routePath](params);
        matched = true;
        break;
      }
    }

    // 如果没有匹配到任何路由
    if (!matched) {
      console.warn(`[HashRouter] 未匹配到路由: ${currentPath}`);
    }
  }

  /**
   * 内部方法：匹配路由路径，支持通配符 :param
   * @param {string} routePath - 注册的路由模板，如 /user/:id
   * @param {string} currentPath - 当前实际路径，如 /user/123
   * @returns {Object|null} 匹配成功返回参数对象，失败返回 null
   */
  _matchRoute(routePath, currentPath) {
    // 将路由模板中的 :param 转换为正则捕获组
    const paramNames = [];
    const regexStr = routePath.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });

    // 构建完整的正则表达式，要求完全匹配
    const regex = new RegExp(`^${regexStr}$`);
    const match = currentPath.match(regex);

    if (!match) return null;

    // 将捕获到的值映射到参数名
    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return params;
  }

  /**
   * 销毁路由器，移除事件监听
   */
  destroy() {
    window.removeEventListener('hashchange', this._onHashChange);
    this.routes = {};
  }
}

// ==================== 测试用例 ====================
// const router = new HashRouter();
//
// // 注册路由
// router.register('/', (params) => {
//   console.log('首页', params); // {}
// });
//
// router.register('/user/:id', (params) => {
//   console.log('用户详情', params); // { id: '123' }
// });
//
// router.register('/post/:postId/comment/:commentId', (params) => {
//   console.log('评论详情', params); // { postId: '1', commentId: '42' }
// });
//
// // 编程式导航
// router.navigate('/user/123');
// // 输出：用户详情 { id: '123' }
//
// router.navigate('/post/1/comment/42');
// // 输出：评论详情 { postId: '1', commentId: '42' }
