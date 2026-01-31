import React, { useState } from 'react';
import { Search, Book } from 'lucide-react';
import { summarizeVerse } from '../services/geminiService';

const BibleTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const result = await summarizeVerse(query);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Herramienta Bíblica</h2>
        <p className="text-gray-400">Busca un pasaje y obtén una aplicación juvenil instantánea.</p>
      </div>

      <div className="bg-neutral-900 p-1 rounded-full flex border border-white/20 focus-within:border-white transition-colors">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. Juan 3:16, Salmos 23..."
          className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="bg-white text-black px-8 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          {loading ? <span>...</span> : <> <Search size={18} /> <span>Buscar</span> </>}
        </button>
      </div>

      {summary && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Book size={100} />
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-4 border-b border-white/10 pb-2">
            Análisis de {query}
          </h3>
          <p className="text-lg leading-relaxed text-gray-300">
            {summary}
          </p>
          <div className="mt-6 flex justify-end">
            <span className="text-xs text-gray-500 bg-black px-2 py-1 rounded">Generado con Gemini AI • RVR1960</span>
          </div>
        </div>
      )}
      
      {!summary && !loading && (
        <div className="grid grid-cols-2 gap-4 text-center mt-12 opacity-50">
           <div className="p-4 border border-white/10 rounded-xl">
             <span className="block font-bold mb-1">Amistad</span>
             <span className="text-xs">Proverbios 17:17</span>
           </div>
           <div className="p-4 border border-white/10 rounded-xl">
             <span className="block font-bold mb-1">Ansiedad</span>
             <span className="text-xs">Filipenses 4:6-7</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default BibleTool;