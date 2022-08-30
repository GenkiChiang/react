import { ReactInstance } from "../../react/types/Component";
import {
  PropsWithChildren,
  ReactElementType,
  ReactKey,
  ReactRef,
} from "../../react/types/ReactElement";
import { FiberFlags } from "../ReactFiberFlags";
import { WorkTags } from "../ReactWorkTags";
import { Container } from "../../react-dom/types/Container";

export interface Fiber<P = any, T = ReactElementType> {
  type: T; // 节点类型 (元素, 文本, 组件)(具体的类型)

  props: PropsWithChildren<P>; // 节点属性
  stateNode: ReactInstance | null; // 节点 DOM 对象 | 组件实例对象
  tag: WorkTags; // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)

  ref: ReactRef;
  key: ReactKey;

  return: Fiber | null; // 当前 Fiber 的父级 Fiber
  // Singly Linked List Tree Structure.
  child: Fiber | null; // 当前 Fiber 的子级 Fiber
  sibling: Fiber | null; // 当前 Fiber 的下一个兄弟 Fiber
  index: number;

  // Effect
  effects: Fiber[]; // 数组, 存储需要更改的 fiber 对象
  flags: FiberFlags; // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)
  deletions: Fiber[];

  alternate: Fiber | null; // Fiber 备份, fiber 比对时使用

  // TODO:
  // pendingProps;
  // memorizedProps;
  // memorizedState;
}

export interface RootFiber extends Fiber {
  tag: WorkTags.HostRoot;
  stateNode: Container | null;
}
