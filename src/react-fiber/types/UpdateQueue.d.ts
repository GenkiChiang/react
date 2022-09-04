import { Lane, Lanes } from "src/react-reconciler/ReactFiberLane";
import { NoopFunction } from "../../misc/types/misc";

export type Update<State = any> = {
  tag: 0 | 1 | 2 | 3;
  payload: any;
  callback: NoopFunction;

  lane: Lane;
  next: Update<State> | null;
};

export type SharedQueue<State = any> = {
  pending: Update<State> | null;
  hiddenCallbacks: Array<() => any> | null;
  lanes: Lanes;
};

export type UpdateQueue<State = any> = {
  baseState: State;
  firstBaseUpdate: Update<State>;
  lastBaseUpdate: Update<State>;
  shared: SharedQueue<State>;
  callbacks: NoopFunction[];
};
