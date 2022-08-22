import { ClassComponent, FC } from "./Component";

export type ReactNode =
  | string
  | number
  | boolean
  | null
  | ReactElement
  | Iterable<ReactNode>;

export type ReactEmpty = boolean | void | undefined | null;

export type ComponentType<P = any> = ClassComponent<P> | FC<P>;
export type ReactElementType<P = any> = string | ComponentType<P>;
export type ReactKey = null | string;
export type RefObject<T = any> = {
  current: T;
};
export type ReactRef = null | RefObject | ((handle: any) => void);
export type PropsWithChildren<P = any> = P & { children: ReactElement[] };
export interface ReactElement<P = {}, T = ReactElementType<P>> {
  $$typeof: symbol;
  type: T;
  key: ReactKey;
  ref: ReactRef;
  props: PropsWithChildren<P>;
}
