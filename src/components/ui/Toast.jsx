import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        px-6 py-3 rounded-lg shadow-xl text-white text-sm sm:text-base
        bg-opacity-90 backdrop-blur-sm font-medium tracking-wide
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
        animate-slideDown
      `}
    >
      {message}
    </div>
  );
}
