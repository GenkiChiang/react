import { ReactInstance } from "../../react/types/Component";
import {
  ComponentType,
  ReactElementType,
  ReactRef,
} from "../../react/types/ReactElement";
import { FiberFlags } from "../ReactFiberFlags";
import { WorkTags } from "../ReactWorkTags";

export interface Fiber<P = any, T = string | ComponentType> {
  type: ReactElementType; // 节点类型 (元素, 文本, 组件)(具体的类型)
  elementType: ReactElementType; //

  props; // 节点属性
  stateNode: ReactInstance; // 节点 DOM 对象 | 组件实例对象
  tag: WorkTags; // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)

  ref: ReactRef;

  return: Fiber | null; // 当前 Fiber 的父级 Fiber
  // Singly Linked List Tree Structure.
  child: Fiber | null; // 当前 Fiber 的子级 Fiber
  sibling: Fiber | null; // 当前 Fiber 的下一个兄弟 Fiber
  index: number;

  // Effect
  effects; // 数组, 存储需要更改的 fiber 对象
  flags: FiberFlags; // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)

  alternate: Fiber | null; // Fiber 备份, fiber 比对时使用


  // TODO:
  pendingProps;
  memorizedProps;
  memorizedState;
}