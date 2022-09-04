import { WorkTags } from "./ReactWorkTags";
import { ReactElement } from "../react/types/ReactElement";
import { Fiber } from "./types/Fiber";
import { FiberFlags } from "./ReactFiberFlags";
import { curryRight } from "lodash";
import { getTag } from "../misc/getFiberWorkTagFromReactElement";
import { Lanes } from "../react-reconciler/ReactFiberLane";

export const createFiberFactory = (
  tag: Fiber["tag"],
  pendingProps: Fiber["pendingProps"]
  // TODO: key
): Fiber => {
  return {
    tag: tag, // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)
    type: null, // 节点类型 (元素, 文本, 组件)(具体的类型)
    // props: props, // 节点属性
    stateNode: null, // 节点 DOM 对象 | 组件实例对象

    ref: null,
    key: null,

    return: null, // 当前 Fiber 的父级 Fiber
    // Singly Linked List Tree Structure.
    child: null, // 当前 Fiber 的子级 Fiber
    sibling: null, // 当前 Fiber 的下一个兄弟 Fiber
    index: 0,

    // Effect
    // effects: [], // 数组, 存储需要更改的 fiber 对象
    flags: FiberFlags.NoFlags, // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)
    deletions: null,

    nextEffect: null,
    firstEffect: null,
    lastEffect: null,

    lanes: Lanes.NoLane,
    alternate: null, // Fiber 备份, fiber 比对时使用

    pendingProps: pendingProps,
    memorizedProps: null,
    memorizedState: null,
    updateQueue: null,
  };
};

export const createFiber = curryRight<Fiber["pendingProps"], WorkTags, Fiber>(
  (
    pendingProps,
    // key: ReactKey,
    tag
  ): Fiber => {
    const createdFiber = createFiberFactory(tag, pendingProps);
    createdFiber.flags = FiberFlags.Placement;
    // if (element.type) createdFiber.type = element.type;
    // if (element.ref) createdFiber.ref = element.ref;
    // if (element.key) createdFiber.key = element.key;

    return createdFiber;
  }
);

export const createRootFiberFromHost = createFiber(WorkTags.HostRoot);
// export const createFiberFromFunctionComponent = curryRight(createFiber)(
//   WorkTags.FunctionComponent
// );
// export const createFiberFromClassComponent = curryRight(createFiber)(
//   WorkTags.ClassComponent
// );
// export const createFiberFromElement = curryRight(createFiber)(
//   WorkTags.HostComponent
// );
export const createFiberFromElement = (element: ReactElement) => {
  const tag = getTag(element);
  return createFiber(element.props, tag);
};
export const createFiberFromText = (props: string): Fiber<string> => {
  const createdFiber = createFiber(props, WorkTags.HostText);
  createdFiber.flags = FiberFlags.Placement;

  return createdFiber;
};

export const createWorkInProgress = (
  current: Fiber,
  pendingProps: Fiber["pendingProps"]
) => {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(pendingProps, current.tag);

    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    // current <==alternate==> workInProgress
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  }

  workInProgress.child = current.child;
  workInProgress.memorizedProps = current.memorizedProps;
  workInProgress.memorizedState = current.memorizedState;
  workInProgress.updateQueue = current.updateQueue;
  // TODO: clone deps object

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
};
