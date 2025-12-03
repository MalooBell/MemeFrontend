import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import {
  Upload,
  Type,
  Trash2,
  Send,
  RotateCw,
} from 'lucide-react';
import { memeService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const Create = () => {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          setImage(img);
        };
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
        img.onload = () => {
          setImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Nouveau texte',
      x: CANVAS_WIDTH / 2 - 50,
      y: texts.length * 60 + 50,
      fontSize: 32,
      fill: '#FFFFFF',
      rotation: 0,
      stroke: '#000000',
      strokeWidth: 2,
    };
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
  };

  const updateText = (id, updates) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteText = (id) => {
    setTexts(texts.filter((t) => t.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const selectedText = texts.find((t) => t.id === selectedId);

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
      const uri = stageRef.current.toDataURL();
      const blob = await (await fetch(uri)).blob();
      const file = new File([blob], `${title}.png`, { type: 'image/png' });

      await memeService.createMeme(file, title);
      setToast({ type: 'success', message: 'Mème publié avec succès !' });

      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erreur lors de la publication du mème',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer un Mème
              </h1>
              <p className="text-gray-600">
                Uploadez une image et ajoutez du texte pour créer votre mème
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Glissez-déposez une image ici
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Stage
                    ref={stageRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="border border-gray-300 rounded-lg"
                  >
                    <Layer>
                      <KonvaImage
                        image={image}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                      />
                      {texts.map((text) => (
                        <TextElement
                          key={text.id}
                          text={text}
                          isSelected={text.id === selectedId}
                          onSelect={() => setSelectedId(text.id)}
                          onChange={(updates) => updateText(text.id, updates)}
                        />
                      ))}
                    </Layer>
                  </Stage>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Contrôles</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du mème
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mon super mème..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {image && (
              <>
                <div>
                  <button
                    onClick={addText}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Type className="w-5 h-5" />
                    <span>Ajouter du texte</span>
                  </button>
                </div>

                {selectedText && (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Texte sélectionné
                      </h3>
                      <button
                        onClick={() => deleteText(selectedText.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu
                      </label>
                      <textarea
                        value={selectedText.text}
                        onChange={(e) =>
                          updateText(selectedText.id, { text: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur du texte
                      </label>
                      <input
                        type="color"
                        value={selectedText.fill}
                        onChange={(e) =>
                          updateText(selectedText.id, { fill: e.target.value })
                        }
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taille de police: {selectedText.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="120"
                        value={selectedText.fontSize}
                        onChange={(e) =>
                          updateText(selectedText.id, {
                            fontSize: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation: {Math.round(selectedText.rotation)}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={selectedText.rotation}
                        onChange={(e) =>
                          updateText(selectedText.id, {
                            rotation: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" text="" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publier le mème</span>
                    </>
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

const TextElement = ({ text, isSelected, onSelect, onChange }) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        {...text}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max(16, text.fontSize * scaleX),
          });
        }}
        fontFamily="Impact, sans-serif"
        align="center"
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Create;
