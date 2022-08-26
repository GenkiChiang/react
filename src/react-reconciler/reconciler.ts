import { Fiber } from "../react-fiber/types/Fiber";
import { isArray, isObject } from "lodash/fp";
import { isTextChild } from "../react-dom/textNode";
import { createFiber, createFiberFromText } from "../react-fiber/Fiber";
import { createStateNode } from "../react-fiber/createStateNode";
import { getTag } from "../misc/getFiberWorkTagFromReactElement";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent } from "../react/types/Component";
import { ReactElement } from "../react/types/ReactElement";

export const reconcileChildrenArray = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  children: ReactElement[]
) => {
  // TODO: 处理子元素是数组的情况
  let prevFiber: Fiber;
  let nextFiber: Fiber;
  children.forEach((child, index) => {
    // if()
    nextFiber = createFiber(getTag(child), child.props);
    nextFiber.return = returnFiber;
    nextFiber.type = child.type;
    nextFiber.index = index;

    nextFiber.stateNode = createStateNode(nextFiber);
    if (nextFiber.tag === WorkTags.ClassComponent) {
      (nextFiber.stateNode as ClassComponent).componentWillMount();
    }
    if (index === 0) {
      returnFiber.child = nextFiber;
    } else {
      prevFiber.sibling = nextFiber;
    }

    // 备份
    nextFiber.alternate = nextFiber;
    prevFiber = nextFiber;
  });
};
export const reconcileSingleTextNode = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  child: string
) => {
  // TODO: 处理子元素是文本的情况
  const nextFiber = createFiberFromText(child);
  nextFiber.return = returnFiber;
  nextFiber.stateNode = createStateNode(nextFiber);

  nextFiber.alternate = nextFiber;
  returnFiber.child = nextFiber;
};
export const reconcileSingleElement = (
  returnFiber: Fiber,
  currentFirstFiber: Fiber,
  child: ReactElement
) => {
  // TODO: 处理子元素是单个对象的情况
  const nextFiber = createFiber(getTag(child), child.props);
  nextFiber.return = returnFiber;
  nextFiber.stateNode = createStateNode(nextFiber);

  if (nextFiber.tag === WorkTags.ClassComponent) {
    (nextFiber.stateNode as ClassComponent).componentWillMount();
  }
  nextFiber.alternate = nextFiber;
  returnFiber.child = nextFiber;
};

export const reconcileChild = (returnFiber: Fiber, child) => {
  if (isArray(child)) {
    reconcileChildrenArray(returnFiber, null, child);
  } else if (isTextChild(child)) {
    reconcileSingleTextNode(returnFiber, null, child);
  } else if (isObject(child)) {
    reconcileSingleElement(returnFiber, null, child as ReactElement);
  }
};
