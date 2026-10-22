/**
 * TypeScript 手写 —— 泛型约束 / 条件类型 / infer 关键字
 *
 * 高频考点：泛型高级用法，大厂面试常考
 * 注意：本文件为 .ts 格式，需在 TypeScript 环境中运行
 */

// ==================== 泛型约束 ====================
/**
 * 泛型约束：使用 extends 关键字限制泛型参数必须满足特定条件
 * 实际场景：当函数内部需要访问泛型参数的特定属性或方法时，必须对其进行约束
 */

// 约束 T 必须包含 length 属性
interface HasLength {
  length: number;
}

/**
 * 获取传入值的长度
 * 通过 extends HasLength 约束，确保 T 一定有 length 属性，避免运行时错误
 */
function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

// 使用示例
console.log(getLength('hello'));      // 字符串有 length 属性
console.log(getLength([1, 2, 3]));    // 数组有 length 属性
// console.log(getLength(123));       // 编译错误：number 类型不满足 HasLength 约束

/**
 * 更复杂的约束场景：约束键的类型
 * K 必须是 T 的键之一
 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 25 };
getProperty(user, 'name');  // 返回 string
// getProperty(user, 'gender'); // 编译错误：'gender' 不在 user 的键中

// ==================== 条件类型 ====================
/**
 * 条件类型：使用 T extends U ? X : Y 语法，根据类型关系动态推断类型
 * infer 关键字：用于在条件类型中提取（推断）某个部分的类型
 */

// 示例1：基础条件类型 - 判断是否为字符串
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// 示例2：使用 infer 提取函数返回值类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchData() {
  return { id: 1, name: 'test' };
}
type FetchResult = MyReturnType<typeof fetchData>;
// 等价于：{ id: number; name: string; }

// 示例3：实现 Exclude 工具类型
// 从 T 中排除可以赋值给 U 的类型
type MyExclude<T, U> = T extends U ? never : T;

type Union = 'a' | 'b' | 'c';
type Filtered = MyExclude<Union, 'b'>; // 'a' | 'c'

// 示例4：实现 Extract 工具类型
// 从 T 中提取可以赋值给 U 的类型
type MyExtract<T, U> = T extends U ? T : never;

type Extracted = MyExtract<Union, 'a' | 'b'>; // 'a' | 'b'

// 示例5：使用 infer 提取函数参数类型
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, age: number): void {
  console.log(`Hello ${name}, age ${age}`);
}
type GreetParams = MyParameters<typeof greet>;
// 等价于：[string, number]

// 示例6：使用 infer 提取 Promise 内部类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type P1 = UnwrapPromise<Promise<string>>; // string
type P2 = UnwrapPromise<number>;          // number

// 示例7：深层 Readonly（递归条件类型）
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
  };
  api: {
    key: string;
  };
}

const deepConfig: DeepReadonly<Config> = {
  database: { host: 'localhost', port: 3306 },
  api: { key: 'secret' },
};
// deepConfig.database.host = 'other'; // 编译错误
// deepConfig.database.port = 5432;    // 编译错误

export {
  getLength,
  getProperty,
  MyExclude,
  MyExtract,
  MyReturnType,
  MyParameters,
  UnwrapPromise,
  DeepReadonly,
};
