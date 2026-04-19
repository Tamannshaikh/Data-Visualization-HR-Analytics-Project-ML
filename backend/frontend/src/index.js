import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

window.onerror = function (message, source, lineno, colno, error) {
  rootElement.innerHTML += `<div style="background:red;color:white;padding:20px;z-index:9999;position:fixed;top:0;left:0;">Error: ${message}</br>${error?.stack}</div>`;
};

try {
  root.render(<App />);
} catch (error) {
  rootElement.innerHTML = `<div style="background:red;color:white;padding:20px;z-index:9999;position:fixed;top:0;left:0;">Error: ${error.message}</br>${error.stack}</div>`;
}
