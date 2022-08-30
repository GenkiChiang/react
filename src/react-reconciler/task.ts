import { TaskQueue } from "../misc/TaskQueue";
import { Fiber, RootFiber } from "../react-fiber/types/Fiber";
import { createFiberFromHostRoot } from "../react-fiber/Fiber";
import { Container } from "src/react-dom/types/Container";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { reconcileChildDispatcher } from "./reconciler";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";
import { updateNodeProperties } from "../react-dom/updateNodeProperties";
import { findDomFiber } from "../react-dom/findDomNode";
import { unmountNode } from "../react-dom/unmountNode";

export const taskQueue = new TaskQueue();
let subTask = null;
let pendingCommit: Fiber;

const getFirstTask = (): RootFiber => {
  const task = taskQueue.pop();

  // console.log(task)
  const hostRootFiber = createFiberFromHostRoot(task) as RootFiber;
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
  console.log(fiber.effects)

  fiber.effects.forEach((fiberEffect) => {
    let returnFiber = fiberEffect.return;

    if (fiberEffect.flags === FiberFlags.Update) {
      // 节点类型相同，执行更新updateNodeProperty
      // 节点类型不同，执行替换操作

      if (fiberEffect.type === fiberEffect.alternate.type) {
        updateNodeProperties(
          findDomFiber(fiberEffect).stateNode as HTMLElement,
          fiberEffect
        );
      } else {

        (<Container>returnFiber.stateNode).replaceChild(
          fiberEffect.stateNode as Node,
          fiberEffect.alternate.stateNode as Node
        );
      }
    } else if (fiber.flags === FiberFlags.Placement) {
      if (
        fiberEffect.tag === WorkTags.ClassComponent ||
        fiberEffect.tag === WorkTags.FunctionComponent
      ) {
        return;
      }

      returnFiber = findDomFiber(returnFiber);
      // {
      //   console.log("Placement")
      //   // console.log(returnFiber)
      //   console.log(fiberEffect)
      //
      // }
      {
        (returnFiber.stateNode as Container).appendChild(
          fiberEffect.stateNode as Node
        );
      }
    } else if (fiberEffect.flags === FiberFlags.ChildDeletion) {
      // TODO:
      unmountNode(fiber, fiberEffect);
    }

    // }

    // if (fiberEffect.tag === WorkTags.ClassComponent) {
    //   (fiberEffect.stateNode as ClassComponent).componentDidMount();
    // }
  });

  // 备份rootFiber
  fiber.alternate = fiber;
  (<Container>fiber.stateNode)._reactRootContainer = fiber;
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
