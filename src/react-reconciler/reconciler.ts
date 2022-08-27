import { Fiber } from "../react-fiber/types/Fiber";
import {any, isArray, isObject } from "lodash/fp";
import { isTextChild } from "../react-dom/textNode";
import { createFiber, createFiberFromText } from "../react-fiber/Fiber";
import { createStateNode } from "../react-fiber/createStateNode";
import { getTag } from "../misc/getFiberWorkTagFromReactElement";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent, FunctionComponent } from "../react/types/Component";
import { ReactElement, ReactNode } from "../react/types/ReactElement";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";

export const reconcileChildrenArray = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  children: ReactElement[]
) => {
  // TODO: 处理子元素是数组的情况
  let  oldAlternate = returnFiber.child.alternate;

  let prevFiber: Fiber;
  let nextFiber: Fiber;
  children.forEach((childElement, index) => {
    nextFiber = createFiber(getTag(childElement), childElement.props);
    nextFiber.type = childElement.type;
    nextFiber.return = returnFiber;
    nextFiber.index = index;

    if (oldAlternate) {
      nextFiber.flags = FiberFlags.Update;
      if (oldAlternate.type === nextFiber.type) {
        nextFiber.stateNode = oldAlternate.stateNode;
      } else {
        nextFiber.stateNode = createStateNode(nextFiber);
      }
    } else {
      nextFiber.flags = FiberFlags.Placement;
      nextFiber.stateNode = createStateNode(nextFiber);
    }
    // nextFiber.stateNode = createStateNode(nextFiber);
    // if (nextFiber.tag === WorkTags.ClassComponent) {
    //   (nextFiber.stateNode as ClassComponent).componentWillMount();
    // }
    if (index === 0) {
      returnFiber.child = nextFiber;
    } else {
      prevFiber.sibling = nextFiber;
    }

    if(oldAlternate.sibling){
      oldAlternate = oldAlternate.sibling
    }
    // 备份
    nextFiber.alternate = nextFiber;
    prevFiber = nextFiber;
  });
};

export const reconcileSingleTextNode = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  childElement: string
) => {
  // TODO: 处理子元素是文本的情况
  const oldAlternate = returnFiber.child.alternate;

  const nextFiber = createFiberFromText(childElement);
  nextFiber.return = returnFiber;

  if (oldAlternate) {
    nextFiber.flags = FiberFlags.Update;
    if (oldAlternate.type === nextFiber.type) {
      nextFiber.stateNode = oldAlternate.stateNode;
    } else {
      nextFiber.stateNode = createStateNode(nextFiber);
    }
  } else {
    nextFiber.flags = FiberFlags.Placement;

    nextFiber.stateNode = createStateNode(nextFiber);
  }

  nextFiber.alternate = nextFiber;
  returnFiber.child = nextFiber;
};

export const reconcileSingleElement = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  childElement: ReactElement
) => {
  // TODO: 处理子元素是单个对象的情况
  const oldAlternate = returnFiber.child.alternate;

  const nextFiber = createFiber(getTag(childElement), childElement.props);
  nextFiber.type = childElement.type;
  nextFiber.return = returnFiber;

  /**
   * 执行diff
   */
  if (oldAlternate) {
    nextFiber.flags = FiberFlags.Update;

    if (oldAlternate.type === nextFiber.type) {
      nextFiber.stateNode = oldAlternate.stateNode;
    } else {
      nextFiber.stateNode = createStateNode(nextFiber);
    }
  } else {
    // 初始渲染
    nextFiber.flags = FiberFlags.Placement;

    nextFiber.stateNode = createStateNode(nextFiber);
  }

  if (nextFiber.tag === WorkTags.ClassComponent) {
    (nextFiber.stateNode as ClassComponent).componentWillMount();
  }
  nextFiber.alternate = nextFiber;
  returnFiber.child = nextFiber;
};

type ReconcileChildStrategyPattern = {
  [K in WorkTags]: (returnFiber: Fiber) => void;
};
const reconcileChildStrategyPattern: Partial<ReconcileChildStrategyPattern> = {
  [WorkTags.ClassComponent]: (returnFiber: Fiber<any, ClassComponent>) => {
    reconcileChild(
      returnFiber,
      (returnFiber.stateNode as ClassComponent).render()
    );
  },
  [WorkTags.FunctionComponent]: (
    returnFiber: Fiber<any, FunctionComponent>
  ) => {
    reconcileChild(returnFiber, returnFiber.type(returnFiber.props));
  },
  [WorkTags.HostRoot]: (returnFiber: Fiber) => {
    reconcileChild(returnFiber, returnFiber.props.children);
  },
  [WorkTags.HostComponent]: (returnFiber: Fiber) => {
    reconcileChild(returnFiber, returnFiber.props.children);
  },
  [WorkTags.HostText]: (returnFiber: Fiber) => {},
};
export const reconcileChildDispatcher = (
  workTag: WorkTags,
  returnFiber: Fiber
) => {
  return reconcileChildStrategyPattern[workTag](returnFiber);
};

export const reconcileChild = (returnFiber: Fiber, child: ReactNode) => {
  if (isArray(child)) {
    reconcileChildrenArray(returnFiber, null, child);
  } else if (isTextChild(child)) {
    reconcileSingleTextNode(returnFiber, null, child);
  } else if (isObject(child)) {
    reconcileSingleElement(returnFiber, null, child as ReactElement);
  }
};

export const scheduleUpdate = () => {
  // TODO:
};
