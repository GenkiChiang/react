import { Fiber } from "../react-fiber/types/Fiber";

export class TaskQueue {
  taskQueue: Partial<Fiber>[] = [];

  push(task: Partial<Fiber>) {
    this.taskQueue.push(task);
  }
  pop() {
    return this.taskQueue.shift();
  }
  isEmpty() {
    return this.taskQueue.length === 0;
  }
}
