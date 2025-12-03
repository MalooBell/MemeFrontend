import { useState, useEffect } from 'react';
import { Search, SortAsc, SortDesc, Trash2, AlertTriangle } from 'lucide-react';
import { memeService } from '../services/api';
import MemeCard from '../components/MemeCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import Modal from '../components/Modal'; // <-- Import Modal

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [toast, setToast] = useState(null);

  // --- NOUVEAUX STATES POUR LA MODAL ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memeToDelete, setMemeToDelete] = useState(null);

  const pageSize = 9;

  useEffect(() => {
    fetchMemes();
  }, [currentPage, sortDir]);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const data = await memeService.getMemes(currentPage, pageSize, searchTerm, sortDir);
      setMemes(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur chargement galerie' });
    } finally {
      setLoading(false);
    }
  };

  // 1. On ouvre la modal au lieu de supprimer direct
  const requestDelete = (id) => {
    setMemeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 2. L'action réelle de suppression
  const confirmDelete = async () => {
    if (!memeToDelete) return;
    
    try {
      await memeService.deleteMeme(memeToDelete);
      setToast({ type: 'success', message: 'Mème supprimé avec succès' });
      fetchMemes();
    } catch (error) {
      setToast({ type: 'error', message: 'Impossible de supprimer' });
    } finally {
      setIsDeleteModalOpen(false);
      setMemeToDelete(null);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* --- MODAL DE SUPPRESSION --- */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer ce mème ? <br/>
            <span className="font-bold text-red-500">Cette action est irréversible.</span>
          </p>
          
          <div className="flex gap-3 w-full mt-4">
            <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
                Annuler
            </button>
            <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
                Supprimer
            </button>
          </div>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galerie de Mèmes</h1>
          <p className="text-gray-600">Explorez les créations de la communauté</p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </form>
            <button
              onClick={toggleSortDir}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
            >
              {sortDir === 'desc' ? <><SortDesc size={20} /><span>Récents</span></> : <><SortAsc size={20} /><span>Anciens</span></>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Aucun mème trouvé 😢</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {memes.map((meme) => (
                <MemeCard 
                    key={meme.id} 
                    meme={meme} 
                    onDelete={requestDelete} // On passe la fonction qui ouvre la modal
                />
              ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;