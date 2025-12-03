import { useState } from 'react';
import { Calendar, Download, Share2, Trash2, Edit, Link as LinkIcon, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // <-- Import Modal

const MemeCard = ({ meme, onDelete }) => {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const imageUrl = meme.imageUrl || meme.url;
  const createdDate = meme.createdAt
    ? new Date(meme.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date inconnue';

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meme-${meme.title || 'supinfo'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erreur download", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    navigate('/create', { state: { imageUrl: imageUrl } });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={meme.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* Overlay au survol */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button 
                  onClick={handleEdit}
                  className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
              >
                  <Edit size={16} /> Réutiliser
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800 truncate flex-1 pr-2 text-lg" title={meme.title}>
              {meme.title || "Sans titre"}
              </h3>
              <button 
                  onClick={() => onDelete(meme.id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                  title="Supprimer"
              >
                  <Trash2 size={18} />
              </button>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  <Calendar size={12} className="mr-1.5" />
                  {createdDate}
              </span>
              
              <div className="flex gap-2">
                  <button 
                      onClick={handleDownload}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Télécharger"
                  >
                      <Download size={20} />
                  </button>
                  <button 
                      onClick={() => setIsShareOpen(true)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Partager"
                  >
                      <Share2 size={20} />
                  </button>
              </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE PARTAGE --- */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Partager le mème"
      >
        <div className="space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Lien direct</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={imageUrl} 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none"
                    />
                    <button 
                        onClick={copyToClipboard}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                        {copied ? 'Copié !' : 'Copier'}
                    </button>
                </div>
            </div>
            
            <div className="pt-2 text-center">
                <p className="text-xs text-gray-400">Le lien est public et accessible à tous.</p>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default MemeCard;