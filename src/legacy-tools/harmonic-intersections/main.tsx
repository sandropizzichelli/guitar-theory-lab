import React from "react";
import ReactDOM from "react-dom/client";
import { MainExplorerPage } from "./pages/MainExplorerPage";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/fretboard.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainExplorerPage />
  </React.StrictMode>
);
