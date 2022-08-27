import * as React from "../src";
import { Component } from "../src";

const root = document.getElementById("app");

const virtualDom = (
  <div className="container">
    <p>hello React</p>
  </div>
);
class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>我是ClassComponent的标题</h1>
        <p>我是ClassComponent的内容 </p>
      </div>
    );
  }
}

//
// setTimeout(() => {
//   React.render(virtualDom, root as Container);
// }, 2000);

// React.render(<MyComponent />, root);

const FnComponent = (props) => {
  return (
    <div>
      <h1>我是FnComponent的标题</h1>
      <h1>{props.title}</h1>
      <p>我是FnComponent的内容 </p>
      {/*{[<div>123</div>]}*/}
    </div>
  );
};
React.render(<FnComponent title={"我是FnComponent的props.title"} />, root);

setTimeout(() => {
  React.render(
    <FnComponent title={"我是FnComponent改变后的props.title"} />,
    root
  );
}, 2000);
