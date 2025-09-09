import React from "react";
import { IoArrowBackCircle } from "react-icons/io5";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const getPageNumbers = (currentPage, totalPages, siblingCount = 1) => {
    const totalPageSlots = siblingCount * 2 + 5; // first, last, current, siblings, and 2 ellipses

    if (totalPages <= totalPageSlots) {
      // Array.from is a JavaScript method that creates a new array from an array-like or iterable object.
      // { length: totalPages } creates an “array-like” object with a specified length.
      // Show all pages if not too many (start from 1)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    const pages = [];

    pages.push(1); // Always show first page

    if (showLeftEllipsis) {
      pages.push("...");
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (showRightEllipsis) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-4 flex justify-center space-x-2">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="cursor-pointer disabled:opacity-50"
      >
        <IoArrowBackCircle className="text-fourth text-4xl hover:text-purple-800" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num, idx) =>
        num === "..." ? (
          <span key={`ellipsis-${idx}`}>...</span>
        ) : (
          <button
            type="button"
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`text-fourth cursor-pointer @max-md:text-sm @max-md:px-2 rounded border border-purple-400 px-3 py-1 font-bold ${
              currentPage === num ? "bg-bgYellow" : "bg-white"
            }`}
          >
            {num}
          </button>
        ),
      )}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50"
      >
        <IoArrowBackCircle className="text-fourth rotate-180 cursor-pointer text-4xl hover:text-purple-800" />
      </button>
    </div>
  );
};

export default Pagination;
