import { Fiber } from "../react-fiber/types/Fiber";
import { isArray, isObject } from "lodash/fp";
import { isTextChild } from "../react-dom/textNode";
import {
  createFiberFromElement,
  createFiberFromText,
} from "../react-fiber/Fiber";
import { createStateNode } from "../react-fiber/createStateNode";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent, FunctionComponent } from "../react/types/Component";
import { ReactElement, ReactNode } from "../react/types/ReactElement";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";

export const deleteChild = (returnFiber: Fiber, child: Fiber) => {
  const deletions = returnFiber.deletions;
  child.flags = FiberFlags.ChildDeletion;
  if (!deletions) {
    returnFiber.deletions = [child];
  } else {
    deletions.push(child);
  }
};
export const deleteRemainingChildren = (returnFiber: Fiber, fiber: Fiber) => {
  if (!fiber) {
    return;
  }
  while (fiber) {
    deleteChild(returnFiber, fiber);
    fiber = fiber.sibling;
  }
  // TODO:
};
export const reconcileChildrenArray = (
  returnFiber: Fiber,
  currentFirstChild: Fiber,
  children: ReactElement[]
) => {
  // TODO: 处理子元素是数组的情况
  let oldFiber = returnFiber.alternate?.child;

  let prevFiber: Fiber;
  let nextFiber: Fiber;
  children.forEach((childElement, index) => {
    // reconcileChild(returnFiber,childElement)
    if (typeof childElement === "string") {
      nextFiber = reconcileSingleTextNode(
        returnFiber,
        null,
        childElement as string
      );

      // TODO: 这里有问题，不该再设置一次flags。   reconciler需要重构一下逻辑！
      nextFiber.flags = FiberFlags.Placement;
      // nextFiber.sibling
    } else {
      nextFiber = createFiberFromElement(childElement);
    }
    nextFiber.return = returnFiber;
    nextFiber.index = index;

    if (oldFiber) {
      // 更新操作
      nextFiber.alternate = oldFiber;
      nextFiber.flags = FiberFlags.Update;
      if (oldFiber.type === nextFiber.type) {
        nextFiber.stateNode = oldFiber.stateNode;
      } else {
        nextFiber.stateNode = createStateNode(nextFiber);
      }
    } else {
      // 创建操作
      // nextFiber.flags = FiberFlags.Placement;
      // 备份
      nextFiber.alternate = nextFiber;
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

    if (oldFiber?.sibling) {
      oldFiber = oldFiber.sibling;
      if (index === children.length) {
        // TODO: delete oldFiber
        deleteRemainingChildren(returnFiber, oldFiber);
      }
    }

    prevFiber = nextFiber;
  });
  // deleteOldFiber(oldAlternate)
};

export const reconcileSingleTextNode = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  childElement: string
) => {
  // TODO: 处理子元素是文本的情况
  const oldFiber = returnFiber.alternate?.child;

  const nextFiber = createFiberFromText(childElement);
  nextFiber.return = returnFiber;

  if (oldFiber) {
    if (oldFiber?.sibling) {
      // TODO: should delete oldFiber?
      deleteRemainingChildren(returnFiber, oldFiber.sibling);
    }
    // 更新操作
    nextFiber.flags = FiberFlags.Update;
    nextFiber.alternate = oldFiber;

    if (oldFiber.type === nextFiber.type) {
      nextFiber.stateNode = oldFiber.stateNode;
    } else {
      nextFiber.stateNode = createStateNode(nextFiber);
    }
  } else {
    // 创建操作
    // nextFiber.flags = FiberFlags.Placement;
    nextFiber.alternate = nextFiber;
    nextFiber.stateNode = createStateNode(nextFiber);
  }

  // nextFiber.alternate = nextFiber;
  // if(currentFirstFiber)
  console.log("returnFiber.child");
  console.log(returnFiber);
  if (!returnFiber.child) {
    returnFiber.child = nextFiber;
  }

  return nextFiber;
};

export const reconcileSingleElement = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  childElement: ReactElement
) => {
  // TODO: 处理子元素是单个对象的情况
  const oldFiber = returnFiber.alternate?.child;

  // console.log(childElement)
  const nextFiber = createFiberFromElement(childElement);
  nextFiber.return = returnFiber;

  /**
   * 执行diff
   */
  if (oldFiber) {
    if (oldFiber?.sibling) {
      // TODO: should delete oldFiber?
      deleteRemainingChildren(returnFiber, oldFiber.sibling);
    }
    // 更新操作
    nextFiber.flags = FiberFlags.Update;
    nextFiber.alternate = oldFiber;

    if (oldFiber.type === nextFiber.type) {
      nextFiber.stateNode = oldFiber.stateNode;
    } else {
      nextFiber.stateNode = createStateNode(nextFiber);
    }
  } else {
    // 初始渲染
    // nextFiber.flags = FiberFlags.Placement;
    nextFiber.alternate = nextFiber;

    nextFiber.stateNode = createStateNode(nextFiber);
  }

  if (nextFiber.tag === WorkTags.ClassComponent) {
    (nextFiber.stateNode as ClassComponent).componentWillMount();
  }
  returnFiber.child = nextFiber;

  return nextFiber;
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
    return reconcileChildrenArray(returnFiber, null, child);
  } else if (isTextChild(child)) {
    return reconcileSingleTextNode(returnFiber, null, child);
  } else if (isObject(child)) {
    return reconcileSingleElement(returnFiber, null, child as ReactElement);
  }
};

export const scheduleUpdate = () => {
  // TODO:
};

export const mountReconcileChild = () => {
  // TODO:
};
export const updateReconcileChild = () => {
  // TODO:
};

export const insertChild = () => {
  // TODO:
};
