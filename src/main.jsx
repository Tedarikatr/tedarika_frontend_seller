import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ Vercel Analitik ve Hız İzleme
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* 🌐 Ziyaretçi analitiği */}
      <Analytics />
      {/* ⚡ Performans ölçümü */}
      <SpeedInsights />
    </BrowserRouter>
  </React.StrictMode>
);
