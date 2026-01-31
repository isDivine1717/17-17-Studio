import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { Plus, ChevronLeft, ChevronRight, X, Clock, Calendar as CalendarIcon, MapPin, AlignLeft } from 'lucide-react';

const CalendarView: React.FC = () => {
    // State for current view
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // Initialize state from localStorage or mock data
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('1717_events');
            if (saved) return JSON.parse(saved);
        }
        return [
            { id: '1', title: 'Ep 45: Redes Sociales', date: '2024-06-15', time: '18:00', type: 'recording' },
            { id: '2', title: 'Reunión Creativa', date: '2024-06-12', time: '10:00', type: 'meeting' },
        ];
    });

    // Persist events to localStorage
    useEffect(() => {
        localStorage.setItem('1717_events', JSON.stringify(events));
    }, [events]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventTime, setNewEventTime] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');
    const [newEventType, setNewEventType] = useState<'recording' | 'meeting' | 'release'>('meeting');

    // Calendar logic helpers
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const MONTH_NAMES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    };

    const handleDayClick = (day: number) => {
        // Format YYYY-MM-DD manually to avoid timezone issues with toISOString
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        // Reset form
        setNewEventTitle('');
        setNewEventTime('10:00');
        setNewEventDesc('');
        setNewEventType('meeting');
        setIsModalOpen(true);
    };

    const handleAddEvent = () => {
        if (!newEventTitle.trim()) return;

        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: newEventTitle,
            date: selectedDate,
            time: newEventTime,
            description: newEventDesc,
            type: newEventType
        };

        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const deleteEvent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm('¿Eliminar este evento?')) {
            setEvents(events.filter(ev => ev.id !== id));
        }
    };

    const getEventTypeStyles = (type: string) => {
        switch(type) {
            case 'recording': return 'bg-red-500/20 text-red-200 border-red-500/30';
            case 'meeting': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
            case 'release': return 'bg-green-500/20 text-green-200 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
        }
    };

    // Generate grid cells
    const renderCells = () => {
        const slots = [];
        
        // Empty slots for days before start of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            slots.push(<div key={`empty-${i}`} className="min-h-[120px] bg-neutral-900/30 border border-white/5 opacity-30"></div>);
        }

        // Day slots
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            // Check if today
            const todayObj = new Date();
            const isToday = todayObj.getDate() === day && todayObj.getMonth() === month && todayObj.getFullYear() === year;

            slots.push(
                <div 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`
                        min-h-[120px] border p-2 relative group cursor-pointer transition-colors flex flex-col gap-1
                        ${isToday 
                            ? 'bg-white/10 border-white/50' 
                            : 'bg-neutral-900 border-white/10 hover:bg-neutral-800 hover:border-white/30'}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                            {day}
                        </span>
                        {/* Hover add button */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={16} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        {dayEvents.map(ev => (
                            <div 
                                key={ev.id}
                                className={`text-[10px] p-1.5 rounded border truncate group/event relative ${getEventTypeStyles(ev.type)}`}
                                title={`${ev.time ? ev.time + ' - ' : ''}${ev.title}`}
                            >
                                <div className="flex items-center gap-1">
                                    {ev.time && <span className="opacity-70 font-mono">{ev.time}</span>}
                                    <span className="font-semibold truncate">{ev.title}</span>
                                </div>
                                
                                <button 
                                    onClick={(e) => deleteEvent(ev.id, e)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover/event:block bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return slots;
    };

    return (
        <div className="h-full flex flex-col text-white overflow-hidden">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-neutral-900 p-4 rounded-2xl border border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-2">
                        <select 
                            value={month} 
                            onChange={handleMonthChange}
                            className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-lg font-bold outline-none focus:border-white"
                        >
                            {MONTH_NAMES.map((m, idx) => (
                                <option key={idx} value={idx}>{m}</option>
                            ))}
                        </select>
                        <select 
                            value={year} 
                            onChange={handleYearChange}
                            className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-lg font-bold outline-none focus:border-white"
                        >
                            {Array.from({length: 10}, (_, i) => year - 5 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="flex gap-2 text-sm flex-wrap justify-center">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Grabación
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Reunión
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Estreno
                    </div>
                </div>
            </div>

            {/* Calendar Grid Container with Scroll */}
            <div className="flex-1 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
                {/* Fixed Days Header */}
                <div className="grid grid-cols-7 bg-black/40 border-b border-white/10 shrink-0 z-10">
                    {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <span className="hidden md:inline">{day}</span>
                            <span className="md:hidden">{day.substring(0, 3)}</span>
                        </div>
                    ))}
                </div>
                
                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-7 auto-rows-fr">
                        {renderCells()}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 w-full max-w-md rounded-2xl border border-white/20 shadow-2xl p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Plus className="text-blue-500" /> Nueva Cita
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                    <CalendarIcon size={14}/> Fecha
                                </label>
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <Clock size={14}/> Hora
                                    </label>
                                    <input 
                                        type="time" 
                                        value={newEventTime}
                                        onChange={(e) => setNewEventTime(e.target.value)}
                                        className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                                    <select 
                                        value={newEventType}
                                        onChange={(e) => setNewEventType(e.target.value as any)}
                                        className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                    >
                                        <option value="meeting">Reunión</option>
                                        <option value="recording">Grabación</option>
                                        <option value="release">Estreno</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Título *</label>
                                <input 
                                    type="text" 
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    placeholder="Ej. Grabar Intro Ep 45..."
                                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                                    <AlignLeft size={14}/> Descripción (Opcional)
                                </label>
                                <textarea 
                                    value={newEventDesc}
                                    onChange={(e) => setNewEventDesc(e.target.value)}
                                    placeholder="Detalles adicionales..."
                                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 min-h-[80px]"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleAddEvent}
                                    disabled={!newEventTitle.trim()}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                                        !newEventTitle.trim() 
                                        ? 'bg-neutral-800 text-gray-500 cursor-not-allowed' 
                                        : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                                >
                                    Guardar Evento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;