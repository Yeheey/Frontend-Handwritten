/**
 * 手写简易版 useState / useEffect
 *
 * 高频考点：理解 React Hooks 的底层原理
 * 注意：这是概念演示，非 React 环境下的模拟实现
 */

// ==================== 简易 useState ====================
/**
 * 简易 useState 实现（非 React 环境下的概念演示）
 * 使用闭包存储 state，支持函数式更新和初始值函数
 * @param {any} initialState - 初始值或返回初始值的函数
 * @returns {[any, Function]} [state, setState]
 *
 * 原理说明：
 *   - 使用闭包保存 state 变量
 *   - setState 支持直接赋值和函数式更新 (prev => newValue)
 *   - 实际 React 中 setState 会触发组件重新渲染
 */
function useState(initialState) {
  // 支持初始值函数（惰性初始化）
  let state =
    typeof initialState === 'function'
      ? initialState()
      : initialState;

  const setState = (newValue) => {
    if (typeof newValue === 'function') {
      state = newValue(state);
    } else {
      state = newValue;
    }
    // 实际 React 中这里会触发重新渲染
    // 此处仅演示状态更新逻辑
    console.log('[useState] 状态已更新为:', state);
  };

  return [state, setState];
}

// ==================== 简易 useEffect ====================
/**
 * 简易 useEffect 实现（概念演示）
 * 依赖变化时执行回调，支持清理函数
 * @param {Function} effect - 副作用回调（可返回清理函数）
 * @param {Array} deps - 依赖数组
 *
 * 原理说明：
 *   - 使用闭包保存上一次依赖 (prevDeps) 和清理函数 (cleanup)
 *   - 每次调用时比较新旧依赖是否变化
 *   - 依赖变化时先执行上次的清理函数，再执行新的 effect
 *   - 使用 setTimeout 模拟浏览器渲染后执行（微任务/宏任务）
 */
function useEffect(effect, deps) {
  let prevDeps = undefined;
  let cleanup = undefined;

  const depsChanged =
    !prevDeps ||
    !deps ||
    deps.length !== prevDeps.length ||
    deps.some((dep, i) => !Object.is(dep, prevDeps[i]));

  if (depsChanged) {
    // 先执行上一次的清理函数
    if (typeof cleanup === 'function') {
      cleanup();
    }

    // 使用 setTimeout 模拟浏览器渲染后执行
    setTimeout(() => {
      cleanup = effect();
    }, 0);

    prevDeps = deps ? [...deps] : undefined;
  }
}

// ==================== 测试用例 ====================

// useState 测试
const [count, setCount] = useState(0);
console.log(count); // 0
setCount(1);
setCount((prev) => prev + 10);

// useState 惰性初始化
const [data, setData] = useState(() => {
  console.log('惰性初始化：只在首次执行');
  return { items: [] };
});

// useEffect 测试
useEffect(() => {
  console.log('effect 执行');

  // 返回清理函数
  return () => {
    console.log('cleanup 执行');
  };
}, [1, 2]);
