import { RootFiber } from "../../react-fiber/types/Fiber";

export type withReactRootContainer<T> = T &
  Partial<{ _reactRootContainer: RootFiber }>;
export type Container =
  | withReactRootContainer<Document>
  | withReactRootContainer<Element>
  | withReactRootContainer<DocumentFragment>;
