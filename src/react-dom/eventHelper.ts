export const getEventName = (propsName: string) =>
  propsName.slice(2).toLowerCase();
export const isEventProps = (propsName: string) => propsName.startsWith("on");

export const addEvent = (propName: string, eventListener, dom: Node) => {
  const eventName = getEventName(propName);
  dom.addEventListener(eventName, eventListener as EventListener);
};
export const removeEvent = (propName, eventListener, dom: Node) => {
  const eventName = getEventName(propName);
  dom.removeEventListener(eventName, eventListener as EventListener);
};
