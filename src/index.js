
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";

import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

