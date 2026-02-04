/**
 * TableContainer - Tablo sayfalarında ortak dış sarmalayıcı
 * Beyaz arka plan, gölge, yuvarlatılmış köşeler - tutarlı görünüm için
 */
import React from "react";

const TableContainer = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

export default TableContainer;
