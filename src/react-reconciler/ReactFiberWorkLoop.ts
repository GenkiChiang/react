import { Lane } from "./ReactFiberLane";
import { createWorkInProgress } from "../react-fiber/Fiber";
import { Fiber, FiberRoot } from "../react-fiber/types/Fiber";
import { beginWork } from "./ReactFiberBeginWork";
import { RootFiberExitStatus } from "./RootFiberExitStatus";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";
import { unwindWork } from "./ReactFiberUnwindWork";
import {
  commitBeforeMutationLifeCycles, commitDeletion, commitDetachRef,
  commitPlacement, commitWork,
} from "./ReactFiberCommitWork";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import {commitTextUpdate, commitUpdate} from "../react-dom/HostConfig";

export let workInProgressRoot: FiberRoot = null;
export let workInProgress: Fiber = null;
export let workInProgressRootFiberExitStatus: RootFiberExitStatus =
  RootFiberExitStatus.RootIncomplete;
export let rootWithPendingPassiveEffects;

let nextEffect: Fiber;
let rootDoesHavePassiveEffects: boolean;

const flushPassiveEffects = () => {
  // TODO:
};

const prepareFreshStack = (fiberRoot: FiberRoot) => {
  fiberRoot.finishedWork = null;
  // TODO: 初始化lane
  // 构建 workInProgress Fiber 树的 fiberRoot 对象
  workInProgressRoot = fiberRoot;
  // 构建 workInProgress Fiber 树中的 rootFiber
  workInProgress = createWorkInProgress(fiberRoot.current, null);
};

// 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
const completeWork = (current: Fiber, workInProgress: Fiber): Fiber => {
  // TODO:
  return;
};

/**
 * 从下至上移动到该节点的 兄弟节点，如果往上未找到兄弟节点则返回父节点，最终会达到rootFiber
 * @param unitOfWork
 */
export const completeUnitOfWork = (unitOfWork: Fiber): Fiber => {
  workInProgress = unitOfWork;
  do {
    const current = workInProgress.alternate;
    const returnFiber = workInProgress.return;

    let nextFiber: Fiber;
    nextFiber = completeWork(current, workInProgress);

    if (nextFiber !== null) {
      // 返回子级 一直返回到 workLoopSync
      // 再重新执行 performUnitOfWork 构建子级 Fiber 节点对象
      return nextFiber;
    }

    // 构建effect链表
    if (returnFiber !== null) {
      // !rootFiber
      if (returnFiber.firstEffect === null) {
        returnFiber.firstEffect = workInProgress.firstEffect;
      }
      if (workInProgress.lastEffect !== null) {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
        }
        returnFiber.lastEffect = workInProgress.lastEffect;
      }

      // 获取副作用标记
      // 初始渲染时除[根组件]以外的 Fiber, flags 值都为 0, 即不需要执行任何真实DOM操作
      // 根组件的 flags 值为 3, 即需要将此节点对应的真实DOM对象添加到页面中
      const flags = workInProgress.flags;
      if (flags > FiberFlags.PerformedWork) {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = workInProgress;
        } else {
          // 为 fiberRoot 添加 firstEffect ??  // TODO: 这里为什么是fiberRoot呢
          returnFiber.firstEffect = workInProgress;
        }
        returnFiber.lastEffect = workInProgress;
      }
    } else {
      // rootFiber
      const next = unwindWork(workInProgress);
    }

    const sibling = workInProgress.sibling;
    if (sibling !== null) {
      return sibling;
    }
    // 退回到父级
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // 走到这里说明遍历到了 root 节点, 已完成遍历
  if (
    workInProgressRootFiberExitStatus === RootFiberExitStatus.RootIncomplete
  ) {
    workInProgressRootFiberExitStatus = RootFiberExitStatus.RootCompleted;
  }
  return null;
};

//     }
const performUnitOfWork = (workInProgress: Fiber) => {
  const current = workInProgress.alternate;

  // 下一个要构建的子级Fiber
  let nextFiber: Fiber;

  // 初始渲染
  // 从父到子，构建fiber节点
  nextFiber = beginWork(current, workInProgress);

  workInProgress.memorizedProps = workInProgress.pendingProps;
  if (nextFiber === null) {
    // 从子到父，构建其余fiber节点
    nextFiber = completeUnitOfWork(workInProgress);
  }

  return nextFiber;
};

// }
const workLoopSync = () => {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
};

function commitBeforeMutationEffectOnFiber(current: Fiber, nextEffect: Fiber) {}

function scheduleCallback(DefaultLane: Lane, callback: () => void) {
  // TODO:
}

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const flags = nextEffect.flags;
    // TODO: Snapshot?
    // if ((effectTag & Snapshot) !== NoEffect) {
    if (flags !== FiberFlags.NoFlags) {
      const current = nextEffect.alternate;
      // 当 nextEffect 上有 Snapshot 这个 effectTag 时
      // 执行以下方法, 主要是类组件调用 getSnapshotBeforeUpdate 生命周期函数
      commitBeforeMutationLifeCycles(current, nextEffect);
    }

    // 调度 useEffect
    // 初始化渲染 目前没有 不执行
    // false
    if ((flags & FiberFlags.Passive) !== FiberFlags.NoFlags) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(Lane.DefaultLane, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}



const commitMutationEffects = (fiberRoot: FiberRoot, lane: Lane) => {
  while (nextEffect !== null) {
    const flags = nextEffect.flags;
    // 如果有文本节点, 将 value 置为''
    // if (flags &FiberFlags. ContentReset) {
    //   commitResetTextContent(nextEffect);
    // }

    // 处理ref
    if (flags & FiberFlags.Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
    // TODO:     // 根据 effectTag 分别处理  // let primaryEffectTag =effectTag & (Placement | Update | Deletion | Hydrating);
    switch (flags) {
      case FiberFlags.Placement: {
        commitPlacement(nextEffect);
        nextEffect.flags &= ~FiberFlags.Placement;
        break;
      }
      case FiberFlags.Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      case FiberFlags.ChildDeletion: {
        commitDeletion(fiberRoot, nextEffect);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
};

const commitLayoutEffects = (fiberRoot: FiberRoot) => {};

const flushSyncCallbackQueue = () => {
  // TODO:
};

const commitRootFiberImpl = (fiberRoot: FiberRoot, lane: Lane) => {
  // 处理useEffect回调与其他同步任务
  // 由于这些任务可能触发新的渲染
  // 所以这里要一直遍历执行直到没有任务
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
  const finishedWork = fiberRoot.finishedWork;

  if (finishedWork === null) {
    return;
  }
  // reset
  fiberRoot.finishedWork = null;

  // 这表明我们处理的最后一个根与我们现在提交的根不同
  if (fiberRoot === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
  } else {
    // 最常见的情况是在挂起的根超时时发生
  }

  let firstEffect: Fiber;
  if (finishedWork.flags > FiberFlags.PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有 effectTag
    // 获取要执行 DOM 操作的副作用列表
    firstEffect = finishedWork.firstEffect;
  }

  if (firstEffect !== null) {
    // commit 第1个子阶段
    nextEffect = firstEffect;
    do {
      // 处理类组件的 getSnapShotBeforeUpdate 生命周期函数
      commitBeforeMutationEffects();
    } while (nextEffect !== null);

    // commit 第2个子阶段
    nextEffect = firstEffect;
    do {
      commitMutationEffects(fiberRoot, lane);
    } while (nextEffect !== null);

    fiberRoot.current = finishedWork;
    // commit 第3个子阶段
    nextEffect = firstEffect;
    do {
      commitLayoutEffects(fiberRoot);
    } while (nextEffect !== null);

    // reset
    nextEffect = null;
  } else {
    // no effects
    fiberRoot.current = finishedWork;
  }

  flushSyncCallbackQueue();
  return null;
};

const commitFiberRoot = (fiberRoot: FiberRoot) => {
  commitRootFiberImpl(fiberRoot, Lane.SyncLane);
};

const finishSyncRender = (fiberRoot: FiberRoot) => {
  workInProgress = null;
  commitFiberRoot(fiberRoot);
};

// 进入render阶段，构建workInProgress Fiber树
const performSyncWorkOnRoot = (fiberRoot: FiberRoot) => {
  // TODO: 处理useEffect
  flushPassiveEffects();

  if (fiberRoot !== workInProgressRoot) {
    prepareFreshStack(fiberRoot);
  }

  if (workInProgress !== null) {
    do {
      try {
        workLoopSync();
        break;
      } catch (error) {
        // TODO: handleError
        console.error(error);
      }
    } while (true);

    if (workInProgress !== null) {
      console.error("这是一个同步渲染，应当完成整棵树");
    } else {
      fiberRoot.finishedWork = fiberRoot.current.alternate;

      // 进入commit阶段
      finishSyncRender(fiberRoot);
    }
  }

  return null;
};

export const scheduleUpdateOnFiber = (
  fiberRoot: FiberRoot,
  fiber: Fiber,
  lane: Lane
) => {
  // TODO: 遍历子节点的 lane

  if (lane === Lane.SyncLane) {
    // TODO: 检查是否处于非批量更新
    // TODO: 检查是否没有正在进行渲染的任务
    performSyncWorkOnRoot(fiberRoot);
  }
};



