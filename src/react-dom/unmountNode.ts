import { Fiber } from "../react-fiber/types/Fiber";
import { findDomFiber } from "./findDomNode";
import { WorkTags } from "../react-fiber/ReactWorkTags";

export const unmountNode = (returnFiber: Fiber, fiber: Fiber) => {
  // TODO:
  const dom = findDomFiber(returnFiber).stateNode as Element;
  const childDom = findDomFiber(fiber).stateNode as Node;

  if (fiber.tag === WorkTags.HostText) {
    dom.removeChild(childDom);
    return;
  }
  while (fiber.child || fiber.sibling) {
    if (fiber.child) {
      unmountNode(fiber, fiber.child);
    } else {
      unmountNode(fiber, fiber.sibling);
    }
  }
  dom.removeChild(childDom);
};

//
// import { MixinChildNode } from "./types";
// import {isClassComponent, setRef} from "./utils";
// import { entries } from "lodash";
// import { isEventProps, removeEvent } from "./utils/eventHelper";
// import {findDomFiber} from "./findDomNode";
//
// export const unmountNode = (oldDom: MixinChildNode) => {
//     const oldElement = oldDom._element;
//     // 1.文本节点，直接删除
//     if (oldElement.type === "text") {
//         oldDom.remove();
//         return;
//     }
//
//     // 2.如果是class节点，调用生命周期
//     if (isClassComponent(oldElement.type)) {
//         const instance = oldElement.ReactInstance;
//         instance.componentWillUnmount();
//     }
//
//     // 3.是否有ref
//     if (oldElement.ref) {
//         setRef(oldElement.ref, null);
//         // oldElement.ref(null);
//     }
//
//     // 4.是否有注册有event,如果有remove event
//     entries(oldElement.props).forEach(([propName, propValue]) => {
//         if (isEventProps(propName)) {
//             removeEvent(propName, propValue, oldDom);
//         }
//     });
//     // 5.递归子节点，并且unmount子节点
//     while (oldDom.childNodes.length > 0) {
//         unmountNode(oldDom.childNodes[0]);
//     }
//     // 删除
//     oldDom.remove();
// };
