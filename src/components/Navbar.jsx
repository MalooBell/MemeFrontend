import { Link, useLocation } from 'react-router-dom';
import { ImagePlus, Images, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO PERSONNALISÉ --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
              {/* Petit badge de notification visuel */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight leading-none">
                MemeGen
              </span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                By Loïck M.
              </span>
            </div>
          </Link>

          {/* --- MENU DE NAVIGATION --- */}
          <div className="flex space-x-2">
            <NavLink 
              to="/create" 
              active={isActive('/create')} 
              icon={<ImagePlus className="w-4 h-4" />} 
              text="Créer" 
            />
            <NavLink 
              to="/gallery" 
              active={isActive('/gallery')} 
              icon={<Images className="w-4 h-4" />} 
              text="Galerie" 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Petit composant helper pour éviter la répétition
const NavLink = ({ to, active, icon, text }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
      active
        ? 'bg-gray-900 text-white shadow-md transform scale-105'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;