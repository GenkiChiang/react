import { updateProperties } from "./ReactDomComponent";
import { Fiber } from "../react-fiber/types/Fiber";

import { UpdateQueue } from "../react-fiber/types/UpdateQueue";
import { Container } from "./types/Container";

const internalEventHandlersKey = "__reactEventHandlers$";

export const insertInContainerBefore = (
  container: Element,
  stateNode: Element,
  before: Element
) => {
  container.insertBefore(stateNode, before);
};
export const appendChildToContainer = (
  container: Element,
  stateNode: Element
) => {
  container.appendChild(stateNode);
};
export const insertBefore = (
  container: Element,
  stateNode: Element,
  before: Element
) => {
  container.insertBefore(stateNode, before);
};
export const appendChild = (container: Element, stateNode: Element) => {
  container.appendChild(stateNode);
};
const updateFiberProps = (node: Element, props: any) => {
  node[internalEventHandlersKey] = props;
};

export const commitUpdate = (
  domElement: Element,
  type: string,
  updateQueue: UpdateQueue,
  newProps: any,
  oldProps: any,
  finishedWork: Fiber
) => {
  updateFiberProps(domElement, newProps);

  updateProperties(domElement, updateQueue, type, oldProps, newProps);
};

export const commitTextUpdate = (
  textInstance: Text,
  oldText: string,
  newText: string
) => {
  textInstance.nodeValue = newText;
};

export const removeChildFromContainer = (
  container: Container, //
  stateNode: Element
) => {
  container.removeChild(stateNode);
};
export const removeChild = (domElement: Element, stateNode: Element) => {
  domElement.removeChild(stateNode);
};
