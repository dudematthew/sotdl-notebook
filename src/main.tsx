import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { initSentry } from "./utils/sentry";

// Initialize Sentry
initSentry();

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
