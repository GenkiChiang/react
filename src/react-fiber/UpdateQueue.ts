import { Fiber } from "./types/Fiber";
import { Update, UpdateQueue } from "./types/UpdateQueue";
import { Lane, Lanes } from "../react-reconciler/ReactFiberLane";

export enum UpdateTags {
  UpdateState,
  ReplaceState,
  ForceUpdate,
  CaptureUpdate,
}

export const createUpdate = <State>(): Update<State> => ({
  tag: UpdateTags.UpdateState,
  payload: null,
  callback: null,
  next: null,
  lane: Lane.NoLane,
});

export const createUpdateQueue = <State = any>(): UpdateQueue<State> => {
  const firstBaseUpdate = createUpdate<State>();
  const lastBaseUpdate = createUpdate<State>();

  return {
    baseState: null,
    firstBaseUpdate: firstBaseUpdate,
    lastBaseUpdate: lastBaseUpdate,
    shared: {
      pending: null,
      hiddenCallbacks: [],
      lanes: Lanes.NoLanes,
    },
    callbacks: [],
  };
};

export const initializedUpdateQueue = (fiber: Fiber) => {
  fiber.updateQueue = createUpdateQueue();
};
