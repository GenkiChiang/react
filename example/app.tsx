import { Container } from "src/react-dom/types/Container";
import * as React from "../src";

const root = document.getElementById("app");

const virtualDom = (
  <div className="container">
    <p>hello React</p>
  </div>
);
setTimeout(() => {
  React.render(virtualDom, root as Container);
}, 2000);
