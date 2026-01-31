import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { 
  Plus, Trash2, Search, FileText, 
  Bold, Italic, Underline, 
  List, ListOrdered, 
  Type, Palette, Highlighter,
  Heading1, Heading2, Heading3,
  AlignLeft, ChevronDown
} from 'lucide-react';

const NotesView: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [notes, setNotes] = useState<Note[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('1717_notes');
            if (saved) return JSON.parse(saved);
        }
        return [
            { 
                id: '1', 
                title: 'Bienvenido a Notas 17-17', 
                content: '<b>Aquí puedes escribir con estilo.</b><br><br>Prueba las herramientas de arriba para:<br><ul><li>Cambiar colores</li><li>Usar negritas</li><li>Crear listas</li></ul>', 
                updatedAt: Date.now() 
            }
        ];
    });

    const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // UI States for Toolbar
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showTypePicker, setShowTypePicker] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const activeNote = notes.find(n => n.id === activeNoteId);

    // --- EFFECTS ---

    useEffect(() => {
        localStorage.setItem('1717_notes', JSON.stringify(notes));
    }, [notes]);

    // Update editor content when switching notes
    useEffect(() => {
        if (editorRef.current && activeNote) {
            // Only update if innerHTML is different to prevent cursor jumps if we were typing (though switching notes usually blurs)
            if (editorRef.current.innerHTML !== activeNote.content) {
                editorRef.current.innerHTML = activeNote.content;
            }
        } else if (editorRef.current && !activeNote) {
            editorRef.current.innerHTML = '';
        }
    }, [activeNoteId]); // Depend only on ID change for full replace

    // --- HANDLERS ---

    const handleCreateNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: '',
            content: '',
            updatedAt: Date.now()
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (activeNoteId === id) {
            setActiveNoteId(newNotes[0]?.id || null);
        }
    };

    const handleUpdateTitle = (value: string) => {
        if (!activeNote) return;
        const updatedNotes = notes.map(note => 
            note.id === activeNoteId ? { ...note, title: value, updatedAt: Date.now() } : note
        );
        setNotes(updatedNotes);
    };

    const handleContentChange = () => {
        if (!activeNote || !editorRef.current) return;
        const content = editorRef.current.innerHTML;
        
        // We update the state, but we don't force re-render of the editor div innerHTML 
        // in the useEffect to avoid cursor jumping.
        const updatedNotes = notes.map(note => 
            note.id === activeNoteId ? { ...note, content, updatedAt: Date.now() } : note
        );
        setNotes(updatedNotes);
    };

    // --- RICH TEXT COMMANDS ---

    const executeCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        handleContentChange(); // Save state immediately
        // Keep focus
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const NOTION_COLORS = [
        { color: '#ffffff', label: 'Default' },
        { color: '#9ca3af', label: 'Gray' },
        { color: '#f87171', label: 'Red' },
        { color: '#fb923c', label: 'Orange' },
        { color: '#facc15', label: 'Yellow' },
        { color: '#4ade80', label: 'Green' },
        { color: '#60a5fa', label: 'Blue' },
        { color: '#c084fc', label: 'Purple' },
        { color: '#f472b6', label: 'Pink' },
    ];

    const NOTION_HIGHLIGHTS = [
        { color: 'transparent', label: 'None' },
        { color: '#374151', label: 'Gray Bg' },
        { color: '#450a0a', label: 'Red Bg' },
        { color: '#451a03', label: 'Orange Bg' },
        { color: '#422006', label: 'Yellow Bg' },
        { color: '#052e16', label: 'Green Bg' },
        { color: '#172554', label: 'Blue Bg' },
        { color: '#2e1065', label: 'Purple Bg' },
    ];

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-6rem)] flex rounded-2xl border border-white/10 overflow-hidden bg-neutral-900">
            {/* Sidebar List */}
            <div className="w-1/3 md:w-1/4 border-r border-white/10 bg-black/40 flex flex-col">
                <div className="p-4 border-b border-white/10 space-y-3">
                    <button 
                        onClick={handleCreateNote}
                        className="w-full flex items-center justify-center space-x-2 bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Nueva Nota</span>
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-white/30 outline-none text-white"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredNotes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`
                                group p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 relative
                                ${activeNoteId === note.id ? 'bg-white/10 border-l-4 border-l-white' : 'border-l-4 border-l-transparent'}
                            `}
                        >
                            <h4 className={`font-semibold text-sm truncate mb-1 ${!note.title ? 'text-gray-500 italic' : 'text-gray-200'}`}>
                                {note.title || 'Sin título'}
                            </h4>
                            <div 
                                className="text-xs text-gray-500 truncate h-4 overflow-hidden opacity-70"
                                dangerouslySetInnerHTML={{ __html: note.content || 'Vacío...' }} 
                            />
                            <span className="text-[10px] text-gray-600 mt-2 block">
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </span>

                            <button 
                                onClick={(e) => handleDeleteNote(e, note.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-opacity bg-neutral-900 rounded-full"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-neutral-900 relative">
                {activeNote ? (
                    <>
                        {/* --- TOOLBAR --- */}
                        <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-neutral-900 sticky top-0 z-10">
                            {/* Typography / Size */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowTypePicker(!showTypePicker)}
                                    className="p-1.5 hover:bg-white/10 rounded text-gray-300 flex items-center gap-1 text-sm"
                                >
                                    <Type size={16} /> <ChevronDown size={12}/>
                                </button>
                                {showTypePicker && (
                                    <div className="absolute top-full left-0 mt-1 w-40 bg-neutral-800 border border-white/10 rounded-lg shadow-xl py-1 z-20 flex flex-col">
                                        <button onClick={() => { executeCommand('formatBlock', 'P'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 text-sm">Texto Normal</button>
                                        <button onClick={() => { executeCommand('formatBlock', 'H1'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 text-xl font-bold">Título 1</button>
                                        <button onClick={() => { executeCommand('formatBlock', 'H2'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 text-lg font-bold">Título 2</button>
                                        <button onClick={() => { executeCommand('formatBlock', 'H3'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 text-base font-bold">Título 3</button>
                                        <div className="h-px bg-white/10 my-1"></div>
                                        <button onClick={() => { executeCommand('fontName', 'Inter'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 font-sans text-sm">Sans Serif</button>
                                        <button onClick={() => { executeCommand('fontName', 'Georgia'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 font-serif text-sm">Serif</button>
                                        <button onClick={() => { executeCommand('fontName', 'Courier New'); setShowTypePicker(false); }} className="px-3 py-2 text-left hover:bg-white/10 font-mono text-sm">Mono</button>
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-6 bg-white/10 mx-1"></div>

                            {/* Basic Formatting */}
                            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Negrita">
                                <Bold size={16} />
                            </button>
                            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Cursiva">
                                <Italic size={16} />
                            </button>
                            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Subrayado">
                                <Underline size={16} />
                            </button>

                            <div className="w-px h-6 bg-white/10 mx-1"></div>

                            {/* Colors */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
                                    className="p-1.5 hover:bg-white/10 rounded text-gray-300 flex items-center gap-1"
                                    title="Color de Texto"
                                >
                                    <Palette size={16} />
                                </button>
                                {showColorPicker && (
                                    <div className="absolute top-full left-0 mt-1 w-32 bg-neutral-800 border border-white/10 rounded-lg shadow-xl p-2 z-20 grid grid-cols-4 gap-1">
                                        {NOTION_COLORS.map(c => (
                                            <button 
                                                key={c.color}
                                                onMouseDown={(e) => { e.preventDefault(); executeCommand('foreColor', c.color); setShowColorPicker(false); }}
                                                className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: c.color }}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button 
                                    onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
                                    className="p-1.5 hover:bg-white/10 rounded text-gray-300 flex items-center gap-1"
                                    title="Resaltar"
                                >
                                    <Highlighter size={16} />
                                </button>
                                {showHighlightPicker && (
                                    <div className="absolute top-full left-0 mt-1 w-32 bg-neutral-800 border border-white/10 rounded-lg shadow-xl p-2 z-20 grid grid-cols-4 gap-1">
                                        {NOTION_HIGHLIGHTS.map(c => (
                                            <button 
                                                key={c.color}
                                                onMouseDown={(e) => { e.preventDefault(); executeCommand('hiliteColor', c.color); setShowHighlightPicker(false); }}
                                                className="w-6 h-6 rounded border border-white/10 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: c.color }}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-px h-6 bg-white/10 mx-1"></div>

                            {/* Lists */}
                            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Lista con puntos">
                                <List size={16} />
                            </button>
                            <button onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }} className="p-1.5 hover:bg-white/10 rounded text-gray-300" title="Lista numérica">
                                <ListOrdered size={16} />
                            </button>
                        </div>

                        {/* --- NOTE HEADER --- */}
                        <div className="px-8 pt-8 pb-4">
                             <input 
                                type="text"
                                value={activeNote.title}
                                onChange={(e) => handleUpdateTitle(e.target.value)}
                                placeholder="Título de la nota..."
                                className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-600 outline-none"
                             />
                             <div className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
                                <FileText size={12} />
                                <span>Última edición: {new Date(activeNote.updatedAt).toLocaleString()}</span>
                             </div>
                        </div>

                        {/* --- RICH EDITOR BODY --- */}
                        <div className="flex-1 px-8 pb-8 overflow-y-auto cursor-text" onClick={() => editorRef.current?.focus()}>
                            <div 
                                ref={editorRef}
                                contentEditable
                                onInput={handleContentChange}
                                className="w-full min-h-[50vh] text-gray-300 text-lg leading-relaxed outline-none empty:before:content-[attr(placeholder)] empty:before:text-gray-600 prose prose-invert max-w-none"
                                placeholder="Escribe tus ideas, presiona '/' para... (broma, usa la barra de arriba)"
                                style={{ whiteSpace: 'pre-wrap' }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                        <FileText size={64} className="mb-4 opacity-20" />
                        <p className="text-xl">Selecciona una nota o crea una nueva</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesView;