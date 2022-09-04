import { ClassComponent } from "../react/types/Component";
import { ReactElement } from "../react/types/ReactElement";
import { Container } from "./types/Container";
import { FiberRoot } from "../react-fiber/types/Fiber";
import { RootTags } from "../react-fiber/ReactWorkTags";
import { markContainerAsRoot } from "./markContainerAsRoot";
import {
  createContainer,
  flushSync,
  updateContainer,
} from "../react-reconciler/ReactFiberReconciler";
import { NoopFunction } from "src/misc/types/misc";

const clearContainer = (container: Container) => {
  let rootSibling: ChildNode;

  while ((rootSibling = container.lastChild)) {
    container.removeChild(rootSibling);
  }
};

const getPublicInstance = (fiberRoot: FiberRoot) => {
  // TODO:
};

const createRootFromDomContainer = (
  container: Container
  // children: ReactElement,
  // parentComponent: ClassComponent
): FiberRoot => {
  clearContainer(container);

  const root: FiberRoot = createContainer(container, RootTags.legacy);
  container._reactRootContainer = root;
  markContainerAsRoot(root, container);

  return root;
};

export const renderSubtreeInfoContainer = (
  parentComponent: ClassComponent,
  children: ReactElement,
  container: Container,
  callback: NoopFunction
) => {
  let maybeFiberRoot = container._reactRootContainer;
  let fiberRoot: FiberRoot;

  if (!maybeFiberRoot) {
    // TODO: 初始渲染
    // TODO:
    container._reactRootContainer = createRootFromDomContainer(
      container
      // children,
      // parentComponent
      // callback,
    );
    fiberRoot = container._reactRootContainer;
    // TODO: process callback fn

    // initial mount shouldn't be batched
    flushSync(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // TODO: 更新渲染
  }

  return getPublicInstance(fiberRoot);
};
