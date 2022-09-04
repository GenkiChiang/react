import { Fiber } from "../react-fiber/types/Fiber";
import { FunctionComponent } from "../react/types/Component";
import { Lanes } from "./ReactFiberLane";

let currentlyRenderingFiber = null;

export const renderWithHooks = (
  current: Fiber,
  workInProgress: Fiber,
  Component: FunctionComponent,
  props: Fiber["pendingProps"],
  context: any
) => {
  currentlyRenderingFiber = workInProgress;

  workInProgress.memorizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = Lanes.NoLanes;

  let children = Component(props, context);

  currentlyRenderingFiber = null;
  return children;
};
