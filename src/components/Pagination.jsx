import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(currentPage - 2, 1);
  const endPage = Math.min(currentPage + 2, totalPages);

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-center items-center mt-8 space-x-2 text-sm">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`flex items-center px-3 py-1.5 rounded-lg border transition ${
          currentPage === 1
            ? "bg-gray-200 dark:bg-neutral-700 text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200"
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={index}
            className="px-2 text-gray-400 dark:text-gray-500 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg border transition ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`flex items-center px-3 py-1.5 rounded-lg border transition ${
          currentPage === totalPages
            ? "bg-gray-200 dark:bg-neutral-700 text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200"
        }`}
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
