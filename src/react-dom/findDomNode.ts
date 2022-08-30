import { Fiber } from "src/react-fiber/types/Fiber";
import { WorkTags } from "../react-fiber/ReactWorkTags";

const HostTags = [WorkTags.HostRoot, WorkTags.HostComponent, WorkTags.HostText];
export const findDomFiber = (fiber: Fiber) => {
  if (!fiber) return null;
  while (!HostTags.includes(fiber.tag)) {
    fiber = fiber.return;
  }
  return fiber;
};
