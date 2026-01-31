import React, { useState } from 'react';
import { INITIAL_MEMBERS } from '../constants';
import { Member } from '../types';

interface LoginProps {
  onLogin: (member: Member) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleLogin = () => {
    const user = INITIAL_MEMBERS.find(m => m.id === selectedId);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 border border-white/10 mx-4">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-2 border-2 border-white mb-4 text-2xl font-bold tracking-widest">
            17-17 STUDIO
          </div>
          <p className="text-gray-400">Acceso exclusivo para el equipo</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Selecciona tu nombre</label>
            <select 
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full bg-neutral-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/50 focus:outline-none appearance-none"
            >
              <option value="">-- ¿Quién eres? --</option>
              {INITIAL_MEMBERS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleLogin}
            disabled={!selectedId}
            className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Entrar al Studio
          </button>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">"En todo tiempo ama el amigo..." Prov 17:17</p>
        </div>
      </div>
    </div>
  );
};

export default Login;