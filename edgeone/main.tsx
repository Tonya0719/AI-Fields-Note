import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./src/page";
import "./src/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
