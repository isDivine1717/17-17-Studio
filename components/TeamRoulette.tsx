import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { AVAILABLE_ROLES } from '../constants';
import { Shuffle, User, Settings, Plus, X, RotateCcw, Edit2, Check, Trash2 } from 'lucide-react';

interface TeamRouletteProps {
  members: Member[];
  onUpdateMembers: (members: Member[]) => void;
}

const TeamRoulette: React.FC<TeamRouletteProps> = ({ members, onUpdateMembers }) => {
  const [spinning, setSpinning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  
  // State for manual editing
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Manage roles state with persistence
  const [availableRoles, setAvailableRoles] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('1717_roles');
      if (saved) return JSON.parse(saved);
    }
    return [...AVAILABLE_ROLES];
  });

  useEffect(() => {
    localStorage.setItem('1717_roles', JSON.stringify(availableRoles));
  }, [availableRoles]);

  const spinRoles = () => {
    if (availableRoles.length === 0) {
      alert("¡Necesitas agregar roles para girar la ruleta!");
      return;
    }

    setSpinning(true);
    
    // Simulate spin duration
    setTimeout(() => {
      // Create a copy of roles to shuffle
      // If we have more members than roles, we repeat roles
      let pool = [...availableRoles];
      while (pool.length < members.length) {
        pool = [...pool, ...availableRoles];
      }
      
      const shuffledRoles = pool.sort(() => Math.random() - 0.5);
      
      const newMembers = members.map((member, index) => ({
        ...member,
        role: shuffledRoles[index]
      }));
      
      onUpdateMembers(newMembers);
      setSpinning(false);
    }, 1500);
  };

  const handleAddRole = () => {
    if (newRoleInput.trim()) {
      if (!availableRoles.includes(newRoleInput.trim())) {
        setAvailableRoles([...availableRoles, newRoleInput.trim()]);
        setNewRoleInput('');
      }
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setAvailableRoles(availableRoles.filter(r => r !== roleToRemove));
  };

  const handleResetRoles = () => {
    if(confirm('¿Restaurar los roles por defecto? Se perderán los roles personalizados.')) {
      setAvailableRoles([...AVAILABLE_ROLES]);
    }
  };

  // Manual Editing Handlers
  const startEditing = (member: Member) => {
    setEditingMemberId(member.id);
    setEditValue(member.role === 'Sin Asignar' ? '' : member.role);
  };

  const saveMemberRole = (memberId: string) => {
    const finalRole = editValue.trim() || 'Sin Asignar';
    const updatedMembers = members.map(m => 
      m.id === memberId ? { ...m, role: finalRole } : m
    );
    onUpdateMembers(updatedMembers);
    setEditingMemberId(null);
  };

  const clearMemberRole = (memberId: string) => {
      const updatedMembers = members.map(m => 
          m.id === memberId ? { ...m, role: 'Sin Asignar' } : m
      );
      onUpdateMembers(updatedMembers);
  };

  // Helper to get a consistent color based on string content
  const getRoleStyle = (role: string) => {
    if (role === 'Sin Asignar') return 'bg-neutral-800 text-gray-500 border-gray-700 border-dashed';

    const PRESETS = [
      'bg-yellow-500/20 text-yellow-200 border-yellow-500/50',
      'bg-blue-500/20 text-blue-200 border-blue-500/50',
      'bg-purple-500/20 text-purple-200 border-purple-500/50',
      'bg-green-500/20 text-green-200 border-green-500/50',
      'bg-red-500/20 text-red-200 border-red-500/50',
      'bg-pink-500/20 text-pink-200 border-pink-500/50',
      'bg-orange-500/20 text-orange-200 border-orange-500/50',
      'bg-cyan-500/20 text-cyan-200 border-cyan-500/50',
    ];

    // Specific mapping for default roles to keep them consistent
    if (role === 'Líder') return PRESETS[0];
    if (role === 'Productor') return PRESETS[1];
    if (role === 'Editor Audio') return PRESETS[2];
    if (role === 'Investigador Bíblico') return PRESETS[3];
    if (role === 'Promotor YT') return PRESETS[4];
    if (role === 'Invitado Especial') return PRESETS[5];

    // Hash for custom roles to get a "random" but consistent color
    let hash = 0;
    for (let i = 0; i < role.length; i++) {
      hash = role.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PRESETS.length;
    return PRESETS[index];
  };

  return (
    <div className="h-full flex flex-col items-center max-w-5xl mx-auto py-4">
      
      <div className="w-full flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
           <h2 className="text-3xl font-bold">Asignación de Roles</h2>
           <p className="text-gray-400 text-sm mt-1">
             {availableRoles.length} roles disponibles para {members.length} miembros.
             <span className="hidden md:inline"> Haz clic en un rol para editarlo manualmente.</span>
           </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl border transition-all ${showSettings ? 'bg-white text-black border-white' : 'bg-neutral-900 border-white/20 text-gray-300 hover:text-white'}`}
            title="Configurar Roles"
          >
            <Settings size={20} />
          </button>

          <button 
            onClick={spinRoles}
            disabled={spinning || availableRoles.length === 0}
            className={`
              bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl 
              flex items-center space-x-2 text-lg hover:shadow-[0_0_20px_rgba(100,100,255,0.4)] transition-all
              ${spinning ? 'opacity-70 cursor-wait' : ''}
              ${availableRoles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Shuffle className={spinning ? 'animate-spin' : ''} size={20} />
            <span>{spinning ? 'Girando...' : 'Girar Ruleta'}</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-full mb-8 animate-fade-in">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings size={18} className="text-gray-400" /> Gestionar Pool de Roles
            </h3>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                placeholder="Nombre del nuevo rol (ej. Camarógrafo)"
                className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-white text-white"
              />
              <button 
                onClick={handleAddRole}
                disabled={!newRoleInput.trim()}
                className="bg-white text-black font-bold px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
              {availableRoles.map((role) => (
                <div key={role} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${getRoleStyle(role)}`}>
                  <span>{role}</span>
                  <button onClick={() => handleRemoveRole(role)} className="hover:text-white/70">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
               <button onClick={handleResetRoles} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1">
                 <RotateCcw size={12} /> Resetear por defecto
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {members.map((member) => (
          <div 
            key={member.id} 
            className={`
              bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center
              transition-all duration-500 relative group/card
              ${spinning ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}
            `}
          >
            <div className="w-20 h-20 rounded-full bg-neutral-800 mb-4 flex items-center justify-center border-2 border-white/5 relative overflow-hidden group">
               {member.id === '1' ? (
                 <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">17</div>
               ) : (
                 <User size={32} className="text-gray-400" />
               )}
            </div>
            
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            
            {/* Role Editor / Display */}
            {editingMemberId === member.id ? (
              <div className="mt-2 flex items-center gap-2 w-full animate-fade-in">
                  <div className="relative flex-1">
                      <input 
                        list={`roles-${member.id}`}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveMemberRole(member.id)}
                        className="w-full bg-black border border-white/30 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 text-white"
                        autoFocus
                        placeholder="Escribe o selecciona..."
                      />
                      <datalist id={`roles-${member.id}`}>
                          {availableRoles.map(r => <option key={r} value={r} />)}
                      </datalist>
                  </div>
                  <button onClick={() => saveMemberRole(member.id)} className="text-green-400 hover:text-green-300 p-1">
                      <Check size={18} />
                  </button>
                  <button onClick={() => setEditingMemberId(null)} className="text-gray-400 hover:text-gray-300 p-1">
                      <X size={18} />
                  </button>
              </div>
            ) : (
              <div className="group/role relative mt-2 flex items-center gap-2">
                <div 
                    onClick={() => startEditing(member)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-300 cursor-pointer
                      flex items-center gap-2
                      ${getRoleStyle(member.role)}
                      hover:brightness-110 hover:shadow-lg
                    `}
                    title="Clic para editar"
                >
                  {member.role}
                  <Edit2 size={10} className="opacity-50" />
                </div>
                
                {member.role !== 'Sin Asignar' && (
                    <button 
                        onClick={() => clearMemberRole(member.id)}
                        className="opacity-0 group-hover/role:opacity-100 p-1.5 rounded-full bg-neutral-800 text-gray-500 hover:text-red-400 hover:bg-neutral-700 transition-all absolute -right-8"
                        title="Quitar rol"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRoulette;