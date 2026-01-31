export type Role = string;

export interface Member {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export type ViewState = 
  | 'home' 
  | 'generator' 
  | 'calendar' 
  | 'bible' 
  | 'chatbot' 
  | 'team' 
  | 'export'
  | 'notes';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  type: 'recording' | 'meeting' | 'release';
}

export interface ScriptData {
  title: string;
  topic: string;
  bibleVerse: string;
  structure: string; // Markdown content
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}