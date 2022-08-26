import { Fiber } from "../react-fiber/types/Fiber";
import { updateNodeProperties } from "./updateNodeProperties";
import { WorkTags } from "../react-fiber/ReactWorkTags";

export const createTextNode = (fiber: Fiber) => {
  if (fiber.tag !== WorkTags.HostText) {
    throw new Error("fiber.tag is not HostText");
  }
  return document.createTextNode(fiber.props);
};

export const createDomElement = (fiber: Fiber) => {
  if (fiber.tag !== WorkTags.HostComponent) {
    throw new Error("fiber.tag is not HostComponent");
  }
  const { type } = fiber as Fiber<any, string>;

  // 文本节点
  let newDom;

  // 元素节点
  newDom = document.createElement(type);
  updateNodeProperties(newDom, fiber);

  return newDom;
};
