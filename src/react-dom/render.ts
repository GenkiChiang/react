import { ReactElement } from "src/react/types/ReactElement";
import { performTask, taskQueue } from "../react-reconciler/task";
import { Container } from "./types/Container";

export const render = (element: ReactElement, container: Container) => {
  /**
   * 1. 向任务队列添加任务
   * 2. 指定浏览器空闲时执行任务
   */
  taskQueue.push({
    stateNode: container,
    props: {
      children: [element],
    },
  });

  requestIdleCallback(performTask);
};
