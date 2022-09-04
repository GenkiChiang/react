import { Container } from "../react-dom/types/Container";
import { RootTags, WorkTags } from "./ReactWorkTags";
import { Fiber, FiberRoot, RootFiber } from "./types/Fiber";
import { createRootFiberFromHost } from "./Fiber";
import { initializedUpdateQueue } from "./UpdateQueue";

export const createRootFiberFromContainer = (
  containerInfo: Container,
  tag: RootTags
): FiberRoot => ({
  tag: tag,
  containerInfo: containerInfo,
  pendingChildren: null,
  current: null,
  finishedWork: null,
  context: null,
  pendingContext: null,
});

export const createFiberRoot = (containerInfo: Container, tag: RootTags) => {
  const root = createRootFiberFromContainer(containerInfo, tag);
  const uninitializedFiber = createRootFiberFromHost(null) as RootFiber;

  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  initializedUpdateQueue(uninitializedFiber);
  return root;
};

export const getFiberRoot = (fiber: Fiber) => {
  if (fiber === null) return null;

  let currentFiber = fiber;
  let returnFiber = fiber.return;
  while (returnFiber !== null) {
    currentFiber = returnFiber;
    returnFiber = returnFiber.return;
  }
  if (currentFiber.tag === WorkTags.HostRoot) {
    return (currentFiber as RootFiber).stateNode;
  }
  return null;
};
