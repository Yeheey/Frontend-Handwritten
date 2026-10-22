# 前端手写代码高频题

> 整理自前端面试高频手写题，涵盖 JS 基础、Promise、设计模式、React Hooks、前端工程、算法、TypeScript 七大分类。

## 环境准备

```bash
npm install
```

## 运行方式

### 运行 JS 文件

```bash
node 01-JS基础/01-call-apply-bind.js
node 06-算法/02-排序算法.js
```

### 运行 TS 文件

```bash
npx tsx 07-TypeScript/01-工具类型.ts
```

### 运行 React Hooks 测试

```bash
node 04-React-Hooks/demo.js
```

> `demo.js` 使用 `react-dom/server` 的 `renderToString` 在 Node.js 中渲染组件，验证所有自定义 Hooks 是否正常执行。

> **注意**：`04-React-Hooks/` 下的 01、02 文件不能直接运行（它们是 Hook 定义，需要被组件调用），请通过 `demo.js` 统一验证。03 为概念演示，可直接运行。
>
> `05-前端工程/` 中涉及 DOM API（拖拽、懒加载、Hash 路由）的文件需在浏览器环境运行。

## 目录结构

### 01-JS 基础
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-call-apply-bind.js` | 手写 call / apply / bind | Yes |
| `02-new-instanceof-inherit.js` | 手写 new / instanceof / 原型继承 | Yes |
| `03-深浅拷贝.js` | 浅拷贝 / 深拷贝（含 WeakMap 满分版） | Yes |
| `04-数组方法手写.js` | 手写 map / filter / reduce / some / every | Yes |
| `05-数组工具函数.js` | 数组去重 / 扁平化 / 分块 / 交集 / 差集 | Yes |
| `06-对象工具-防抖节流.js` | isEqual / debounce / throttle | Yes |

### 02-Promise
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-promise-all-race.js` | Promise.all / race / allSettled / any | Yes |
| `02-promise-串行-调度器-重试.js` | Promise 串行 / 并发调度器 / 重试函数 | Yes |
| `03-手写Promise.js` | 符合 A+ 规范的 Promise 实现 | Yes |

### 03-设计模式
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-EventEmitter.js` | 发布订阅模式（EventBus） | Yes |
| `02-函数柯里化.js` | 固定参数柯里化 / 无限参数柯里化 | Yes |
| `03-懒加载与单例.js` | 图片懒加载 / 单例模式 | 部分（懒加载需浏览器） |

### 04-React Hooks
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-useDebounce-useThrottle.js` | useDebounce / useThrottle / useLocalStorage / usePrevious | 通过 demo.js |
| `02-useRequest-memo.js` | useRequest / memo / useMemo / useCallback | 通过 demo.js |
| `03-useState-useEffect.js` | 简易 useState / useEffect（概念演示） | Yes |
| `demo.js` | 统一测试入口，验证所有 Hooks | Yes |

### 05-前端工程
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-axios拦截器-localStorage.js` | 简易 axios 拦截器 / localStorage 增强封装 | 部分（localStorage 需浏览器） |
| `02-拖拽元素-懒加载.js` | 拖拽元素 / 图片懒加载 | 需浏览器 |
| `03-Hash路由.js` | 简易 Hash 路由实现 | 需浏览器 |
| `04-格式化函数.js` | 时间格式化 / 千分位 / 金额格式化 | Yes |

### 06-算法
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-字符串处理.js` | 驼峰互转 / 回文判断 | Yes |
| `02-排序算法.js` | 冒泡排序 / 快速排序 / 归并排序 | Yes |
| `03-反转链表.js` | 反转单链表（迭代 + 递归） | Yes |
| `04-二叉树遍历.js` | 前序 / 中序 / 后序遍历（递归 + 迭代） | Yes |

### 07-TypeScript
| 文件 | 题目 | 可运行 |
|------|------|--------|
| `01-工具类型.ts` | Partial / Pick / Omit / Record / Readonly | Yes（`npx tsx`） |
| `02-泛型与条件类型.ts` | 泛型约束 / 条件类型 / infer / DeepReadonly | Yes（`npx tsx`） |
