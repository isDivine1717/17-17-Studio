import React, { useState } from 'react';
import { Download, CheckCircle, Share2 } from 'lucide-react';

const ExportView: React.FC = () => {
    const [exporting, setExporting] = useState(false);
    const [done, setDone] = useState(false);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
            setDone(true);
        }, 3000);
    };

    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Exportar Paquete de Episodio</h2>
            <p className="text-gray-400 mb-12">
                Empaqueta el guion, las imágenes y el calendario en un archivo listo para distribuir al equipo.
            </p>

            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 mb-8">
                <div className="space-y-4 text-left mb-8">
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-green-500"/> <span>Guion en PDF (Markdown)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-green-500"/> <span>3 Miniaturas (PNG)</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-green-500"/> <span>Evento de Calendario (.ics)</span>
                    </div>
                </div>

                {!done ? (
                    <button 
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                    >
                        {exporting ? (
                            <span>Comprimiendo archivos...</span>
                        ) : (
                            <>
                                <Download size={20} />
                                <span>Descargar ZIP</span>
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30">
                            ¡Paquete listo y descargado!
                        </div>
                        <button 
                             onClick={() => setDone(false)}
                             className="text-sm text-gray-500 hover:text-white underline"
                        >
                            Exportar otro
                        </button>
                    </div>
                )}
            </div>

             <div className="flex justify-center space-x-4">
                 <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 size={16} /> <span>Copiar Link de Preview</span>
                 </button>
             </div>
        </div>
    );
};

export default ExportView;