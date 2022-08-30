import {ReactNode} from "../react/types/ReactElement";

export const isTextNode = (node: Node): node is Text => {
  return node.nodeType === 3;
};

export const isTextChild = (child: ReactNode): child is string =>
  typeof child === "string" || typeof child === "number";

