import React from "react";

const Pagination = ({ total, current, perPage, onPageChange }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 items-center">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border text-sm ${
            current === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
