import { TaskQueue } from "../misc/TaskQueue";
import { Fiber } from "../react-fiber/types/Fiber";
import {
  createFiber,
  createFiberFromText,
  createHostRootFiber,
} from "../react-fiber/Fiber";
import { Container } from "src/react-dom/types/Container";
import { getTag } from "../misc/getFiberWorkTagFromReactElement";
import { createStateNode } from "../react-fiber/createStateNode";
import { isTextChild } from "../react-dom/textNode";
import { isArray } from "lodash/fp";

export const taskQueue = new TaskQueue();
let subTask = null;
let pendingCommit: Fiber;
const getFirstTask = (): Fiber => {
  const task = taskQueue.pop();

  // console.log(task)
  const hostRootFiber = createHostRootFiber(task.props);
  hostRootFiber.stateNode = task.stateNode;
  return hostRootFiber;
};

const reconcileChildren = (subTask: Fiber, children) => {
  let currentFiber = subTask;
  // let nextFiber = null;
  let index = 0;
  let lastIndex;
  let prevFiber: Fiber;
  const length = children.length;
  if (!isArray(children)) {
    if (isTextChild(children)) {
      const nextFiber = createFiberFromText(children);
      nextFiber.return = currentFiber;
      nextFiber.stateNode = createStateNode(nextFiber);

      currentFiber.child = nextFiber;
    } else {
      // single object child
      const nextFiber = createFiber(getTag(children), children.props);
      nextFiber.return = currentFiber;
      nextFiber.stateNode = createStateNode(nextFiber);

      currentFiber.child = nextFiber;
    }
  } else {
    children.forEach((child, index) => {
      // if()
      const nextFiber: Fiber = createFiber(getTag(child), child.props);
      nextFiber.return = currentFiber;
      nextFiber.type = child.type;
      nextFiber.index = index;

      nextFiber.stateNode = createStateNode(nextFiber);
      if (index === 0) {
        currentFiber.child = nextFiber;
      } else {
        prevFiber.sibling = nextFiber;
      }
      prevFiber = nextFiber;
    });
  }
};

const executeTask = (subTask: Fiber): Fiber | null => {
  /**
   * 构建子级fiber对象
   */
  // console.log(subTask);
  // if (subTask.tag === WorkTags.HostRoot) {
  // console.log(subTask.props?.children);
  if (subTask.props?.children) {
    reconcileChildren(subTask, subTask.props.children);
  }
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
  // console.log(currentExecuteFiber)
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
  // console.log(currentExecuteFiber)
  pendingCommit = currentExecuteFiber;
};
export const commitAllWork = (fiber: Fiber) => {
  /**
   * 遍历子节点，构建dom树
   */
  // console.log("commitAllWork");
  // console.log(fiber);
  fiber.effects.forEach((effectFiberEffect) => {
    // if(fiber.flags===FiberFlags.Placement){
    // }
    const parentFiber = effectFiberEffect.return;
    (parentFiber.stateNode as Container).appendChild(
      effectFiberEffect.stateNode as Node
    );
  });
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
    commitAllWork(pendingCommit);
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
