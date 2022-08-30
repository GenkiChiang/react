import { addEvent, isEventProps, removeEvent } from "./eventHelper";
import { Fiber } from "src/react-fiber/types/Fiber";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { Container } from "./types/Container";
import { createTextNode } from "./createDomElement";

export const updateTextNode = (fiber: Fiber) => {
  const oldProps = fiber.alternate?.props;
  // TODO:
  if (fiber.props !== oldProps) {
    if (fiber.return.type !== fiber.alternate.return.type) {
      (fiber.return.stateNode as Container).appendChild(
        (fiber.stateNode = createTextNode(fiber))
      );
    } else {
      (fiber.return.stateNode as Container).replaceChild(
        createTextNode(fiber),
        fiber.stateNode as Node
      );
    }
  }
};
export const updateNodeProperties = (oldDom: HTMLElement, fiber: Fiber) => {
  const { props } = fiber;
  const oldProps = fiber.alternate?.props;

  if (fiber.tag === WorkTags.HostText) {
    // TODO:
    updateTextNode(fiber);
    return;
  }

  Object.entries(props).forEach(([propName, propValue]) => {
    const oldPropValue = oldProps?.[propName];
    if (oldPropValue !== propValue) {
      if (isEventProps(propName)) {
        if (oldPropValue) {
          // 单独处理bind()函数返回的新函数不相等情况
          removeEvent(propName, oldPropValue, oldDom);
        }
        addEvent(propName, propValue, oldDom);
      } else if (propName === "value" || propName === "checked") {
        oldDom[propName] = propValue;
      } else if (propName === "className") {
        oldDom.setAttribute("class", propValue as string);
      } else {
        oldDom.setAttribute(propName, propValue as string);
      }
    }
  });

  // 处理props被删除的情况
  if (!oldProps) return;
  Object.entries(oldProps).forEach(([oldPropsName, oldPropsValue]) => {
    const propValue = props[oldPropsName];
    if (propValue === undefined) {
      if (isEventProps(oldPropsName)) {
        removeEvent(oldPropsName, propValue, oldDom);
      } else if (oldPropsName === "value" || oldPropsName === "checked") {
        oldDom[oldPropsName] = "";
      } else {
        oldDom.removeAttribute(oldPropsName);
      }
    }
  });
};
