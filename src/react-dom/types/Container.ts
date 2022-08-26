import { FiberRoot } from "../../react-fiber/types/Fiber";

export type withReactRootContainer<T> = T &
  Partial<{ _reactRootContainer: FiberRoot }>;
export type Container =
  | withReactRootContainer<Document>
  | withReactRootContainer<Element>
  | withReactRootContainer<DocumentFragment>;
