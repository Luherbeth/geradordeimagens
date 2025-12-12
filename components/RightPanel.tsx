import React, { useState, useEffect } from 'react';
import * as Icons from './icons';
import { ImageData, GeneratedMedia } from '../types';
import ImageCompare from './ImageCompare';

interface RightPanelProps {
  isLoading: boolean;
  generatedMedia: GeneratedMedia | null;
  error: string | null;
  originalImage: ImageData | null;
  editCurrentImage: () => void;
  resetStateForNewImage: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, generatedMedia, error, originalImage, editCurrentImage, resetStateForNewImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (generatedMedia) {
      setIsComparing(false);
    }
  }, [generatedMedia]);

  const downloadMedia = () => {
    if (!generatedMedia) return;

    const link = document.createElement('a');
    link.href = generatedMedia.url;
    link.download = generatedMedia.type === 'image' ? 'generated-image.png' : 'generated-video.mp4';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const showMedia = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsModalOpen(true);
    }
  };

  const editFromModal = () => {
    setIsModalOpen(false);
    editCurrentImage();
  };
  
  const newImageFromModal = () => {
      setIsModalOpen(false);
      resetStateForNewImage();
  }
  
  const downloadFromModal = () => {
      downloadMedia();
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div id="loadingContainer" className="loading-container text-center">
          <div className="loading-spinner w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="loading-text mt-4 text-gray-300">Gerando sua arte...</div>
        </div>
      );
    }

    if (error) {
        return (
            <div className="result-placeholder text-center text-red-400 max-w-md">
                <Icons.ErrorIcon className="mx-auto" />
                <div className="mt-4">
                    <p className="font-semibold">Ocorreu um erro</p>
                    <p className="text-sm text-red-300/80">{error}</p>
                </div>
            </div>
        );
    }

    if (generatedMedia) {
      const wasEdit = !!originalImage && generatedMedia.type === 'image';
      return (
        <div id="mediaContainer" className="image-container w-full h-full flex flex-col items-center justify-center gap-6">
          <div className="w-full flex-grow flex items-center justify-center min-h-0">
            {generatedMedia.type === 'video' ? (
              <video
                src={generatedMedia.url}
                controls
                autoPlay
                loop
                className="max-w-full max-h-full object-contain"
              />
            ) : isComparing && wasEdit ? (
                <ImageCompare beforeSrc={originalImage!.previewUrl} afterSrc={generatedMedia.url} />
            ) : (
                <img
                  id="generatedImage"
                  src={generatedMedia.url}
                  alt="Generated artwork"
                  className="generated-image max-w-full max-h-full object-contain cursor-pointer"
                  onClick={showMedia}
                />
            )}
          </div>
          <div className="image-actions flex items-center space-x-4 flex-shrink-0">
             {generatedMedia.type === 'image' && (
                <button className="action-btn flex items-center justify-center gap-2 py-2 px-5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors text-sm font-semibold" onClick={editCurrentImage}>
                  <Icons.RetouchIcon className="w-4 h-4" />
                  Editar
                </button>
             )}
            {wasEdit && (
                <button 
                    className="action-btn flex items-center justify-center gap-2 py-2 px-5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors text-sm font-semibold" 
                    onClick={() => setIsComparing(!isComparing)}>
                    <Icons.ViewIcon className="w-4 h-4" />
                    {isComparing ? 'Ver Resultado' : 'Comparar'}
                </button>
            )}
            <button className="action-btn flex items-center justify-center gap-2 py-2 px-5 bg-lime-500 text-zinc-900 font-bold rounded-lg hover:bg-lime-600 transition-colors text-sm" onClick={downloadMedia}>
                <Icons.DownloadIcon className="w-4 h-4" />
                Salvar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div id="resultPlaceholder" className="result-placeholder text-center text-gray-500">
        <div className="result-placeholder-icon">
          <Icons.ImageIcon className="mx-auto" />
        </div>
        <div className="mt-4">Sua obra de arte aparecerá aqui</div>
      </div>
    );
  };

  return (
    <>
        <div className="right-panel flex-grow bg-zinc-950 flex items-center justify-center p-4 md:p-8">
            {renderContent()}
        </div>
        {isModalOpen && generatedMedia && (
            <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black/90 z-50 flex flex-col p-4">
                <div className="modal-content flex-grow flex items-center justify-center min-h-0">
                   {generatedMedia.type === 'video' ? (
                       <video src={generatedMedia.url} controls autoPlay loop className="max-w-full max-h-full object-contain" />
                   ) : (
                       <img id="modalImage" src={generatedMedia.url} alt="Generated artwork" className="modal-image max-w-full max-h-full object-contain"/>
                   )}
                </div>
                <div className={`modal-actions grid ${generatedMedia.type === 'image' ? 'grid-cols-3' : 'grid-cols-2'} gap-3 pt-4`}>
                    {generatedMedia.type === 'image' && (
                        <button className="modal-btn edit flex items-center justify-center gap-2 p-3 bg-zinc-700 rounded-lg" onClick={editFromModal}><Icons.RetouchIcon /> Editar</button>
                    )}
                    <button className="modal-btn download flex items-center justify-center gap-2 p-3 bg-zinc-700 rounded-lg" onClick={downloadFromModal}><Icons.DownloadIcon /> Salvar</button>
                    <button className="modal-btn new flex items-center justify-center gap-2 p-3 bg-lime-500 text-zinc-900 font-bold rounded-lg" onClick={newImageFromModal}>Nova Mídia</button>
                </div>
            </div>
        )}
    </>
  );
};

export default RightPanel;
