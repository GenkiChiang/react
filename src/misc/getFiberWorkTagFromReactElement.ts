import { WorkTags } from "../react-fiber/ReactWorkTags";
import { ReactElement } from "../react/types/ReactElement";

export const getTag = (element: ReactElement): WorkTags => {
  // console.log(element)
  const type = element.type;
  if (typeof type === "string") {
    return WorkTags.HostComponent;
  }

  return type.prototype?.isReactComponent
    ? WorkTags.ClassComponent
    : WorkTags.FunctionComponent;
};
