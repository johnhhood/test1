import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { SessionProvider } from "./lib/SessionContext";
import "./index.css";
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>  
      <BrowserRouter>
        <Toaster position="top-right" />
        <App />
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>
);
