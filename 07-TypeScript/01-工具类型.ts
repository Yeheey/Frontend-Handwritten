/**
 * TypeScript 手写 —— Partial / Pick / Omit / Record / Readonly
 *
 * 高频考点：TypeScript 工具类型的实现原理，面试中常考手写
 * 注意：本文件为 .ts 格式，需在 TypeScript 环境中运行
 */

// ==================== Partial<T> ====================
/**
 * Partial<T>：将类型 T 的所有属性变为可选
 * 核心原理：使用映射类型遍历 T 的所有键，并为每个键添加 ? 修饰符
 *
 * @example
 * interface User { name: string; age: number; email: string; }
 * type UpdateUser = MyPartial<User>;
 * // 等价于：{ name?: string; age?: number; email?: string; }
 */
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// ==================== Pick<T, K> ====================
/**
 * Pick<T, K>：从类型 T 中挑选出指定的属性 K，构建新类型
 * 核心原理：K 必须是 T 的键的子集（K extends keyof T），通过映射类型提取对应属性
 *
 * @example
 * interface Product { id: number; name: string; price: number; stock: number; }
 * type ProductBrief = MyPick<Product, 'id' | 'name'>;
 * // 等价于：{ id: number; name: string; }
 */
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// ==================== Omit<T, K> ====================
/**
 * Omit<T, K>：从类型 T 中排除指定的属性 K，构建新类型
 * 核心原理：组合使用 Exclude 和 Pick
 * 先用 Exclude 从 T 的键中剔除 K，再用 Pick 提取剩余属性
 *
 * @example
 * interface User { id: number; name: string; password: string; token: string; }
 * type SafeUser = MyOmit<User, 'password' | 'token'>;
 * // 等价于：{ id: number; name: string; }
 */
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// ==================== Record<K, T> ====================
/**
 * Record<K, T>：构建一个对象类型，键为 K，值为 T
 * 核心原理：K 必须是 string | number | symbol 的联合类型，通过映射类型生成键值对
 *
 * @example
 * type Role = 'admin' | 'editor' | 'viewer';
 * const roleLabels: MyRecord<Role, string> = {
 *   admin: '管理员',
 *   editor: '编辑者',
 *   viewer: '查看者'
 * };
 */
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

// ==================== Readonly<T> ====================
/**
 * Readonly<T>：将类型 T 的所有属性变为只读
 * 核心原理：使用映射类型遍历 T 的所有键，并为每个键添加 readonly 修饰符
 *
 * @example
 * interface Config { apiUrl: string; timeout: number; }
 * const config: MyReadonly<Config> = { apiUrl: '...', timeout: 3000 };
 * // config.apiUrl = 'new-url'; // 编译错误：无法分配到 "apiUrl" ，因为它是只读属性
 */
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// ==================== 使用示例 ====================

interface User {
  name: string;
  age: number;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// Partial 使用
const updateUser: MyPartial<User> = { name: 'Alice' }; // 合法，其他属性可选

// Pick 使用
const brief: MyPick<Product, 'id' | 'name'> = { id: 1, name: 'Laptop' };

// Omit 使用
const safeUser: MyOmit<User, 'email'> = { name: 'Bob', age: 25 };

// Record 使用
type Role = 'admin' | 'editor' | 'viewer';
const roleLabels: MyRecord<Role, string> = {
  admin: '管理员',
  editor: '编辑者',
  viewer: '查看者',
};

// Readonly 使用
const config: MyReadonly<{ apiUrl: string; timeout: number }> = {
  apiUrl: 'https://api.example.com',
  timeout: 3000,
};
// config.apiUrl = 'new-url'; // 编译错误

export { MyPartial, MyPick, MyOmit, MyRecord, MyReadonly };
