import React, { Component } from 'react';

class Pagination extends Component {
  render() {
    const { currentPage, totalPages, onPaginate, isDarkMode } = this.props;
    return (
      <div className="flex justify-center mt-4 pb-6">
        <button
          onClick={() => onPaginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 border border-gray-400 rounded-md ${
            isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => onPaginate(number)}
            className={`px-4 py-2 mx-1 border border-gray-400 rounded-md ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => onPaginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 border border-gray-400 rounded-md ${
            isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    );
  }
}

export default Pagination;
