import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import AppBoundary from "./components/AppBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppBoundary>
        <App />
      </AppBoundary>
    </BrowserRouter>
  </StrictMode>,
);
