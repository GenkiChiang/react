import { curryRight } from "lodash";

const validMap = new Map<any, any>();
const hasValidMap = (value) => {
  return !!validMap.get(value);
};
export const compare = (one: any, two: any, depth: number): boolean => {
  // TODO: WIP diff function、。。。
  if (one === two) return true;
  if (typeof one !== typeof two) {
    return false;
  }
  if (depth === 0) return true;
  if (typeof one !== "object" || typeof two !== "object") return false;
  let propName;

  for (propName in one) {
    let propValue = one[propName];
    let twoPropValue = two[propName];

    if (propValue === twoPropValue) {
      break;
    } else if (
      typeof propValue === "object" &&
      typeof twoPropValue === "object"
    ) {
      if (hasValidMap(propValue)) break;
      validMap.set(propValue, true);

      // 继续递归
      let result = compare(propValue, twoPropValue, depth - 1);
      if (result === false) {
        validMap.clear();
        return false;
      }
    } else {
      validMap.clear();
      return false;
    }
  }
  for (propName in two) {
    let propValue = one[propName];
    let twoPropValue = two[propName];

    if (propValue === twoPropValue) {
      break;
    } else if (
      typeof propValue === "object" &&
      typeof twoPropValue === "object"
    ) {
      if (hasValidMap(propValue)) break;
      validMap.set(propValue, true);

      // 继续递归
      let result = compare(propValue, twoPropValue, depth - 1);
      if (result === false) {
        validMap.clear();
        return false;
      }
    } else {
      validMap.clear();
      return false;
    }
  }
  validMap.clear();
  return true;
};

export const deepCompare = curryRight(compare)(-1);

export const shallowCompare = curryRight(compare)(1);
