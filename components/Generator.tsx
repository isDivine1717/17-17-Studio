import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generatePodcastIdeas, generateScript, generateThumbnail } from '../services/geminiService';
import { ScriptData, GeneratedImage } from '../types';
import { Loader2, RefreshCw, Copy, Image as ImageIcon, FileText, Lightbulb, Download } from 'lucide-react';

const Generator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'ideas' | 'script' | 'art'>('ideas');
  
  // States for generated content
  const [ideas, setIdeas] = useState<string[]>([]);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  
  // Loading states
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const handleGenerateIdeas = async () => {
    if (!topic) return;
    setLoadingIdeas(true);
    const result = await generatePodcastIdeas(topic);
    setIdeas(result);
    setLoadingIdeas(false);
  };

  const handleGenerateScript = async () => {
    if (!topic) return;
    setLoadingScript(true);
    const result = await generateScript(topic);
    setScript(result);
    setLoadingScript(false);
  };

  const handleGenerateImages = async () => {
    if (!topic) return;
    setLoadingImages(true);
    const result = await generateThumbnail(topic);
    setImages(result);
    setLoadingImages(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Generador de Contenido</h2>
      
      {/* Input Section */}
      <div className="bg-neutral-900 p-6 rounded-2xl border border-white/10 mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-2">Tema del Episodio</label>
        <div className="flex gap-4 flex-col md:flex-row">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej. La presión de las redes sociales, Amistad verdadera..."
            className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={() => {
              handleGenerateIdeas();
              setActiveTab('ideas');
            }}
            disabled={!topic || loadingIdeas}
            className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[140px]"
          >
            {loadingIdeas ? <Loader2 className="animate-spin" /> : 'Generar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-xl w-fit">
        {[
          { id: 'ideas', label: 'Ideas', icon: Lightbulb },
          { id: 'script', label: 'Guion', icon: FileText },
          { id: 'art', label: 'Miniaturas', icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-black shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="flex-1 bg-neutral-900/50 border border-white/5 rounded-2xl p-6 overflow-y-auto min-h-[400px]">
        
        {activeTab === 'ideas' && (
          <div className="space-y-4">
            {ideas.length === 0 && !loadingIdeas && (
              <div className="text-center text-gray-500 py-20">Ingresa un tema para ver ideas.</div>
            )}
            {loadingIdeas && (
               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <Loader2 className="animate-spin mb-4" size={32} />
                 <p>Orando... digo, procesando ideas...</p>
               </div>
            )}
            <div className="grid gap-4">
              {ideas.map((idea, idx) => (
                <div key={idx} className="bg-black border border-white/10 p-4 rounded-xl flex justify-between items-center group">
                  <p className="text-lg">{idea}</p>
                  <button 
                    onClick={() => {
                       setTopic(idea);
                       handleGenerateScript();
                       setActiveTab('script');
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-all"
                  >
                    Usar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'script' && (
          <div className="h-full flex flex-col">
            {!script && !loadingScript && (
               <div className="flex flex-col items-center justify-center py-20">
                 <p className="text-gray-500 mb-4">No hay guion generado aún.</p>
                 <button onClick={handleGenerateScript} disabled={!topic} className="text-white underline">Generar Guion para "{topic || '...'}"</button>
               </div>
            )}
            {loadingScript && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <Loader2 className="animate-spin mb-4" size={32} />
                 <p>Escribiendo diálogos para los 6 hosts...</p>
               </div>
            )}
            {script && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-2xl font-bold">{script.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{script.bibleVerse}</p>
                  </div>
                  <button onClick={handleGenerateScript} className="p-2 hover:bg-white/10 rounded-lg">
                    <RefreshCw size={20} />
                  </button>
                </div>
                <div className="prose prose-invert prose-lg max-w-none">
                  <ReactMarkdown>{script.structure}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'art' && (
          <div>
             {images.length === 0 && !loadingImages && (
               <div className="flex flex-col items-center justify-center py-20">
                 <p className="text-gray-500 mb-4">No hay imágenes generadas.</p>
                 <button onClick={handleGenerateImages} disabled={!topic} className="bg-white/10 px-4 py-2 rounded hover:bg-white/20">Generar Miniaturas</button>
               </div>
            )}
            {loadingImages && (
               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <Loader2 className="animate-spin mb-4" size={32} />
                 <p>Diseñando arte en 4K...</p>
               </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden aspect-video border border-white/10">
                  <img src={img.url} alt="Generated thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={img.url} download={`thumbnail-${idx}.png`} className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      <Download size={16} /> Descargar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Generator;