import { ReactNode } from "../react/types/ReactElement";

export const textNode = (node: Node) => {
  return node.nodeType === 3;
};

export const isTextChild = (child: ReactNode) =>
  typeof child === "string" || typeof child === "number";
