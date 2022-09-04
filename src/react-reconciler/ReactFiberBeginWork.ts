import { Fiber } from "src/react-fiber/types/Fiber";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent, FunctionComponent } from "../react/types/Component";
import { renderWithHooks } from "./ReactFiberHooks";
import { ReactElement } from "../react/types/ReactElement";
import { Component, isClassComponent } from "../react";
import { initializedUpdateQueue } from "../react-fiber/UpdateQueue";
import { initial } from "lodash";
import { Lane } from "./ReactFiberLane";

function processUpdateQueue(
  workInProgress: Fiber,
  props: Component["props"],
  instance: Component
) {
  // 对于class和HostRoot，总是不为null
  const updateQueue = workInProgress.updateQueue;

  const firstBaseUpdate = updateQueue.firstBaseUpdate;
  const lastBaseUpdate = updateQueue.lastBaseUpdate;
  const pendingQueue = updateQueue.shared.pending;
  if (pendingQueue !== null) {
    updateQueue.shared.pending = null;
    // WIP
  }
}

function mountClassInstance(
  workInProgress: Fiber,
  Component: ClassComponent,
  newProps: ClassComponent["props"]
) {
  const instance = workInProgress.stateNode as Component;
  instance.props = newProps;
  instance.state = workInProgress.memorizedState;
  // instance.refs = emptyRefs()
  initializedUpdateQueue(workInProgress);

  processUpdateQueue(workInProgress, newProps, instance);
  instance.state = workInProgress.memorizedState;
}

const mountIndeterminateComponent = (
  current: Fiber,
  workInProgress: Fiber,
  Component: FunctionComponent
) => {
  if (current !== null) {
    current.alternate = null;
    workInProgress.alternate = null;
    workInProgress.flags = FiberFlags.Placement;
  }

  const props = workInProgress.pendingProps;
  let context;
  // 函数组件被调用后的返回值
  let value: ReactElement;

  context = {}; // TODO: set context

  value = renderWithHooks(null, workInProgress, Component, props, context);

  workInProgress.flags = FiberFlags.PerformedWork;

  if (isClassComponent(workInProgress.type)) {
    // 假设是ClassComponent
    workInProgress.tag = WorkTags.ClassComponent;

    workInProgress.memorizedState = null;
    workInProgress.updateQueue = null;

    // @ts-ignore
    workInProgress.memorizedState = value.state || null;
    initializedUpdateQueue(workInProgress);

    // adoptClassInstance(workInProgress,value)
    // @ts-ignore
    mountClassInstance(workInProgress, Component, props);
  } else {
    // 假设是FunctionComponent
    workInProgress.tag = WorkTags.ClassComponent;
  }
  return undefined;
};

function updateFunctionComponent(
  Component: FunctionComponent,
  workInProgress,
  type,
  resolvedProps: any
) {
  // TODO:
  return undefined;
}

function updateClassComponent(
  Component: ClassComponent<any, any>,
  workInProgress,
  type,
  resolvedProps: any
) {
  return undefined;
}

function updateHostRoot(current: Fiber, workInProgress) {
  return undefined;
}

function updateHostComponent(current: Fiber, workInProgress) {
  return undefined;
}

function updateHostText(current: Fiber, workInProgress) {
  return undefined;
}

function updateFragment(current: Fiber, workInProgress) {
  return undefined;
}

export const beginWork = (current: Fiber, workInProgress): Fiber => {
  if (current !== null) {
    const oldProps = workInProgress.memorizedProps;
    const newProps = current.pendingProps;

    workInProgress.lane = Lane.NoLane;

    switch (workInProgress.tag) {
      // 函数组件第一次被渲染时使用
      case WorkTags.IndeterminateComponent: {
        return mountIndeterminateComponent(
          current,
          workInProgress,
          workInProgress.type
        );
      }
      case WorkTags.FunctionComponent: {
        const Component = workInProgress.type as FunctionComponent;
        const unresolvedProps = workInProgress.pendingProps;
        // TODO:
        const resolvedProps = unresolvedProps;
        return updateFunctionComponent(
          Component,
          workInProgress,
          workInProgress.type,
          resolvedProps
        );
      }
      case WorkTags.ClassComponent: {
        const Component = workInProgress.type as ClassComponent;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = unresolvedProps;
        return updateClassComponent(
          Component,
          workInProgress,
          workInProgress.type,
          resolvedProps
        );
      }
      case WorkTags.HostRoot: {
        return updateHostRoot(current, workInProgress);
      }
      case WorkTags.HostComponent: {
        return updateHostComponent(current, workInProgress);
      }
      case WorkTags.HostText: {
        return updateHostText(current, workInProgress);
      }
      case WorkTags.Fragment: {
        return updateFragment(current, workInProgress);
      }
    }

    // TODO:
    console.error("报错：组件类型未知");

    // first render
  }
};
