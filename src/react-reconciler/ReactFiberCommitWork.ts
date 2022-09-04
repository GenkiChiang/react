import { Fiber, FiberRoot, RootFiber } from "src/react-fiber/types/Fiber";
import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ClassComponent } from "../react/types/Component";
import { FiberFlags } from "../react-fiber/ReactFiberFlags";
import {
  appendChild,
  appendChildToContainer,
  commitTextUpdate,
  commitUpdate,
  insertBefore,
  insertInContainerBefore,
  removeChild,
  removeChildFromContainer,
} from "../react-dom/HostConfig";
import { Container } from "../react-dom/types/Container";

export const commitDetachRef = (current: Fiber) => {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === "function") {
      ref(null);
    } else {
      ref.current = null;
    }
  }
};

export const commitBeforeMutationLifeCycles = (
  current: Fiber,
  finishedWork: Fiber
) => {
  switch (finishedWork.tag) {
    case WorkTags.FunctionComponent:
    case WorkTags.ClassComponent: {
      // TODO:
      // if (finishedWork.flags & FiberFlags.Snapshot) {
      if (finishedWork.flags) {
        // 暂时写个假的判断条件
        if (current! == null) {
          const prevState = current.memorizedState;
          const prevProps = current.memorizedProps;
          const instance = current.stateNode as ClassComponent;
          const snapshot = instance.getSnapshotBeforeUpdate(
            prevProps,
            prevState
          );
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }
      }
      return;
    }
    case WorkTags.IndeterminateComponent:
    case WorkTags.HostRoot:
    case WorkTags.HostPortal:
    case WorkTags.HostComponent:
    case WorkTags.HostText:
    case WorkTags.Fragment:
      return;
  }
};

const isHostFiber = (fiber: Fiber) =>
  fiber.tag === WorkTags.HostComponent || fiber.tag === WorkTags.HostRoot;

const getHostReturnFiber = (fiber: Fiber): Fiber => {
  let returnFiber = fiber.return;
  while (returnFiber !== null) {
    if (isHostFiber(returnFiber)) {
      return returnFiber;
    }

    returnFiber = returnFiber.return;
  }
  // TODO: 报错，不应该走到这里来
  // error
};

function resetTextContent(parent: WindowProxy) {}

const getHostSibling = (fiber: Fiber): Element => {
  let node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostFiber(node.return)) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
    while (
      node.tag !== WorkTags.HostComponent &&
      node.tag !== WorkTags.HostText
    ) {
      // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.
      if (node.flags & FiberFlags.Placement) {
        continue siblings;
      }

      if (node.child === null) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }

    if (!(node.flags & FiberFlags.Placement)) {
      return node.stateNode as Element;
    }
  }
};

const insertOrAppendPlacementNodeIntoContainer = (
  finishedWork: Fiber,
  before: Element,
  parentNode: Element
) => {
  const isHost = isHostFiber(finishedWork);
  if (isHost) {
    const stateNode = finishedWork.stateNode;
    if (before) {
      insertInContainerBefore(parentNode, stateNode as Element, before);
    } else {
      appendChildToContainer(parentNode, stateNode as Element);
    }
  } else {
    // 如果是组件，找第一个子节点进行操作
    const child = finishedWork.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parentNode);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parentNode);
        sibling = sibling.sibling;
      }
    }
  }
};

const insertOrAppendPlacementNode = (
  finishedWork: Fiber,
  before: Element,
  parentNode: Element
) => {
  const isHost = isHostFiber(finishedWork);
  if (isHost) {
    const stateNode = finishedWork.stateNode;
    if (before) {
      insertBefore(parentNode, stateNode as Element, before);
    } else {
      appendChild(parentNode, stateNode as Element);
    }
  } else {
    // 如果是组件，找第一个子节点进行操作
    const child = finishedWork.child;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parentNode);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parentNode);
        sibling = sibling.sibling;
      }
    }
  }
};

export const commitPlacement = (finishedWork: Fiber) => {
  const returnFiber = getHostReturnFiber(finishedWork);
  let parentNode;
  let isContainer: boolean;
  const returnFiberStateNode = returnFiber.stateNode;

  switch (returnFiber.tag) {
    case WorkTags.HostComponent: {
      parentNode = returnFiberStateNode;
      isContainer = false;
      break;
    }
    case WorkTags.HostRoot: {
      parentNode = (returnFiberStateNode as RootFiber["stateNode"])
        .containerInfo;
      isContainer = true;
      break;
    }
  }

  // 如果父节点是文本节点的话
  if (returnFiber.flags & FiberFlags.ContentReset) {
    // 在进行任何插入操作前, 需要先将 value 置为 ''
    resetTextContent(parentNode);
    // 清除 ContentReset 这个 effectTag
    returnFiber.flags &= ~FiberFlags.ContentReset;
  }

  const before = getHostSibling(finishedWork);

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parentNode);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parentNode);
  }
};

export const commitWork = (current: Fiber, finishedWork: Fiber) => {
  // TODO:
  switch (finishedWork.tag) {
    case WorkTags.FunctionComponent:
    case WorkTags.ClassComponent: {
      return;
    }
    case WorkTags.HostRoot:
    case WorkTags.HostComponent: {
      const stateNode = finishedWork.stateNode;
      if (stateNode !== null) {
        const newProps = finishedWork.memorizedProps;
        const oldProps = current === null ? newProps : current.memorizedProps;
        const type = finishedWork.type;
        const updateQueue = finishedWork.updateQueue;
        finishedWork.updateQueue = null;
        if (updateQueue !== null) {
          commitUpdate(
            stateNode as Element,
            type as string,
            updateQueue,
            newProps,
            oldProps,
            finishedWork
          );
        }
      }
      return;
    }
    case WorkTags.HostText: {
      const textInstance: Text = finishedWork.stateNode as Text;
      const newText: string = finishedWork.memorizedProps;
      // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.
      const oldText: string =
        current !== null ? current.memorizedState : newText;
      commitTextUpdate(textInstance, oldText, newText);
      return;
    }
  }
};

const commitUnmount = (fiberRoot: FiberRoot, current: Fiber) => {
  switch (current.tag) {
    case WorkTags.FunctionComponent:
    case WorkTags.ClassComponent: {
      commitDetachRef(current);
      const instance = current.stateNode as ClassComponent;
      if (typeof instance.componentWillUnmount === "function") {
        instance.componentWillUnmount(current, instance);
      }
      return;
    }
    case WorkTags.HostComponent: {
      commitDetachRef(current);
      return;
    }
    case WorkTags.HostText:
    case WorkTags.HostRoot:
  }
};

const commitNestedUnmounts = (fiberRoot: FiberRoot, current: Fiber) => {
  let node = current;
  while (true) {
    commitUnmount(fiberRoot, node);
    if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === current) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return;
      }
      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
};

const detachFiber = (current: Fiber) => {
  const alternate = current.alternate;

  current.return = null;
  current.child = null;
  current.memorizedState = null;
  current.updateQueue = null;
  current.alternate = null;
  current.firstEffect = null;
  current.lastEffect = null;
  current.pendingProps = null;
  current.memorizedProps = null;
  current.stateNode = null;
  if (alternate !== null) {
    detachFiber(alternate);
  }
};

const unmountHostComponents = (fiberRoot: FiberRoot, current: Fiber) => {
  // We only have the top Fiber that was deleted but we need to recurse down its
  // children to find all the terminal nodes.
  let node: Fiber = current;

  // Each iteration, currentParent is populated with node's host parent if not
  // currentParentIsValid.
  let currentParentIsValid = false;

  // Note: these two variables *must* always be updated together.
  let currentParent;
  let currentParentIsContainer;

  while (true) {
    if (!currentParentIsValid) {
      let parent = node.return;
      findParent: while (true) {
        const parentStateNode = parent.stateNode;
        switch (parent.tag) {
          case WorkTags.HostComponent:
            currentParent = parentStateNode;
            currentParentIsContainer = false;
            break findParent;
          case WorkTags.HostRoot:
            currentParent = (parentStateNode as FiberRoot).containerInfo;
            currentParentIsContainer = true;
            break findParent;
        }
        parent = parent.return;
      }
      currentParentIsValid = true;
    }

    if (node.tag === WorkTags.HostComponent || node.tag === WorkTags.HostText) {
      commitNestedUnmounts(fiberRoot, node);
      // After all the children have unmounted, it is now safe to remove the
      // node from the tree.
      if (currentParentIsContainer) {
        removeChildFromContainer(
          currentParent as Container,
          node.stateNode as Element
        );
      } else {
        removeChild(currentParent, node.stateNode as Element);
      }
      // Don't visit children because we already visited them.
    } else {
      commitUnmount(fiberRoot, node);
      // Visit children because we may find more host components below.
      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }
    if (node === current) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
};

export const commitDeletion = (fiberRoot: FiberRoot, current: Fiber) => {
  unmountHostComponents(fiberRoot, current);

  detachFiber(current);
};
