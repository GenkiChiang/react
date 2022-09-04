import {
  isArray,
  isBoolean,
  isNull,
  isObject,
  isPlainObject,
  isUndefined,
} from "lodash/fp";
import { ReactElement } from "./types/ReactElement";
import { Component } from "./Component";
import {Fiber} from "../react-fiber/types/Fiber";

export const hasValidKey = (props) => props.key !== undefined;
export const hasValidRef = (props) => props.ref !== undefined;

const isFalsyObject = (value) => {
  if (!isObject(value)) return false;
  if (!isPlainObject(value)) return false;
  return Object.keys(value).length === 0;
};
export const isFalsy = (value: any) => {
  if (isArray(value) && value.length === 0) {
    return true;
  } else if (isFalsyObject(value)) {
    return true;
  } else if (isNull(value)) {
    return true;
  } else if (isUndefined(value)) {
    return true;
  } else if (isBoolean(value)) {
    return true;
  }
  return false;
};

export const shouldConstruct = (type: ReactElement["type"]) => {
  if (!type) return false;
  if (typeof type === "string") return false;
  return Object.getPrototypeOf(type) === Component;
};
