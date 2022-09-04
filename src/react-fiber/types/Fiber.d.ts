import { ReactInstance } from "../../react/types/Component";
import {
  PropsWithChildren,
  ReactElement,
  ReactElementType,
  ReactKey,
  ReactRef,
} from "../../react/types/ReactElement";
import { FiberFlags } from "../ReactFiberFlags";
import { RootTags, WorkTags } from "../ReactWorkTags";
import { Container } from "../../react-dom/types/Container";
import { UpdateQueue } from "./UpdateQueue";
import { Lanes } from "../../react-reconciler/ReactFiberLane";

export interface Fiber<P = any, T = ReactElementType> {
  tag: WorkTags; // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)

  type: T; // 节点类型 (元素, 文本, 组件)(具体的类型)
  // props: PropsWithChildren<P>; // 节点属性
  stateNode: ReactInstance; // 节点 DOM 对象 | 组件实例对象

  ref: ReactRef;
  key: ReactKey;

  return: Fiber; // 当前 Fiber 的父级 Fiber
  // Singly Linked List Tree Structure.
  child: Fiber; // 当前 Fiber 的子级 Fiber
  sibling: Fiber; // 当前 Fiber 的下一个兄弟 Fiber
  index: number;

  // Effect
  // effects: Fiber[]; // 数组, 存储需要更改的 fiber 对象
  flags: FiberFlags; // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)
  deletions: Fiber[];

  nextEffect: Fiber;
  firstEffect: Fiber;
  lastEffect: Fiber;

  lanes: Lanes;
  // workInProgress
  alternate: Fiber; // Fiber 备份, fiber 比对时使用

  // TODO:
  pendingProps: PropsWithChildren<P>;
  memorizedProps: PropsWithChildren<P>;
  memorizedState: any;
  updateQueue: UpdateQueue;
}

export interface RootFiber extends Fiber {
  tag: WorkTags.HostRoot;
  stateNode: FiberRoot;
}

export interface FiberRoot {
  tag: RootTags;
  containerInfo: Container;

  // TODO:
  pendingChildren: ReactElement;
  current: Fiber;

  finishedWork: Fiber;
  context: object;
  pendingContext: object;
}
// export interface RootFiber extends Fiber {
//   tag: WorkTags.HostRoot;
//   stateNode: Container | null;
// }
