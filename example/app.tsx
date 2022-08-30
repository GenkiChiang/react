import * as React from "../src";
import { Component } from "../src";

const root = document.getElementById("app");

const virtualDom = (
  <div className="container">
    <p>hello React</p>
  </div>
);
const newVDOm = (
  <div className="container">
    <p class="updated-class">hello React更新后的</p>
  </div>
);
class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>我是ClassComponent的标题</h1>
        {this.props.text}
        <p>我是ClassComponent的内容 </p>
      </div>
    );
  }
}
// React.render(virtualDom, root);
//
// setTimeout(() => {
//   React.render(newVDOm, root);
// }, 2000);

// React.render(<MyComponent text={"my text"} />, root);
// setTimeout(() => {
//   React.render(<MyComponent text={"text changed"} />, root);
// }, 2000);


const FnComponent = (props) => {
  return (
    <div>
      <h1>我是FnComponent的标题</h1>
      <h1>{props.title}</h1>
      {props.removeChild && <span>props.removeChild </span>}{" 123"}
      <p>我是FnComponent的内容 </p>
      {/*{[<div>123</div>]}*/}
    </div>
  );
};
React.render(<FnComponent title={"我是FnComponent的props.title"} />, root);

setTimeout(() => {
  React.render(
    <FnComponent title={"我是FnComponent改变后的props.title"} removeChild />,
    root
  );
}, 2000);
