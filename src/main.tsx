import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

import * as PIXI from "pixi.js";

window.PIXI = PIXI;


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <App />
);
