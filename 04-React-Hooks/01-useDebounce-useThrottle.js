/**
 * 手写 React 自定义 Hooks —— useDebounce / useThrottle / useLocalStorage / usePrevious
 *
 * 高频考点：React Hooks 原理与实战应用
 * 注意：这些文件为 .js 格式，需在 React 项目环境中使用
 */

// ==================== useDebounce ====================
/**
 * 防抖 Hook
 * 在指定延迟时间后才更新值，适用于搜索输入等场景
 * @param {any} value - 原始值
 * @param {number} [delay=500] - 延迟时间（ms）
 * @returns {any} 防抖后的值
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedTerm = useDebounce(searchTerm, 500);
 * useEffect(() => {
 *   // 只在 debouncedTerm 变化时发起请求
 *   fetchResults(debouncedTerm);
 * }, [debouncedTerm]);
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次 value 变化时设置新的定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理上一次的定时器，避免内存泄漏
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== useThrottle ====================
/**
 * 节流 Hook
 * 在指定间隔内只更新一次值，适用于滚动、拖拽等高频事件
 * @param {any} value - 原始值
 * @param {number} [interval=300] - 节流间隔（ms）
 * @returns {any} 节流后的值
 */
function useThrottle(value, interval = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      // 已超过间隔时间，立即更新
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // 未到间隔时间，设置定时器在剩余时间后更新
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// ==================== useLocalStorage ====================
/**
 * localStorage 持久化 Hook
 * 自动序列化/反序列化，读写同步 localStorage
 * @param {string} key - 存储键名
 * @param {any} initialValue - 初始值
 * @returns {[any, Function]} [值, 设置值的函数]
 *
 * @example
 * const [name, setName] = useLocalStorage('user-name', 'Guest');
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: 读取 key "${key}" 失败`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: 写入 key "${key}" 失败`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ==================== usePrevious ====================
/**
 * 获取上一轮渲染时的值
 * @param {any} value - 当前值
 * @returns {any} 上一轮的值，首次渲染返回 undefined
 *
 * @example
 * const count = useState(0);
 * const prevCount = usePrevious(count);
 * console.log(prevCount); // 上一次渲染时的 count 值
 */
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    // 在渲染完成后更新 ref，保证当前渲染期间 ref 仍是上一轮的值
    ref.current = value;
  });

  return ref.current;
}

// ==================== 导出 ====================
export { useDebounce, useThrottle, useLocalStorage, usePrevious };
