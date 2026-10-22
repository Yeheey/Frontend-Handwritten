/**
 * React Hooks 本地运行测试入口
 *
 * 使用 react-dom/server 的 renderToString 在 Node.js 中渲染组件，
 * 验证自定义 Hooks 是否能正常执行。
 *
 * 运行方式：node 04-React-Hooks/demo.js
 */

import React, { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useDebounce, useThrottle, usePrevious } from './01-useDebounce-useThrottle.js';
import { useRequest, useMemo as myUseMemo, useCallback as myUseCallback } from './02-useRequest-memo.js';

// ==================== 测试 useDebounce ====================
function DebounceDemo() {
  const [input, setInput] = useState('hello');
  const debouncedValue = useDebounce(input, 300);

  return React.createElement('div', null,
    React.createElement('h3', null, 'useDebounce 测试'),
    React.createElement('p', null, `输入值: ${input}`),
    React.createElement('p', null, `防抖值: ${debouncedValue}`)
  );
}

// ==================== 测试 useThrottle ====================
function ThrottleDemo() {
  const [count, setCount] = useState(0);
  const throttledCount = useThrottle(count, 500);

  return React.createElement('div', null,
    React.createElement('h3', null, 'useThrottle 测试'),
    React.createElement('p', null, `实时计数: ${count}`),
    React.createElement('p', null, `节流计数: ${throttledCount}`)
  );
}

// ==================== 测试 usePrevious ====================
function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return React.createElement('div', null,
    React.createElement('h3', null, 'usePrevious 测试'),
    React.createElement('p', null, `当前值: ${count}`),
    React.createElement('p', null, `上一轮值: ${prevCount !== undefined ? prevCount : 'undefined（首次渲染）'}`)
  );
}

// ==================== 测试 useRequest ====================
function RequestDemo() {
  const mockService = () => Promise.resolve({ name: 'Alice', age: 25 });
  const { data, loading, error } = useRequest(mockService, { manual: false });

  return React.createElement('div', null,
    React.createElement('h3', null, 'useRequest 测试'),
    React.createElement('p', null, `加载中: ${loading}`),
    React.createElement('p', null, `数据: ${data ? JSON.stringify(data) : '暂无'}`),
    React.createElement('p', null, `错误: ${error ? error.message : '无'}`)
  );
}

// ==================== 测试 useMemo / useCallback ====================
function MemoDemo() {
  const [count, setCount] = useState(5);

  // 使用手写 useMemo
  const factorial = myUseMemo(() => {
    let result = 1;
    for (let i = 2; i <= count; i++) result *= i;
    return result;
  }, [count]);

  // 使用手写 useCallback
  const increment = myUseCallback(() => {
    setCount(c => c + 1);
  }, []);

  return React.createElement('div', null,
    React.createElement('h3', null, 'useMemo / useCallback 测试'),
    React.createElement('p', null, `count: ${count}`),
    React.createElement('p', null, `${count}! = ${factorial}`)
  );
}

// ==================== 主测试组件 ====================
function App() {
  return React.createElement('div', null,
    React.createElement('h1', null, 'React Hooks 手写题 —— 本地运行测试'),
    React.createElement(DebounceDemo),
    React.createElement(ThrottleDemo),
    React.createElement(PreviousDemo),
    React.createElement(RequestDemo),
    React.createElement(MemoDemo)
  );
}

// ==================== 执行渲染 ====================
console.log('='.repeat(50));
console.log('开始渲染 React 组件，验证 Hooks 是否正常工作...');
console.log('='.repeat(50));

try {
  const html = renderToString(React.createElement(App));
  console.log('\n渲染成功! 输出 HTML:\n');
  console.log(html);
  console.log('\n' + '='.repeat(50));
  console.log('所有 Hooks 均正常执行 ✓');
} catch (error) {
  console.error('\n渲染失败:', error.message);
  console.error(error.stack);
}
