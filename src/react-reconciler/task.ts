import { TaskQueue } from "../misc/TaskQueue";
import { Fiber, RootFiber } from "../react-fiber/types/Fiber";
import { createHostRootFiber } from "../react-fiber/Fiber";
import { Container } from "src/react-dom/types/Container";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent } from "src/react/types/Component";
import { reconcileChildDispatcher } from "./reconciler";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";

export const taskQueue = new TaskQueue();
let subTask = null;
let pendingCommit: Fiber;
const getFirstTask = (): RootFiber => {
  const task = taskQueue.pop();

  // console.log(task)
  const hostRootFiber = createHostRootFiber(task.props);
  hostRootFiber.stateNode = task.stateNode as Container;
  hostRootFiber.alternate = hostRootFiber.stateNode._reactRootContainer;
  hostRootFiber.flags = hostRootFiber.stateNode._reactRootContainer
    ? FiberFlags.Update
    : FiberFlags.Placement;

  return hostRootFiber;
};

const executeTask = (subTask: Fiber): Fiber | null => {
  /**
   * 构建子级fiber对象
   */
  // console.log(subTask);
  // if (subTask.tag === WorkTags.HostRoot) {
  // console.log(subTask.props?.children);
  // if (subTask.props?.children) {
  //   reconcileChild(subTask, subTask.props.children);
  // }

  reconcileChildDispatcher(subTask.tag, subTask);
  // }

  /**
   * 如果子fiber存在，把子fiber当做父级，构建这个父级下的子级。
   */
  if (subTask.child) {
    return subTask.child;
  }

  /**
   * 如果同级存在，返回同级当做父级，构建这个父级下的子级。
   * 如果不存在同级，寻找父级fiber，看是否有同级
   */
  let currentExecuteFiber: Fiber = subTask;
  while (currentExecuteFiber.return) {
    // 收集effects
    currentExecuteFiber.return.effects =
      currentExecuteFiber.return.effects.concat(
        currentExecuteFiber.effects.concat(currentExecuteFiber)
      );
    // console.log(currentExecuteFiber)

    if (currentExecuteFiber.sibling) {
      return currentExecuteFiber.sibling;
    }
    currentExecuteFiber = currentExecuteFiber.return;
  }

  pendingCommit = currentExecuteFiber;
};
export const commitAllWork = (fiber: RootFiber) => {
  /**
   * 遍历子节点，构建dom树
   */
  fiber.effects.forEach((fiberEffect) => {
    // if(fiber.flags===FiberFlags.Placement){
    // }
    if (
      fiberEffect.tag === WorkTags.ClassComponent ||
      fiberEffect.tag === WorkTags.FunctionComponent
    ) {
      return;
    }
    let returnFiber = fiberEffect.return;

    while (
      returnFiber.tag === WorkTags.ClassComponent ||
      returnFiber.tag === WorkTags.FunctionComponent
    ) {
      returnFiber = returnFiber.return;
    }

    // if (returnFiber.tag === WorkTags.HostComponent) {
    (<Container>returnFiber.stateNode).appendChild(
      fiberEffect.stateNode as Node
    );
    // }

    // if (fiberEffect.tag === WorkTags.ClassComponent) {
    //   (fiberEffect.stateNode as ClassComponent).componentDidMount();
    // }
  });

  (<Container>fiber.stateNode)._reactRootContainer = <RootFiber>fiber;
};
export const workLoop = (idleDeadline: IdleDeadline) => {
  if (!subTask) {
    subTask = getFirstTask();
  }

  // console.log(idleDeadline.timeRemaining())
  while (subTask && idleDeadline.timeRemaining() > 0) {
    // flush task
    subTask = executeTask(subTask);
  }

  if (pendingCommit) {
    // TODO: flush all commit
    commitAllWork(pendingCommit as RootFiber);
  }
};

export const performTask = (idleDeadline: IdleDeadline) => {
  /**
   * 1. 执行任务
   * 2. 判断是否还有任务，如果有任务在浏览器空闲时继续执行任务
   */

  workLoop(idleDeadline);

  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask);
  }
};
