import { ReactElement } from "../react/types/ReactElement";
import { Fiber, FiberRoot } from "../react-fiber/types/Fiber";
import { ClassComponent } from "../react/types/Component";
import { NoopFunction } from "src/misc/types/misc";
import { createUpdate } from "../react-fiber/UpdateQueue";
import { Update } from "../react-fiber/types/UpdateQueue";
import { Container } from "../react-dom/types/Container";
import { RootTags } from "../react-fiber/ReactWorkTags";
import { createFiberRoot, getFiberRoot } from "../react-fiber/FiberRoot";
import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";
import {Lane, Lanes} from "./ReactFiberLane";

function getContext(parentComponent: ClassComponent) {
  return {};
}

function requestLane() {
  // TODO:
  return Lane.SyncLane;
}

function enqueueUpdate(fiber: Fiber, update: Update): FiberRoot {
  const updateQueue = fiber.updateQueue;
  if (update === null) {
    return null;
  }
  const sharedQueue = updateQueue.shared;
  const pending = updateQueue.shared.pending;
  // 如果没有待执行的任务
  if (pending === null) {
    // 第一次更新，创建循环列表
    update.next = update;
  } else {
    // TODO: ???
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update;

  return getFiberRoot(fiber);
}
export const createContainer = (
  containerInfo: Container,
  tag: RootTags
): FiberRoot => createFiberRoot(containerInfo, tag);

export const updateContainer = (
  element: ReactElement,
  fiberRoot: FiberRoot,
  parentComponent: ClassComponent,
  callback: NoopFunction
) => {
  // TODO:
  const current = fiberRoot.current;
  const context = getContext(parentComponent);
  const lane = requestLane(); // TODO:

  // set context
  if (fiberRoot.context === null) {
    fiberRoot.context = context;
  } else {
    fiberRoot.pendingContext = context;
  }

  const update = createUpdate();
  update.payload = { element };
  update.callback = callback;

  // 将update存储到Fiber更新队列中(updateQueue)
  // 待执行的任务都会被存储在 fiber.updateQueue.shared.pending 中
  const _fiberRoot = enqueueUpdate(current, update);

  if (_fiberRoot !== null) {
    // TODO: schedule work
    scheduleUpdateOnFiber(_fiberRoot, current, lane);
  }

  return lane;
};

export const flushSync = (param: () => void) => {};
