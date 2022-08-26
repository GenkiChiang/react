import { ReactElement } from "src/react/types/ReactElement";
import { WorkTags } from "../react-fiber/ReactWorkTags";

export const getTag = (element: ReactElement): WorkTags => {
  const type = element.type;
  if (typeof type === "string") {
    return WorkTags.HostComponent;
  }

  return type.prototype.isReactComponent
    ? WorkTags.ClassComponent
    : WorkTags.FunctionComponent;
};
