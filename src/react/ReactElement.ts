import { isObject } from "lodash/fp";
import {
  PropsWithChildren,
  ReactElement,
  ReactElementType,
  ReactKey,
  ReactRef,
} from "./types/ReactElement";
import { hasValidKey, hasValidRef, isFalsy } from "./utils";
import { REACT_ELEMENT_TYPE } from "../misc/ReactSymbol";

const RESERVED_PROPS = {
  key: true,
  ref: true,
};
export const createElement = (type, config, ...children): ReactElement => {
  const props: PropsWithChildren = {};
  let key: ReactKey = null;
  let ref: ReactRef = null;

  if (config !== null) {
    if (hasValidKey(config)) {
      key = config.key;
    }
    if (hasValidRef(config)) {
      ref = config.ref;
    }

    Object.entries(config).forEach(([propName, propValue]) => {
      // console.log(propName)
      if (!RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = propValue;
      }
    });
  }

  // resolve virtual dom's children
  const childrenElement: ReactElement[] = [...children].reduce(
    (previousValue, child) => {
      // 忽略 undefined null NAN boolean [] {}
      if (isFalsy(child)) {
        return previousValue;
      }
      // array or object
      if (isObject(child)) {
        previousValue.push(child);
      } else {
        previousValue.push(createElement("text", null, child));
      }

      return previousValue;
    },
    []
  );
  Object.freeze(childrenElement);
  props.children = childrenElement;

  // resolve default props
  if (typeof type === "function" && type.defaultProps) {
    const defaultProps = type.defaultProps;
    Object.entries(defaultProps).forEach(
      ([defaultPropName, defaultPropValue]) => {
        if (props[defaultPropName] === undefined) {
          props[defaultPropName] = defaultPropValue;
        }
      }
    );
  }

  return ReactElementFactory(type, key, ref, props);
};

export const ReactElementFactory = (
  type: ReactElementType,
  key: ReactKey,
  ref: ReactRef,
  props: PropsWithChildren
): ReactElement => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };
  // set children cant enumerable
  Object.defineProperty(element.props, "children", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: props.children,
  });
  Object.freeze(element.props);

  return element;
};
