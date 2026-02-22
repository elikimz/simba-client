



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { store, persistor } from "./assets/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        
      </PersistGate>
    </Provider>
  </StrictMode>
);

// **Register Service Worker with aggressive updates**
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered");

        // **Force update check on load**
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload(); // Ensure fresh state
            }
          });
        };
      })
      .catch((err) => console.error("❌ Service Worker failed:", err));
  });
}
