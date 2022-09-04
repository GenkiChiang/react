import { ReactElement } from "src/react/types/ReactElement";
import { Container } from "./types/Container";
import { noop } from "lodash";
import { renderSubtreeInfoContainer } from "./ReactDom";

export const render = (
  element: ReactElement,
  container: Container,
  callback = noop // TODO: process callback
) => {
  // TODO: valid container

  return renderSubtreeInfoContainer(null, element, container, callback);
};
