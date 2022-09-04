import { Container } from "src/react-dom/types/Container";
import { Component } from "../Component";
import { ReactElement } from "./ReactElement";
import { FiberRoot } from "../../react-fiber/types/Fiber";
export interface ClassComponent<P = any, S = any> extends Component<P, S> {
  new (props: Readonly<P>): ClassComponent<P, S>;
  defaultProps: P;

  isReactComponent: boolean;
  __reactInternalSnapshotBeforeUpdate: any;
}
export interface PureComponent extends ClassComponent {}
export interface FunctionComponent<P = any, S = any> {
  (props: Readonly<P>, context?: any): ReactElement<P, S>;
  defaultProps: P;
}
export type FC<P = any, S = any> = FunctionComponent<P, S>;

export type ReactInstance =
  | ClassComponent
  | Element
  | Document
  | DocumentFragment
  | Text
  | Container
  | FiberRoot;

