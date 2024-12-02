import "@testing-library/jest-dom";

import { afterEach } from "vitest";

import { setupIonicReact } from "@ionic/react";
import { cleanup } from "@testing-library/react";

// Initialize Ionic React
setupIonicReact();

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock matchmedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };
