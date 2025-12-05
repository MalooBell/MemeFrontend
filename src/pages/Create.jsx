import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { Upload, Type, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { memeService } from '../services/api';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

// Liste des polices disponibles
const FONT_FAMILIES = [
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Comic Sans', value: '"Comic Sans MS", cursive, sans-serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

const Create = () => {
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

  useEffect(() => {
    if (editImageSrc) {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
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
      align: 'center', // Alignement par défaut
      stroke: '#000000',
      strokeWidth: 2,
      fontFamily: 'Impact, sans-serif',
      fontStyle: 'normal',
    };
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
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
      setSelectedId(null);
      
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

  const toggleFontStyle = (styleToToggle) => {
    if (!selectedText) return;
    
    let currentStyle = selectedText.fontStyle || 'normal';
    let newStyle = 'normal';

    const isBold = currentStyle.includes('bold');
    const isItalic = currentStyle.includes('italic');

    if (styleToToggle === 'bold') {
      if (isBold) {
        newStyle = isItalic ? 'italic' : 'normal';
      } else {
        newStyle = isItalic ? 'bold italic' : 'bold';
      }
    } else if (styleToToggle === 'italic') {
      if (isItalic) {
        newStyle = isBold ? 'bold' : 'normal';
      } else {
        newStyle = isBold ? 'bold italic' : 'italic';
      }
    }
    
    updateText(selectedText.id, { fontStyle: newStyle });
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
                  onMouseDown={checkDeselect}
                  onTouchStart={checkDeselect}
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
                <button onClick={addText} className="w-full btn-primary flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    <Type size={18} /> Ajouter Texte
                </button>

                {selectedText && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center border-b pb-2">
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Édition</p>
                           <button 
                                onClick={() => {
                                    setTexts(texts.filter(t => t.id !== selectedId));
                                    setSelectedId(null);
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <textarea 
                            value={selectedText.text} 
                            onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm min-h-[80px]"
                            placeholder="Votre texte ici..."
                        />

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium">Police</label>
                            <select 
                                value={selectedText.fontFamily}
                                onChange={(e) => updateText(selectedText.id, { fontFamily: e.target.value })}
                                className="w-full p-2 border rounded bg-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            >
                                {FONT_FAMILIES.map((font) => (
                                    <option key={font.name} value={font.value}>{font.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Styles et Alignement */}
                        <div className="flex flex-col gap-2">
                            {/* Ligne Gras / Italique / Couleur */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => toggleFontStyle('bold')}
                                    className={`p-2 rounded border transition-colors ${selectedText.fontStyle?.includes('bold') ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-100 text-gray-600'}`}
                                    title="Gras"
                                >
                                    <Bold size={18} />
                                </button>
                                <button 
                                    onClick={() => toggleFontStyle('italic')}
                                    className={`p-2 rounded border transition-colors ${selectedText.fontStyle?.includes('italic') ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-100 text-gray-600'}`}
                                    title="Italique"
                                >
                                    <Italic size={18} />
                                </button>
                                
                                <div className="flex-1 h-10 relative group">
                                    <input 
                                        type="color" 
                                        value={selectedText.fill}
                                        onChange={(e) => updateText(selectedText.id, { fill: e.target.value })}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div 
                                        className="w-full h-full rounded border flex items-center justify-center text-xs text-gray-500 bg-white"
                                        style={{ borderBottom: `4px solid ${selectedText.fill}` }}
                                    >
                                        Couleur
                                    </div>
                                </div>
                            </div>

                            {/* Ligne Alignement */}
                            <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-md justify-between">
                                <button 
                                    onClick={() => updateText(selectedText.id, { align: 'left' })}
                                    className={`flex-1 p-1.5 rounded flex justify-center transition-colors ${selectedText.align === 'left' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-300'}`}
                                    title="Aligner à gauche"
                                >
                                    <AlignLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => updateText(selectedText.id, { align: 'center' })}
                                    className={`flex-1 p-1.5 rounded flex justify-center transition-colors ${selectedText.align === 'center' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-300'}`}
                                    title="Centrer"
                                >
                                    <AlignCenter size={16} />
                                </button>
                                <button 
                                    onClick={() => updateText(selectedText.id, { align: 'right' })}
                                    className={`flex-1 p-1.5 rounded flex justify-center transition-colors ${selectedText.align === 'right' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-300'}`}
                                    title="Aligner à droite"
                                >
                                    <AlignRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="text-xs text-gray-500 font-medium">Taille</label>
                                <span className="text-xs text-gray-400">{selectedText.fontSize}px</span>
                            </div>
                            <input 
                                type="range" min="10" max="150" 
                                value={selectedText.fontSize}
                                onChange={(e) => updateText(selectedText.id, { fontSize: parseInt(e.target.value) })}
                                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={handlePublish} 
                    disabled={loading} 
                    className={`w-full py-4 text-white font-bold rounded-lg shadow-lg transform transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-[1.02]'}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <LoadingSpinner size="sm" text="" />
                            <span>Publication...</span>
                        </div>
                    ) : (
                        "PUBLIER LE MÈME 🚀"
                    )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(5, node.fontSize() * scaleX),
            rotation: node.rotation(),
            // Nous ne mettons pas à jour la largeur (width) ici pour laisser le texte
            // s'adapter, mais l'alignement fonctionnera si le texte est sur plusieurs lignes.
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