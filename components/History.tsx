import React, { useEffect, useState } from 'react';
import { supabase, getUserHistory } from '../services/supabase';
import { GenerationHistoryItem } from '../types';

interface HistoryProps {
    onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ onClose }) => {
    const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getUserHistory(user.id);
                setHistory(data);
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const handleDownload = async (imageUrl: string, prompt: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Carregando histórico...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900 text-white overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Histórico de Criações
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {history.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>Nenhuma imagem gerada ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                        <div key={item.id} className="group relative bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-all shadow-lg hover:shadow-purple-500/10">
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={item.image_path}
                                    alt={item.prompt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDownload(item.image_path, item.prompt || 'image')}
                                        className="bg-white text-black p-3 rounded-full hover:bg-purple-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                                        title="Download"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-300 line-clamp-2" title={item.prompt}>
                                    {item.prompt || 'Sem prompt'}
                                </p>
                                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    <span className="bg-zinc-700 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                        {item.options?.mode || 'Image'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
