import { voidFunction } from "../misc/voidFunction";

export abstract class ComponentLifecycle<P = any, S = any> {
  abstract readonly state: S;
  protected constructor(public readonly props: P) {}

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}

  componentWillReceiveProps(nextProps: Readonly<P>){}
  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    // TODO: deep compare
    return nextProps !== this.props || nextState !== this.state;
  }
  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>) {}

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {}
}
export abstract class Component<P = any, S = any> extends ComponentLifecycle<
  P,
  S
> {
  static defaultProps;

  readonly state: S;
  displayName?: string;
  // TODO:
  // refs: { [key: string]: ReactInstance } = {};
  // _dom: Dom;

  protected constructor(public readonly props: P) {
    super(props);
  }
  // public defaultProps;

  setState(partialState: Partial<S>, callback: () => any = voidFunction): void {
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
  // abstract render(): ReactElement;
}
export abstract class PureComponent<P = any, S = any> extends Component<P, S> {
  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    // TODO: shallow compare
    return nextProps !== this.props || nextState !== this.state;
  }
}
