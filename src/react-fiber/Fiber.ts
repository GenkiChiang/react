import { WorkTags } from "./ReactWorkTags";
import { PropsWithChildren } from "../react/types/ReactElement";
import { Fiber, RootFiber } from "./types/Fiber";

export const createFiber = (
  tag: Fiber["tag"],
  props: Fiber["props"]
): Fiber => {
  return {
    type: null, // 节点类型 (元素, 文本, 组件)(具体的类型)
    props: props, // 节点属性
    stateNode: null, // 节点 DOM 对象 | 组件实例对象
    tag: tag, // 节点标记 (对具体类型的分类 hostRoot || hostComponent || classComponent || functionComponent)

    ref: null,

    return: null, // 当前 Fiber 的父级 Fiber
    // Singly Linked List Tree Structure.
    child: null, // 当前 Fiber 的子级 Fiber
    sibling: null, // 当前 Fiber 的下一个兄弟 Fiber
    index: 0,

    // Effect
    effects: [], // 数组, 存储需要更改的 fiber 对象
    flags: null, // 当前 Fiber 要被执行的操作 (新增, 删除, 修改)

    alternate: null, // Fiber 备份, fiber 比对时使用
  };
};
export const createHostRootFiber = (props: PropsWithChildren): RootFiber =>
  <RootFiber>createFiber(WorkTags.HostRoot, props);

export const createFiberFromText = (textContent: string): Fiber<string> => {
  return createFiber(WorkTags.HostText, textContent);
};
