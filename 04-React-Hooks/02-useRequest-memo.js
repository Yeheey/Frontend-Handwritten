/**
 * 手写 React 自定义 Hooks —— useRequest / memo / useMemo / useCallback
 *
 * 高频考点：请求管理 Hook 和 React 性能优化相关 Hook 的原理
 */

// ==================== useRequest ====================
/**
 * 简易请求 Hook
 * 管理 loading/data/error 状态，支持自动/手动触发、防抖
 * @param {Function} service - 异步请求函数
 * @param {Object} [options] - 配置项
 * @param {Array} [options.deps=[]] - 依赖数组，变化时自动请求
 * @param {boolean} [options.manual=false] - 是否手动触发
 * @param {number} [options.debounce=0] - 防抖延迟（ms），0 表示不防抖
 * @returns {Object} { data, loading, error, run }
 *
 * @example
 * const { data, loading, error, run } = useRequest(
 *   (id) => fetch(`/api/user/${id}`).then(res => res.json()),
 *   { deps: [userId], manual: false }
 * );
 */
function useRequest(service, options = {}) {
  const { deps = [], manual = false, debounce = 0 } = options;

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // 核心请求执行函数
  const run = useCallback((...args) => {
    const execute = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await service(...args);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // 防抖处理
    if (debounce > 0) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(execute, debounce);
    } else {
      execute();
    }
  }, [service, debounce]);

  // 自动请求：依赖变化时触发
  useEffect(() => {
    if (!manual) {
      run();
    }
    return () => clearTimeout(timerRef.current);
  }, deps);

  return { data, loading, error, run };
}

// ==================== memo 简易版 ====================
/**
 * 简易 memo 实现
 * 当 props 未变化时跳过重新渲染
 * @param {Function} Component - 原始组件
 * @param {Function} [propsAreEqual] - 自定义比较函数，返回 true 表示 props 相等
 * @returns {Function} 包装后的组件
 */
function memo(Component, propsAreEqual) {
  // 默认浅比较
  const defaultCompare = (prev, next) => {
    const keysA = Object.keys(prev);
    const keysB = Object.keys(next);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => prev[key] === next[key]);
  };

  const compare = propsAreEqual || defaultCompare;

  function Memoized(props) {
    // 使用 useMemo 缓存渲染结果，依赖为 props 的各个值
    const rendered = useMemo(
      () => Component(props),
      Object.values(props)
    );
    return rendered;
  }

  Memoized.displayName = `Memo(${Component.displayName || Component.name})`;

  return Memoized;
}

// ==================== useMemo 简易版 ====================
/**
 * 简易 useMemo 实现
 * 依赖不变时返回缓存值，变化时重新计算
 * @param {Function} createFn - 创建缓存值的函数
 * @param {Array} deps - 依赖数组
 * @returns {any} 缓存的计算结果
 */
function useMemo(createFn, deps) {
  const cacheRef = useRef({ deps: undefined, value: undefined });

  // 判断依赖是否变化
  const depsChanged =
    !cacheRef.current.deps ||
    deps.length !== cacheRef.current.deps.length ||
    deps.some((dep, i) => !Object.is(dep, cacheRef.current.deps[i]));

  if (depsChanged) {
    cacheRef.current = { deps, value: createFn() };
  }

  return cacheRef.current.value;
}

// ==================== useCallback 简易版 ====================
/**
 * 简易 useCallback 实现
 * 依赖不变时返回同一个函数引用
 * @param {Function} callback - 回调函数
 * @param {Array} deps - 依赖数组
 * @returns {Function} 缓存的函数
 */
function useCallback(callback, deps) {
  const cacheRef = useRef({ deps: undefined, callback: undefined });

  const depsChanged =
    !cacheRef.current.deps ||
    deps.length !== cacheRef.current.deps.length ||
    deps.some((dep, i) => !Object.is(dep, cacheRef.current.deps[i]));

  if (depsChanged) {
    cacheRef.current = { deps, callback };
  }

  return cacheRef.current.callback;
}

// ==================== 导出 ====================
export { useRequest, memo, useMemo, useCallback };
