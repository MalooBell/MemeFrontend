import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          canGoPrevious
            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Précédent</span>
      </button>

      <div className="text-sm font-medium text-gray-700">
        Page {currentPage + 1} sur {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          canGoNext
            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span>Suivant</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
