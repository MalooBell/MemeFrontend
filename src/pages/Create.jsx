import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Ajout useLocation
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { Upload, Type, Trash2, Send, Save } from 'lucide-react'; // Ajout Save si besoin
import { memeService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const Create = () => {
  // Récupération de l'état si on vient de la galerie (mode édition)
  const location = useLocation();
  const editImageSrc = location.state?.imageUrl;

  const [image, setImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;

  // Charger l'image si on vient du bouton "Éditer"
  useEffect(() => {
    if (editImageSrc) {
      const img = new window.Image();
      img.crossOrigin = "Anonymous"; // Important pour éviter le canvas tainted
      img.src = editImageSrc;
      img.onload = () => setImage(img);
    }
  }, [editImageSrc]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => setImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => setImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CORRECTION BORDURES : Désélectionner quand on clique dans le vide ---
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Double clique pour éditer',
      x: CANVAS_WIDTH / 2 - 100,
      y: texts.length * 60 + 50,
      fontSize: 32,
      fill: '#FFFFFF',
      rotation: 0,
      stroke: '#000000',
      strokeWidth: 2,
    };
    setTexts([...texts, newText]);
    setSelectedId(newText.id); // Sélectionne le nouveau texte
  };

  const handlePublish = async () => {
    if (!image) {
      setToast({ type: 'error', message: 'Veuillez charger une image' });
      return;
    }
    if (!title.trim()) {
      setToast({ type: 'error', message: 'Veuillez entrer un titre' });
      return;
    }

    try {
      setLoading(true);
      
      // --- CORRECTION CRITIQUE : On désélectionne tout avant la photo ---
      setSelectedId(null);
      
      // Petit délai pour laisser React mettre à jour l'état (enlever les bordures)
      setTimeout(async () => {
          const uri = stageRef.current.toDataURL();
          const blob = await (await fetch(uri)).blob();
          const file = new File([blob], `${title}.png`, { type: 'image/png' });

          await memeService.createMeme(file, title);
          setToast({ type: 'success', message: 'Mème publié avec succès !' });

          setTimeout(() => {
            navigate('/gallery');
          }, 1500);
      }, 100);

    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Erreur lors de la publication' });
      setLoading(false);
    }
  };

  const updateText = (id, newAttrs) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, ...newAttrs } : t)));
  };

  const selectedText = texts.find((t) => t.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
        {/* Zone Canvas */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`w-[300px] h-[300px] md:w-[600px] md:h-[600px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Cliquez ou glissez une image</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              ) : (
                <Stage
                  ref={stageRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onMouseDown={checkDeselect} // Gère le clic souris
                  onTouchStart={checkDeselect} // Gère le tactile
                  className="border border-gray-300 shadow-inner"
                >
                  <Layer>
                    <KonvaImage image={image} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                    {texts.map((text) => (
                      <TextElement
                        key={text.id}
                        shapeProps={text}
                        isSelected={text.id === selectedId}
                        onSelect={() => setSelectedId(text.id)}
                        onChange={(newAttrs) => updateText(text.id, newAttrs)}
                      />
                    ))}
                  </Layer>
                </Stage>
              )}
            </div>
        </div>

        {/* Contrôles */}
        <div className="w-full md:w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-xl z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Outils</h2>
          <div className="space-y-6">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du mème..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {image && (
              <>
                <button onClick={addText} className="w-full btn-primary flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Type size={18} /> Ajouter Texte
                </button>

                {selectedText && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                        <p className="text-xs font-bold text-gray-500 uppercase">Édition Texte</p>
                        <textarea 
                            value={selectedText.text} 
                            onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                value={selectedText.fill}
                                onChange={(e) => updateText(selectedText.id, { fill: e.target.value })}
                                className="h-10 w-10 rounded cursor-pointer"
                            />
                            <input 
                                type="range" min="10" max="100" 
                                value={selectedText.fontSize}
                                onChange={(e) => updateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
                                className="flex-1"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setTexts(texts.filter(t => t.id !== selectedId));
                                setSelectedId(null);
                            }}
                            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded"
                        >
                            <Trash2 size={16} /> Supprimer ce texte
                        </button>
                    </div>
                )}

                <button onClick={handlePublish} disabled={loading} className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg transform hover:scale-[1.02] transition-all">
                    {loading ? "Création..." : "PUBLIER LE MÈME 🚀"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant interne pour le texte et le transformateur
const TextElement = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1); // Reset scale pour ne changer que le fontSize
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(5, node.fontSize() * scaleX),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Create;