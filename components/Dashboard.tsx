import React, { useState, useEffect } from 'react';
import { Member, ViewState } from '../types';
import { BIBLE_SUMMARIES } from '../constants';
import { Sparkles, Calendar as CalendarIcon, ArrowRight, Mic } from 'lucide-react';

interface DashboardProps {
  currentUser: Member;
  onChangeView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onChangeView }) => {
  const [dailyVerse, setDailyVerse] = useState("");

  useEffect(() => {
    // Random verse on load
    const random = BIBLE_SUMMARIES[Math.floor(Math.random() * BIBLE_SUMMARIES.length)];
    setDailyVerse(random);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Hola, {currentUser.name.split(' ')[0]}
        </h1>
        <p className="text-gray-400 text-lg">
          Rol actual: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{currentUser.role}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Action: Generator */}
        <div 
          onClick={() => onChangeView('generator')}
          className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={120} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Crear Nuevo Episodio</h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            Usa la IA de Gemini para generar ideas, guiones completos y miniaturas en segundos.
          </p>
          <button className="flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
            <span>Ir al Generador</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Quick Action: Calendar */}
        <div 
           onClick={() => onChangeView('calendar')}
           className="rounded-2xl p-6 bg-neutral-900 border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-900/20 text-blue-400 flex items-center justify-center mb-4">
              <CalendarIcon />
            </div>
            <h3 className="text-xl font-bold">Calendario</h3>
            <p className="text-sm text-gray-500 mt-1">Ver próximos eventos y grabaciones.</p>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-blue-400">
            Ver agenda <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Daily Verse Card */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-neutral-900 to-black border border-white/5 relative">
        <div className="absolute top-4 left-4 text-white/10">
          <Mic size={40} />
        </div>
        <div className="text-center relative z-10">
          <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Versículo de Inspiración</h4>
          <p className="text-xl md:text-2xl font-serif italic text-gray-200 leading-relaxed">
            "{dailyVerse}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;