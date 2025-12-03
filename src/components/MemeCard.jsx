import { Calendar } from 'lucide-react';

const MemeCard = ({ meme }) => {
  const imageUrl = meme.imageUrl || meme.url || meme.file;
  const createdDate = meme.createdAt
    ? new Date(meme.createdAt).toLocaleDateString('fr-FR')
    : 'Date inconnue';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={meme.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {meme.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {createdDate}
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
