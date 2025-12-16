
import React, { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import { Auth } from './components/Auth';
import { Mode, CreateFunction, EditFunction, ImageData, AspectRatio, GeneratedMedia } from './types';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { History } from './components/History';
import { generateMediaApi, enhancePromptApi } from './services/geminiService';

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  try {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("Error converting data URL to file:", error);
    return null;
  }
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<Mode>('create');
  const [createFunction, setCreateFunction] = useState<CreateFunction>('free');
  const [editFunction, setEditFunction] = useState<EditFunction>('add-remove');

  const [image1, setImage1] = useState<ImageData | null>(null);
  const [image2, setImage2] = useState<ImageData | null>(null);
  const [image3, setImage3] = useState<ImageData | null>(null);
  const [image4, setImage4] = useState<ImageData | null>(null);

  const [mask, setMask] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [characterStyle, setCharacterStyle] = useState<string>('Moderno 3D');

  // Instagram specific state
  const [headline, setHeadline] = useState<string>('');
  const [palette, setPalette] = useState<string>('Vibrant Pop');
  const [useGradient, setUseGradient] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [originalImageForCompare, setOriginalImageForCompare] = useState<ImageData | null>(null);

  const [activePanel, setActivePanel] = useState<'left' | 'right'>('left');

  // API Key state
  const [isApiKeySelected, setIsApiKeySelected] = useState(!!process.env.API_KEY);

  const checkApiKey = useCallback(async () => {
    if (process.env.API_KEY) {
      setIsApiKeySelected(true);
      return;
    }

    // @ts-ignore
    if (window.aistudio?.hasSelectedApiKey) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsApiKeySelected(hasKey);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  useEffect(() => {
    // Clean up blob URLs to prevent memory leaks
    return () => {
      if (generatedMedia?.url && generatedMedia.url.startsWith('blob:')) {
        URL.revokeObjectURL(generatedMedia.url);
      }
    };
  }, [generatedMedia]);


  const handleGenerate = useCallback(async () => {
    setActivePanel('right');
    setIsLoading(true);
    setError(null);
    setGeneratedMedia(null);

    // Set original image for comparison if in edit mode OR in fitting-room mode
    if ((mode === 'edit' && image1) || (mode === 'create' && createFunction === 'fitting-room' && image1)) {
      setOriginalImageForCompare(image1);
    } else {
      setOriginalImageForCompare(null);
    }

    const activeFunction = mode === 'create' ? createFunction : editFunction;

    try {
      const result = await generateMediaApi({
        prompt,
        mode,
        activeFunction,
        image1: image1?.file,
        image2: image2?.file,
        image3: image3?.file,
        image4: image4?.file,
        mask,
        aspectRatio,
        characterStyle,
        instagramOptions: activeFunction === 'instagram' ? {
          headline,
          palette,
          useGradient
        } : undefined
      });
      setGeneratedMedia(result);

      // Save to Supabase if session exists and it's an image
      if (session?.user && result.type === 'image') {
        // Convert data URL to Blob
        const res = await fetch(result.url);
        const blob = await res.blob();

        const publicUrl = await import('./services/supabase').then(mod => mod.uploadImage(blob, session.user.id));

        if (publicUrl) {
          await import('./services/supabase').then(mod => mod.saveGeneration(
            session.user.id,
            publicUrl,
            prompt,
            {
              mode,
              activeFunction,
              aspectRatio,
              characterStyle,
              timestamp: new Date().toISOString()
            }
          ));
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
        setError("Chave de API inválida ou não selecionada. Por favor, selecione uma chave válida.");
        setIsApiKeySelected(false);
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, createFunction, editFunction, image1, image2, image3, image4, mask, aspectRatio, characterStyle, headline, palette, useGradient, session]);

  const resetStateForNewImage = () => {
    setPrompt('');
    setGeneratedMedia(null);
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setMask(null);
    setError(null);
    setMode('create');
    setCreateFunction('free');
    setAspectRatio('1:1');
    setOriginalImageForCompare(null);
    setActivePanel('left');
    setCharacterStyle('Moderno 3D');
    setHeadline('');
  };

  const editCurrentImage = () => {
    if (generatedMedia && generatedMedia.type === 'image') {
      const imageToEditUrl = generatedMedia.url;
      const newImageFile = dataURLtoFile(imageToEditUrl, "generated-image.png");

      if (newImageFile) {
        setMode('edit');
        setEditFunction('retouch');
        setImage1({ file: newImageFile, previewUrl: imageToEditUrl });
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setMask(null);

        setGeneratedMedia(null);
        setOriginalImageForCompare(null);
        setActivePanel('left');
      } else {
        setError("Falha ao preparar a imagem para edição.");
      }
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [showHistory, setShowHistory] = useState(false);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans bg-zinc-900 text-gray-200">
      <div className={`${activePanel === 'right' ? 'hidden' : 'flex'} lg:flex flex-col h-full`}>
        <LeftPanel
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          createFunction={createFunction}
          setCreateFunction={setCreateFunction}
          editFunction={editFunction}
          setEditFunction={setEditFunction}
          image1={image1}
          setImage1={setImage1}
          image2={image2}
          setImage2={setImage2}
          image3={image3}
          setImage3={setImage3}
          image4={image4}
          setImage4={setImage4}
          mask={mask}
          setMask={setMask}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          characterStyle={characterStyle}
          setCharacterStyle={setCharacterStyle}

          headline={headline}
          setHeadline={setHeadline}
          palette={palette}
          setPalette={setPalette}
          useGradient={useGradient}
          setUseGradient={setUseGradient}

          isLoading={isLoading}
          onGenerate={handleGenerate}
          isApiKeySelected={isApiKeySelected}
          setIsApiKeySelected={setIsApiKeySelected}
          enhancePromptApi={enhancePromptApi}
          onLogout={handleLogout}
          onShowHistory={() => setShowHistory(true)}
        />
      </div>
      <div className={`${activePanel === 'left' ? 'hidden' : 'flex'} lg:flex flex-col flex-grow h-full relative`}>
        {showHistory ? (
          <History onClose={() => setShowHistory(false)} />
        ) : (
          <RightPanel
            isLoading={isLoading}
            generatedMedia={generatedMedia}
            error={error}
            originalImage={originalImageForCompare}
            editCurrentImage={editCurrentImage}
            resetStateForNewImage={resetStateForNewImage}
          />
        )}
      </div>
    </div>
  );
}
