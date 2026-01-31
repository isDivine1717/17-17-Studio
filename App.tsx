import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import TeamRoulette from './components/TeamRoulette';
import CalendarView from './components/CalendarView';
import BibleTool from './components/BibleTool';
import Chatbot from './components/Chatbot';
import ExportView from './components/ExportView';
import NotesView from './components/NotesView';
import { Member, ViewState } from './types';
import { INITIAL_MEMBERS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  // Load state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('1717_user');
    const storedMembers = localStorage.getItem('1717_members');
    
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
    if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
    }
  }, []);

  const handleLogin = (member: Member) => {
    setCurrentUser(member);
    localStorage.setItem('1717_user', JSON.stringify(member));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    localStorage.removeItem('1717_user');
  };

  const handleUpdateMembers = (newMembers: Member[]) => {
      setMembers(newMembers);
      localStorage.setItem('1717_members', JSON.stringify(newMembers));
      
      // Update current user if role changed
      if (currentUser) {
          const updatedSelf = newMembers.find(m => m.id === currentUser.id);
          if (updatedSelf) {
              setCurrentUser(updatedSelf);
              localStorage.setItem('1717_user', JSON.stringify(updatedSelf));
          }
      }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard currentUser={currentUser} onChangeView={setCurrentView} />;
      case 'notes':
        return <NotesView />;
      case 'generator':
        return <Generator />;
      case 'calendar':
        return <CalendarView />;
      case 'bible':
        return <BibleTool />;
      case 'chatbot':
        return <Chatbot currentUser={currentUser} />;
      case 'team':
        return <TeamRoulette members={members} onUpdateMembers={handleUpdateMembers} />;
      case 'export':
        return <ExportView />;
      default:
        return <Dashboard currentUser={currentUser} onChangeView={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;