
import React, { useState, useEffect } from 'react';
import { Mode, CreateFunction, EditFunction, ImageData, AspectRatio } from '../types';
import * as Icons from './icons';
import WatermarkRemover from './WatermarkRemover';

interface FunctionCardProps {
  id: string;
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick: () => void;
  requiresTwo?: boolean;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ id, icon, name, isActive, onClick, requiresTwo = false }) => (
  <div
    data-function={id}
    data-requires-two={requiresTwo}
    className={`function-card p-3 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 ${isActive ? 'bg-lime-400/20 border-lime-400 text-lime-300' : 'bg-zinc-800 border-zinc-700 hover:border-lime-500/50 hover:bg-zinc-700'
      }`}
    onClick={onClick}
  >
    <div className="icon flex items-center justify-center mb-1.5 opacity-90">{icon}</div>
    <div className="name text-sm font-medium">{name}</div>
  </div>
);

interface ImageUploadProps {
  id: string;
  image: ImageData | null;
  setImage: (data: ImageData | null) => void;
  label: string;
  subtext: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ id, image, setImage, label, subtext, className }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImage({ file, previewUrl });
    }
  };

  return (
    <div
      className={`relative upload-area-dual border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center cursor-pointer hover:border-lime-400 transition-colors bg-zinc-800/50 flex flex-col justify-center ${className || 'h-28'}`}
      onClick={() => document.getElementById(id)?.click()}
    >
      <input type="file" id={id} accept="image/png, image/jpeg, image/webp, image/heic" className="hidden" onChange={handleFileChange} />
      {image ? (
        <img src={image.previewUrl} alt="Preview" id={`${id}-preview`} className="image-preview absolute inset-0 w-full h-full object-cover rounded-lg" />
      ) : (
        <>
          <Icons.UploadIcon className={`mx-auto mb-2 ${className?.includes('h-20') ? 'w-5 h-5' : ''}`} />
          <p className="font-semibold text-gray-300 text-sm">{label}</p>
          <p className="upload-text text-xs text-gray-500">{subtext}</p>
        </>
      )}
    </div>
  );
};

const AspectRatioSelector: React.FC<{
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  title?: string;
  allowedRatios?: AspectRatio[];
}> = ({ aspectRatio, setAspectRatio, title = "Proporção", allowedRatios = ['1:1', '16:9', '9:16', '4:5'] }) => (
  <div className="aspect-ratio-selector mt-4">
    <div className="section-title mb-2 font-semibold text-gray-300 text-sm">{title}</div>
    <div className={`grid grid-cols-4 gap-2`}>
      {allowedRatios.includes('1:1') && (
        <button
          className={`aspect-ratio-btn flex flex-col items-center p-2 rounded-md border-2 transition-colors ${aspectRatio === '1:1' ? 'border-lime-400 bg-lime-400/20' : 'border-zinc-700 bg-zinc-800 hover:border-lime-500/50'}`}
          onClick={() => setAspectRatio('1:1')}>
          <Icons.AspectRatioSquareIcon className="w-5 h-5 mb-1" />
          <span className="text-xs">1:1</span>
        </button>
      )}
      {allowedRatios.includes('16:9') && (
        <button
          className={`aspect-ratio-btn flex flex-col items-center p-2 rounded-md border-2 transition-colors ${aspectRatio === '16:9' ? 'border-lime-400 bg-lime-400/20' : 'border-zinc-700 bg-zinc-800 hover:border-lime-500/50'}`}
          onClick={() => setAspectRatio('16:9')}>
          <Icons.AspectRatioLandscapeIcon className="w-5 h-5 mb-1" />
          <span className="text-xs">16:9</span>
        </button>
      )}
      {allowedRatios.includes('9:16') && (
        <button
          className={`aspect-ratio-btn flex flex-col items-center p-2 rounded-md border-2 transition-colors ${aspectRatio === '9:16' ? 'border-lime-400 bg-lime-400/20' : 'border-zinc-700 bg-zinc-800 hover:border-lime-500/50'}`}
          onClick={() => setAspectRatio('9:16')}>
          <Icons.AspectRatioPortraitIcon className="w-5 h-5 mb-1" />
          <span className="text-xs">9:16</span>
        </button>
      )}
      {allowedRatios.includes('4:5') && (
        <button
          className={`aspect-ratio-btn flex flex-col items-center p-2 rounded-md border-2 transition-colors ${aspectRatio === '4:5' ? 'border-lime-400 bg-lime-400/20' : 'border-zinc-700 bg-zinc-800 hover:border-lime-500/50'}`}
          onClick={() => setAspectRatio('4:5')}>
          <Icons.AspectRatioPortraitIcon className="w-5 h-5 mb-1" />
          <span className="text-xs">4:5</span>
        </button>
      )}
    </div>
  </div>
);

const CharacterStyleSelector: React.FC<{
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
}> = ({ selectedStyle, setSelectedStyle }) => {
  const styles = ['Moderno 3D', 'Anime', 'Clássico'];
  return (
    <div className="character-style-selector mt-4">
      <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Estilo do Personagem</div>
      <div className="grid grid-cols-3 gap-2">
        {styles.map(style => (
          <button
            key={style}
            className={`style-btn p-2 rounded-md border-2 text-center text-sm transition-colors ${selectedStyle === style ? 'border-lime-400 bg-lime-400/20 text-lime-300' : 'border-zinc-700 bg-zinc-800 hover:border-lime-500/50'
              }`}
            onClick={() => setSelectedStyle(style)}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

interface PaletteSelectorProps {
  palette: string;
  setPalette: (p: string) => void;
}

const PaletteSelector: React.FC<PaletteSelectorProps> = ({ palette, setPalette }) => {
  const palettes = [
    { name: 'Modern Tech', colors: ['#0f172a', '#3b82f6', '#8b5cf6'] },
    { name: 'Elegant Gold', colors: ['#000000', '#fbbf24', '#ffffff'] },
    { name: 'Vibrant Pop', colors: ['#ec4899', '#facc15', '#22d3ee'] },
    { name: 'Nature Fresh', colors: ['#3f6212', '#a3e635', '#fefce8'] },
    { name: 'Corporate', colors: ['#1e3a8a', '#94a3b8', '#ffffff'] },
    { name: 'Bold Tricolor', colors: ['#1f4396', '#ea1f27', '#ffffff'] }
  ];

  return (
    <div className="mt-4">
      <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Paleta de Cores</div>
      <div className="flex flex-wrap gap-2">
        {palettes.map((p) => (
          <button
            key={p.name}
            onClick={() => setPalette(p.name)}
            className={`group relative p-1 rounded-lg border-2 transition-all ${palette === p.name ? 'border-lime-400 bg-zinc-800' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'}`}
            title={p.name}
          >
            <div className="flex space-x-1">
              {p.colors.map(c => (
                <div key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface LeftPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  createFunction: CreateFunction;
  setCreateFunction: (f: CreateFunction) => void;
  editFunction: EditFunction;
  setEditFunction: (f: EditFunction) => void;
  image1: ImageData | null;
  setImage1: (i: ImageData | null) => void;
  image2: ImageData | null;
  setImage2: (i: ImageData | null) => void;
  image3: ImageData | null;
  setImage3: (i: ImageData | null) => void;
  image4: ImageData | null;
  setImage4: (i: ImageData | null) => void;
  mask: File | null;
  setMask: (f: File | null) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  characterStyle: string;
  setCharacterStyle: (s: string) => void;

  headline: string;
  setHeadline: (s: string) => void;
  palette: string;
  setPalette: (s: string) => void;
  useGradient: boolean;
  setUseGradient: (b: boolean) => void;

  isLoading: boolean;
  onGenerate: () => void;
  isApiKeySelected: boolean;
  setIsApiKeySelected: (s: boolean) => void;
  enhancePromptApi: (prompt: string) => Promise<string>;
  onLogout: () => void;
  onShowHistory: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  prompt, setPrompt, mode, setMode, createFunction, setCreateFunction,
  editFunction, setEditFunction, image1, setImage1, image2, setImage2, image3, setImage3, image4, setImage4,
  mask, setMask, aspectRatio, setAspectRatio, characterStyle, setCharacterStyle,
  headline, setHeadline, palette, setPalette, useGradient, setUseGradient,
  isLoading, onGenerate, isApiKeySelected, setIsApiKeySelected, enhancePromptApi, onLogout, onShowHistory
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (mode === 'create' && createFunction === 'start-end-video') {
      if (aspectRatio === '1:1') {
        setAspectRatio('16:9');
      }
    } else if (mode === 'create' && createFunction === 'instagram') {
      if (aspectRatio === '16:9') {
        setAspectRatio('4:5'); // Default helpful aspect ratio for IG
      }
    } else if (mode === 'create' && createFunction === 'fitting-room') {
      setAspectRatio('9:16'); // Default for Fitting Room
    }
  }, [mode, createFunction, aspectRatio, setAspectRatio]);

  useEffect(() => {
    // When switching edit function away from watermark remover, clear the mask.
    if (editFunction !== 'remove-watermark' && mask) {
      setMask(null);
    }
  }, [editFunction, mask, setMask]);


  const showSingleUpload = mode === 'edit' && editFunction !== 'compose';
  const showDualUpload = mode === 'edit' && editFunction === 'compose';
  const showVideoFramesUpload = mode === 'create' && createFunction === 'start-end-video';
  const showCharacterCreator = mode === 'create' && createFunction === 'character';
  const showInstagramCreator = mode === 'create' && createFunction === 'instagram';
  const showFittingRoom = mode === 'create' && createFunction === 'fitting-room';

  const isGenerateDisabled =
    isLoading ||
    !isApiKeySelected ||
    (mode === 'create' && !['start-end-video', 'character', 'instagram', 'fitting-room'].includes(createFunction) && !prompt) ||
    (mode === 'create' && createFunction === 'character' && !image1) ||
    (mode === 'create' && createFunction === 'start-end-video' && (!image1 || !image2)) ||
    (mode === 'create' && createFunction === 'instagram' && (!prompt || !headline)) ||
    (mode === 'create' && createFunction === 'fitting-room' && (!image1 || !image2 || !image3 || !image4)) ||
    (mode === 'edit' && editFunction !== 'compose' && editFunction !== 'remove-watermark' && !image1) ||
    (mode === 'edit' && editFunction === 'remove-watermark' && (!image1 || !mask)) ||
    (mode === 'edit' && editFunction === 'compose' && (!image1 || !image2));

  const placeholderText = createFunction === 'thumbnail'
    ? "Título: A História da IA. Detalhes: um vídeo sobre a evolução da inteligência artificial..."
    : "Ex: Um mestre da IA demitindo 30 empregados...";

  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePromptApi(prompt);
      setPrompt(enhanced);
    } catch (e) {
      console.error("Failed to enhance prompt", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true); // Assume success to avoid race condition
    }
  };

  return (
    <>
      <div className="left-panel w-full lg:w-[400px] flex-shrink-0 bg-zinc-900/70 border-r border-zinc-800 p-6 flex flex-col space-y-5 h-full overflow-y-auto">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="panel-title text-2xl font-bold text-lime-400">Ai Image Studio</h1>
            <p className="panel-subtitle text-sm text-gray-400">Gerador profissional de imagens e vídeos</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShowHistory}
              className="text-gray-500 hover:text-lime-400 transition-colors text-xs border border-zinc-700 rounded px-2 py-1 flex items-center gap-1"
              title="Histórico"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
            </button>
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-400 transition-colors text-xs border border-zinc-700 rounded px-2 py-1"
              title="Sair"
            >
              Sair
            </button>
          </div>
        </header>

        {((mode === 'create' && !['start-end-video', 'character', 'instagram', 'fitting-room'].includes(createFunction)) || (mode === 'edit' && editFunction !== 'remove-watermark')) ? (
          <div className="prompt-section">
            <div className="section-title mb-2 font-semibold text-gray-300">Qual a sua ideia:</div>
            <textarea
              id="prompt"
              className="prompt-input w-full p-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
              placeholder={placeholderText}
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        ) : null}

        <div className="mode-toggle grid grid-cols-2 gap-2 p-1 bg-zinc-800 rounded-lg">
          <button
            className={`mode-btn p-2 rounded-md font-bold transition-colors uppercase text-sm ${mode === 'create' ? 'bg-lime-400 text-zinc-900' : 'hover:bg-zinc-700'}`}
            data-mode="create"
            onClick={() => setMode('create')}
          >
            CRIAR
          </button>
          <button
            className={`mode-btn p-2 rounded-md font-bold transition-colors uppercase text-sm ${mode === 'edit' ? 'bg-lime-400 text-zinc-900' : 'hover:bg-zinc-700'}`}
            data-mode="edit"
            onClick={() => setMode('edit')}
          >
            EDITAR
          </button>
        </div>

        {mode === 'create' && (
          <div id="createFunctions" className="functions-section">
            <div className="functions-grid grid grid-cols-3 gap-3">
              <FunctionCard id="free" icon={<Icons.PromptIcon />} name="Prompt" isActive={createFunction === 'free'} onClick={() => setCreateFunction('free')} />
              <FunctionCard id="instagram" icon={<Icons.InstagramIcon />} name="Instagram" isActive={createFunction === 'instagram'} onClick={() => setCreateFunction('instagram')} />
              <FunctionCard id="fitting-room" icon={<Icons.HangerIcon />} name="Provador" isActive={createFunction === 'fitting-room'} onClick={() => setCreateFunction('fitting-room')} />
              <FunctionCard id="sticker" icon={<Icons.StickerIcon />} name="Figura" isActive={createFunction === 'sticker'} onClick={() => setCreateFunction('sticker')} />
              <FunctionCard id="text" icon={<Icons.LogoIcon />} name="Logo" isActive={createFunction === 'text'} onClick={() => setCreateFunction('text')} />
              <FunctionCard id="comic" icon={<Icons.ComicIcon />} name="Desenho" isActive={createFunction === 'comic'} onClick={() => setCreateFunction('comic')} />
              <FunctionCard id="thumbnail" icon={<Icons.ThumbnailIcon />} name="Thumbnail" isActive={createFunction === 'thumbnail'} onClick={() => setCreateFunction('thumbnail')} />
              <FunctionCard id="character" icon={<Icons.CharacterIcon />} name="Personagem" isActive={createFunction === 'character'} onClick={() => setCreateFunction('character')} />
              <FunctionCard id="start-end-video" icon={<Icons.VideoIcon />} name="Vídeo" isActive={createFunction === 'start-end-video'} onClick={() => setCreateFunction('start-end-video')} />
            </div>
            {createFunction === 'free' && (
              <>
                <div className="mt-4">
                  <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Imagem de Referência (Opcional)</div>
                  <ImageUpload id="free-upload" image={image1} setImage={setImage1} label="Carregar Imagem" subtext="Use como inspiração" className="h-32" />
                </div>
                <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
              </>
            )}
            {createFunction !== 'free' && createFunction !== 'start-end-video' && createFunction !== 'character' && createFunction !== 'instagram' && createFunction !== 'fitting-room' && (
              <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
            )}
          </div>
        )}

        {showFittingRoom && (
          <div className="flex flex-col space-y-4">
            <div className="text-sm text-gray-400 p-2 bg-zinc-800 rounded border border-zinc-700">
              <p className="font-semibold text-lime-400">Provador Virtual</p>
              <p>Faça upload da pessoa e de 3 peças de roupa para montar o look.</p>
            </div>

            <div className="section-title font-semibold text-gray-300 text-sm">1. O Modelo (Pessoa)</div>
            <ImageUpload id="fitting-model" image={image1} setImage={setImage1} label="Foto da Pessoa" subtext="Corpo inteiro ou meio corpo" />

            <div className="section-title font-semibold text-gray-300 text-sm mt-2">2. As Roupas</div>
            <div className="grid grid-cols-3 gap-2">
              <ImageUpload id="fitting-cloth-1" image={image2} setImage={setImage2} label="Roupa 1" subtext="Peça Sup." className="h-24 text-[10px]" />
              <ImageUpload id="fitting-cloth-2" image={image3} setImage={setImage3} label="Roupa 2" subtext="Peça Inf." className="h-24 text-[10px]" />
              <ImageUpload id="fitting-cloth-3" image={image4} setImage={setImage4} label="Roupa 3" subtext="Acessório/Outro" className="h-24 text-[10px]" />
            </div>

            <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} title="Formato (Sugerido 9:16)" allowedRatios={['9:16', '16:9', '1:1', '4:5']} />
          </div>
        )}

        {showInstagramCreator && (
          <div className="flex flex-col space-y-4">
            <div className="prompt-section">
              <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Headline (Título)</div>
              <textarea
                className="w-full p-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                placeholder="Ex: NOVIDADE EXCLUSIVA!"
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="prompt-section">
              <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Descrição do Post</div>
              <textarea
                className="w-full p-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                placeholder="Ex: Um lançamento de produto tecnológico, minimalista..."
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ImageUpload id="ig-upload-1" image={image1} setImage={setImage1} label="Contexto 1" subtext="(Opcional)" />
              <ImageUpload id="ig-upload-2" image={image2} setImage={setImage2} label="Contexto 2" subtext="(Opcional)" />
            </div>

            <PaletteSelector palette={palette} setPalette={setPalette} />

            <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <input
                type="checkbox"
                id="gradient-check"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
                className="w-5 h-5 accent-lime-500 rounded cursor-pointer"
              />
              <label htmlFor="gradient-check" className="text-sm font-medium text-gray-300 cursor-pointer select-none">Adicionar Camada Gradiente</label>
            </div>

            <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} allowedRatios={['1:1', '4:5', '16:9', '9:16']} />
          </div>
        )}

        {showCharacterCreator && (
          <div id="characterCreatorSection" className="functions-section flex flex-col space-y-3">
            <div className="font-semibold text-gray-300">Criador de Personagem 3D</div>
            <div id="uploadAreaCharacter" className="upload-area border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:border-lime-400 transition-colors bg-zinc-800/50 relative h-48 flex flex-col justify-center" onClick={() => document.getElementById('imageUploadCharacter')?.click()}>
              <input type="file" id="imageUploadCharacter" accept="image/png, image/jpeg, image/webp, image/heic" className="hidden" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const previewUrl = URL.createObjectURL(file);
                  setImage1({ file, previewUrl });
                }
              }} />
              {image1 ? (
                <img src={image1.previewUrl} alt="Preview" id="imagePreviewCharacter" className="image-preview absolute inset-0 w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Icons.UploadIcon className="mx-auto mb-2" />
                  <p className="font-semibold text-gray-300">Carregar Imagem</p>
                  <p className="upload-text text-xs text-gray-500">Faça upload de uma foto de rosto ou corpo inteiro</p>
                </>
              )}
            </div>
            <CharacterStyleSelector selectedStyle={characterStyle} setSelectedStyle={setCharacterStyle} />
            <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
            <div>
              <div className="section-title mb-2 font-semibold text-gray-300 text-sm">Detalhes (Opcional)</div>
              <textarea
                className="prompt-input w-full p-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                placeholder="Ex: com armadura dourada, cabelo azul..."
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div id="editFunctions" className="functions-section flex flex-col space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <FunctionCard id="add-remove" icon={<Icons.AddRemoveIcon />} name="Adicionar/Remover" isActive={editFunction === 'add-remove'} onClick={() => setEditFunction('add-remove')} />
              <FunctionCard id="retouch" icon={<Icons.RetouchIcon />} name="Retocar" isActive={editFunction === 'retouch'} onClick={() => setEditFunction('retouch')} />
              <FunctionCard id="style" icon={<Icons.StyleIcon />} name="Estilo" isActive={editFunction === 'style'} onClick={() => setEditFunction('style')} />
              <FunctionCard id="compose" icon={<Icons.ComposeIcon />} name="Compor" isActive={editFunction === 'compose'} onClick={() => setEditFunction('compose')} />
              <FunctionCard id="remove-background" icon={<Icons.RemoveBgIcon />} name="Remover Fundo" isActive={editFunction === 'remove-background'} onClick={() => setEditFunction('remove-background')} />
              <FunctionCard id="remove-watermark" icon={<Icons.WatermarkIcon />} name="Marca D'água" isActive={editFunction === 'remove-watermark'} onClick={() => setIsWatermarkModalOpen(true)} />
            </div>
          </div>
        )}

        {showSingleUpload && (
          <div id="uploadArea" className="upload-area border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center cursor-pointer hover:border-lime-400 transition-colors bg-zinc-800/50 relative h-48 flex flex-col justify-center" onClick={() => document.getElementById('imageUpload1')?.click()}>
            <input type="file" id="imageUpload1" accept="image/png, image/jpeg, image/webp, image/heic" className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const previewUrl = URL.createObjectURL(file);
                setImage1({ file, previewUrl });
              }
            }} />
            {image1 ? (
              <img src={image1.previewUrl} alt="Preview" id="imagePreview1" className="image-preview absolute inset-0 w-full h-full object-cover rounded-lg" />
            ) : (
              <>
                <Icons.UploadIcon className="mx-auto mb-2" />
                <p className="font-semibold text-gray-300">Carregar Imagem</p>
                <p className="upload-text text-xs text-gray-500">Faça upload da imagem que deseja editar</p>
              </>
            )}
          </div>
        )}

        {showDualUpload && (
          <div id="uploadAreaDual" className="grid grid-cols-2 gap-3">
            <ImageUpload id="imageUploadCompose1" image={image1} setImage={setImage1} label="Imagem 1" subtext="Base" />
            <ImageUpload id="imageUploadCompose2" image={image2} setImage={setImage2} label="Imagem 2" subtext="Elemento" />
          </div>
        )}

        {showDualUpload && <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />}

        {showVideoFramesUpload && (
          <div className="flex flex-col space-y-3">
            <ImageUpload id="videoStartFrame" image={image1} setImage={setImage1} label="Frame Inicial" subtext="Início do vídeo" />
            <ImageUpload id="videoEndFrame" image={image2} setImage={setImage2} label="Frame Final" subtext="Fim do vídeo" />
            <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} title="Proporção do Vídeo" allowedRatios={['16:9', '9:16']} />
            <div className="prompt-section">
              <div className="section-title mb-2 font-semibold text-gray-300 text-sm">O que acontece no vídeo? (Opcional)</div>
              <div className="relative">
                <textarea
                  id="video-prompt"
                  className="prompt-input w-full p-3 pr-10 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                  placeholder="Ex: Um carro futurista voando por uma cidade cyberpunk..."
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-700 rounded-full hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Melhorar prompt"
                >
                  {isEnhancing ?
                    <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div> :
                    <Icons.MagicWandIcon className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {!isApiKeySelected && (
          <div className="api-key-prompt bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-lg text-sm">
            <p>O uso dos modelos Pro requer uma chave de API.</p>
            <button onClick={handleSelectKey} className="mt-2 w-full bg-yellow-500 text-yellow-900 font-bold py-1.5 rounded hover:bg-yellow-600">
              Selecionar Chave de API
            </button>
            <p className="mt-1 text-xs text-center">Saiba mais sobre <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">cobrança</a>.</p>
          </div>
        )}

        <div className="generate-section mt-auto pt-4">
          <button
            id="generate-btn"
            className="generate-btn w-full p-4 bg-lime-500 text-zinc-900 rounded-lg font-bold text-lg hover:bg-lime-600 transition-colors disabled:bg-zinc-600 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={onGenerate}
            disabled={isGenerateDisabled}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-zinc-800 border-t-zinc-300 rounded-full animate-spin"></div>
            ) : "GERAR"}
          </button>
        </div>
      </div>
      {isWatermarkModalOpen && image1 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[90vh] max-h-[800px] bg-zinc-950 rounded-lg shadow-2xl">
            <WatermarkRemover
              image={image1}
              onMaskChange={setMask}
              onDone={() => setIsWatermarkModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LeftPanel;
