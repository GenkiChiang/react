export enum FiberFlags {
  NoFlags,
  PerformedWork,

  Placement,
  Update,
  ChildDeletion,
  ContentReset,
  Callback,
  DidCapture,
  ForceClientRender,
  Ref,
  Snapshot,
  Passive,
  Hydrating,
  Visibility,
  StoreConsistency,
}
