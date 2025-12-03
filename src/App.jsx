import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import du footer
import Create from './pages/Create';
import Gallery from './pages/Gallery';

function App() {
  return (
    <Router>
      {/* On utilise flex-col et min-h-screen pour pousser le footer en bas */}
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center">
  ℹ️ Hébergement Démo (Render Free Tier) : Le serveur peut prendre jusqu'à 60 secondes pour démarrer à la première requête. Merci de patienter ! ⏳
</div>
        
        {/* Le main prend tout l'espace disponible */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<Create />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;