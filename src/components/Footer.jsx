import { Heart, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        
        {/* Signature Principale */}
        <p className="flex items-center gap-2 text-gray-700 font-medium text-lg">
          Développé avec par 
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            MALOO BELL Loïck Michel
          </span>
        </p>

        {/* Sous-titre et Localisation */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>Ingénieur Système d'Information</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>Cameroun 🇨🇲</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{currentYear}</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;