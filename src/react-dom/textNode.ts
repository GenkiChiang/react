import { Fiber } from "src/react-fiber/types/Fiber";
import { ReactElement } from "../react/types/ReactElement";

export const textNode = (node: Node) => {
  return node.nodeType === 3;
};
export const shouldSetTextContent = (props: ReactElement["props"]) => {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
};
export const isTextChild = (child) => {
  return typeof child === "string" || typeof child === "number";
};
