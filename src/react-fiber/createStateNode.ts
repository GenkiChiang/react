import { Fiber } from "src/react-fiber/types/Fiber";
import { WorkTags } from "./ReactWorkTags";
import { ClassComponent } from "../react/types/Component";
import {
  createDomElement,
  createTextNode,
} from "../react-dom/createDomElement";

type StateNodeStrategyPattern = {
  [K in WorkTags]: (fiber: Fiber) => Fiber["stateNode"];
};
const stateNodeStrategyPattern: Partial<StateNodeStrategyPattern> = {
  [WorkTags.ClassComponent]: (fiber: Fiber) => {
    return new (fiber.type as ClassComponent)(fiber.props);
  },
  [WorkTags.FunctionComponent]: (fiber: Fiber) => null,
  [WorkTags.HostComponent]: (fiber: Fiber) => createDomElement(fiber),
  [WorkTags.HostText]: (fiber: Fiber) => createTextNode(fiber),
};

const stateNodeDispatcherCenter = (workTag: WorkTags, fiber: Fiber) =>
  stateNodeStrategyPattern[workTag](fiber);

export const createStateNode = (fiber: Fiber): Fiber["stateNode"] =>
  stateNodeDispatcherCenter(fiber.tag, fiber);
