import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// ✅ Vercel Analitik ve Hız İzleme
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        {/* 🌐 Ziyaretçi analitiği */}
        <Analytics />
        {/* ⚡ Performans ölçümü */}
        <SpeedInsights />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
