



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

// ✅ Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        console.log("✅ Service Worker registered");
      })
      .catch((err) => console.error("❌ Service Worker failed:", err));
  });
}
