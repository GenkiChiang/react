import { ReactElement } from "./types/ReactElement";
import { deepCompare, shallowCompare } from "./compare";
import { Fiber } from "../react-fiber/types/Fiber";
import { ClassComponent } from "./types/Component";

export abstract class ComponentLifecycle<P = any, S = any> {
  abstract readonly state: S;
  protected constructor(public readonly props: P) {}

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount(current: Fiber, instance: ClassComponent) {}

  componentWillReceiveProps(nextProps: Readonly<P>) {}
  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    return (
      !deepCompare(nextProps, this.props) || !deepCompare(nextState, this.state)
    );
  }
  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>) {}

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {}

  getSnapshotBeforeUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): any {
    // TODO:
    return;
  }
}
export abstract class Component<P = any, S = any> extends ComponentLifecycle<
  P,
  S
> {
  static defaultProps;

  state: Readonly<S>;
  displayName?: string;
  // TODO:
  // refs: { [key: string]: ReactInstance } = {};
  // _dom: Dom;

  protected constructor(public props: Readonly<P>) {
    super(props);
  }
  // public defaultProps;

  setState(partialState: Partial<S>, callback: () => any = noop): void {
    // this.state = Object.assign({}, this.state, partialState);
    // update
    // this.update();
    //
    // callback();
  }
  private update() {
    // const nextElement = this.render();
    // const oldDom = this.getDom();
    // const container = oldDom.parentNode;
    //
    // render(nextElement, container, oldDom);
  }

  // setDom(dom: Dom) {
  //     this._dom = dom;
  // }
  // getDom() {
  //     return this._dom;
  // }

  isReactComponent = true;
  abstract render(): ReactElement;
}
Component.prototype.isReactComponent = true;

export abstract class PureComponent<P = any, S = any> extends Component<P, S> {
  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    // TODO: shallow compare
    return (
      !shallowCompare(nextProps, this.props) ||
      !shallowCompare(nextState, this.state)
    );
  }
}

export const isClassComponent = (
  type: ReactElement["type"]
): type is ClassComponent => {
  if (typeof type === "string") {
    return false;
  }
  return Object.getPrototypeOf(type) === Component;
};
