import { WorkTags } from "./ReactWorkTags";
import { PropsWithChildren, ReactElement } from "../react/types/ReactElement";
import { Fiber, RootFiber } from "./types/Fiber";
import { FiberFlags } from "./ReactFiberFlags";
import { curryRight } from "lodash";
import { getTag } from "../misc/getFiberWorkTagFromReactElement";

export const createFiberFactory = (
  tag: Fiber["tag"],
  props: Fiber["props"]
  // TODO: key
): Fiber => {
  return {
    type: null, // 节点类型 (元素, 文本, 组件)(具体的类型)
    props: props, // 节点属性
    stateNode: null, // 节点 DOM 对象 | 组件实例对象
    tag: tag, // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)

    ref: null,
    key: null,

    return: null, // 当前 Fiber 的父级 Fiber
    // Singly Linked List Tree Structure.
    child: null, // 当前 Fiber 的子级 Fiber
    sibling: null, // 当前 Fiber 的下一个兄弟 Fiber
    index: 0,

    // Effect
    effects: [], // 数组, 存储需要更改的 fiber 对象
    flags: null, // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)
    deletions: null,

    alternate: null, // Fiber 备份, fiber 比对时使用
  };
};

export const createFiber = (
  element: Partial<ReactElement>,
  tag: WorkTags
): Fiber => {
  const createdFiber = createFiberFactory(tag, element.props);
  createdFiber.flags = FiberFlags.Placement;
  if (element.type) createdFiber.type = element.type;
  if (element.ref) createdFiber.ref = element.ref;
  if (element.key) createdFiber.key = element.key;

  return createdFiber;
};

export const createFiberFromHostRoot = curryRight(createFiber)(
  WorkTags.HostRoot
);
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
  return createFiber(element, tag);
};
export const createFiberFromText = (props: string): Fiber<string> => {
  const createdFiber = createFiberFactory(WorkTags.HostText, props);
  createdFiber.flags = FiberFlags.Placement;
  return createdFiber;
};
