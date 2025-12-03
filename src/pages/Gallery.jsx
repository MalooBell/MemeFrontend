import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { memeService } from '../services/api';
import MemeCard from '../components/MemeCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [toast, setToast] = useState(null);

  const pageSize = 9;

  useEffect(() => {
    fetchMemes();
  }, [currentPage, sortDir]);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const data = await memeService.getMemes(
        currentPage,
        pageSize,
        searchTerm,
        sortDir
      );
      setMemes(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erreur lors du chargement des mèmes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchMemes();
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Galerie de Mèmes
          </h1>
          <p className="text-gray-600">
            Parcourez tous les mèmes créés par la communauté
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un mème..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            <button
              onClick={toggleSortDir}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortDir === 'desc' ? (
                <>
                  <SortDesc className="w-5 h-5" />
                  <span>Plus récents</span>
                </>
              ) : (
                <>
                  <SortAsc className="w-5 h-5" />
                  <span>Plus anciens</span>
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Chargement des mèmes..." />
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucun mème trouvé</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
