import React, { useState, useRef, useEffect } from 'react';
import { Member, ChatMessage } from '../types';
import { chatWithBot } from '../services/geminiService';
import { Send, Bot } from 'lucide-react';

interface ChatbotProps {
  currentUser: Member;
}

const Chatbot: React.FC<ChatbotProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      senderId: 'system',
      senderName: '17-17 Bot',
      text: '¡Hola equipo! Estoy aquí para ayudar con ideas bíblicas, dudas teológicas o sugerencias para el podcast. ¿En qué trabajamos hoy?',
      timestamp: Date.now(),
      isSystem: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
        role: m.isSystem ? 'model' : 'user',
        parts: [{ text: m.text }]
    }));

    // Add current message to history context
    history.push({ role: 'user', parts: [{ text: userMsg.text }] });

    // Call Gemini
    const responseText = await chatWithBot(history, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      senderId: 'system',
      senderName: '17-17 Bot',
      text: responseText || "Estoy pensando...",
      timestamp: Date.now(),
      isSystem: true
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-neutral-900 flex justify-between items-center">
        <h2 className="font-bold text-lg flex items-center">
          <Bot className="mr-2 text-green-400" /> Chat de Equipo 17-17
        </h2>
        <span className="text-xs text-green-500 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
          Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                isMe 
                  ? 'bg-white text-black rounded-tr-none' 
                  : msg.isSystem 
                    ? 'bg-neutral-800 border border-green-900/30 text-gray-200 rounded-tl-none' 
                    : 'bg-neutral-800 text-white rounded-tl-none'
              }`}>
                {!isMe && (
                  <p className={`text-xs font-bold mb-1 ${msg.isSystem ? 'text-green-400' : 'text-gray-400'}`}>
                    {msg.senderName}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-neutral-900 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pregunta algo al equipo o a la IA..."
            className="flex-1 bg-black border border-white/20 rounded-full px-4 py-3 focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 bg-white text-black rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;