import { FiberRoot } from "src/react-fiber/types/Fiber";

const internalContainerInstanceKey = "__reactContainer";

export const markContainerAsRoot = (hosRoot: FiberRoot, node: Node) => {
  node[internalContainerInstanceKey] = hosRoot;
};
export function unmarkContainerAsRoot(node: Node) {
  node[internalContainerInstanceKey] = null;
}
