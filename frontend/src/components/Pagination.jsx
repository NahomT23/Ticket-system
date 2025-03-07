import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { connect } from 'react-redux';

class Pagination extends Component {
  render() {
    const { currentPage, totalPages, onPaginate, isDarkMode } = this.props;
    
    return (
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onPaginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={isDarkMode ? 'text-gray-50' : ''}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? 'bg-gray-100' : 'outline'}
            onClick={() => onPaginate(number)}
            className={isDarkMode ? 'text-gray-50 bg-gray-600' : ''}
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => onPaginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={isDarkMode ? 'text-gray-50' : ''}
        >
          Next
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isDarkMode: state.theme.isDarkMode,
});

export default connect(mapStateToProps)(Pagination);