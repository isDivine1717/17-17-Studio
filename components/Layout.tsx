import React, { useState } from 'react';
import { ViewState, Member } from '../types';
import { 
  LayoutGrid, 
  Mic, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Download, 
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  currentUser: Member | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutGrid },
    { id: 'notes', label: 'Notas', icon: FileText },
    { id: 'generator', label: 'Generador', icon: Mic },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'bible', label: 'Biblia', icon: BookOpen },
    { id: 'chatbot', label: 'Chatbot IA', icon: MessageSquare },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'export', label: 'Exportar', icon: Download },
  ];

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-white flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/10 h-screen sticky top-0">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-white text-black font-bold rounded flex items-center justify-center text-xs">17</div>
          <span className="text-xl font-bold tracking-tight">17-17 Studio</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-white text-black shadow-lg shadow-white/10 font-semibold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-xs font-bold">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 glass-panel border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold">17-17 Studio</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 pt-16 px-6 md:hidden">
          <div className="flex flex-col space-y-4">
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-4 p-4 rounded-xl text-lg ${
                    currentView === item.id ? 'bg-white text-black' : 'text-gray-300 border border-white/10'
                  }`}
                >
                  <item.icon size={24} />
                  <span>{item.label}</span>
                </button>
              ))}
              <button 
                onClick={onLogout}
                className="flex items-center space-x-4 p-4 rounded-xl text-lg text-red-400 border border-red-900/50 mt-4"
              >
                <LogOut size={24} />
                <span>Salir</span>
              </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 pt-20 md:pt-8 bg-background relative">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;