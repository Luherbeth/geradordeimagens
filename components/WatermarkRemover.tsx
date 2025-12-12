import React, { useState, useRef, useEffect, useCallback, PointerEvent } from 'react';
import { ImageData } from '../types';
import * as Icons from './icons';

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  brushSize: number;
}

interface WatermarkRemoverProps {
  image: ImageData;
  onMaskChange: (maskFile: File | null) => void;
  onDone?: () => void; // If provided, enables modal mode with a done button
}

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

const WatermarkRemover: React.FC<WatermarkRemoverProps> = ({ image, onMaskChange, onDone }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isDrawing = useRef(false);

  const [paths, setPaths] = useState<Path[]>([]);
  const [brushSize, setBrushSize] = useState(40);
  
  const getScaledCoords = useCallback((event: PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);
  
  const generateMask = useCallback(() => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
    
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    if (paths.length === 0) {
      onMaskChange(null);
      return;
    }

    const displayCanvas = canvasRef.current;
    if(!displayCanvas) return;
    const scaleX = maskCanvas.width / displayCanvas.width;
    const scaleY = maskCanvas.height / displayCanvas.height;

    maskCtx.strokeStyle = 'white';
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';

    paths.forEach(path => {
      maskCtx.lineWidth = path.brushSize * scaleX; // Scale brush size
      maskCtx.beginPath();
      path.points.forEach((point, index) => {
        const scaledPoint = { x: point.x * scaleX, y: point.y * scaleY };
        if (index === 0) {
          maskCtx.moveTo(scaledPoint.x, scaledPoint.y);
        } else {
          maskCtx.lineTo(scaledPoint.x, scaledPoint.y);
        }
      });
      maskCtx.stroke();
    });

    const maskDataUrl = maskCanvas.toDataURL('image/png');
    const maskFile = dataURLtoFile(maskDataUrl, 'mask.png');
    onMaskChange(maskFile);

  }, [paths, onMaskChange]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(163, 230, 53, 0.7)'; // lime-400 with transparency
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    paths.forEach(path => {
        ctx.lineWidth = path.brushSize;
        ctx.beginPath();
        path.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    });
  }, [paths]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const imageEl = new Image();
    imageRef.current = imageEl;
    imageEl.src = image.previewUrl;

    imageEl.onload = () => {
      const { naturalWidth, naturalHeight } = imageEl;
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

      const imageAspectRatio = naturalWidth / naturalHeight;
      const containerAspectRatio = containerWidth / containerHeight;

      let canvasWidth, canvasHeight;
      if (imageAspectRatio > containerAspectRatio) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imageAspectRatio;
      } else {
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * imageAspectRatio;
      }
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      draw();
    };

    // Cleanup
    return () => {
      imageRef.current = null;
    }
  }, [image.previewUrl, draw]);

  useEffect(() => {
    draw();
  }, [paths, draw]);
  
  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawing.current = true;
    const point = getScaledCoords(event);
    if (!point) return;

    setPaths(prev => [...prev, { points: [point], brushSize }]);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const point = getScaledCoords(event);
    if (!point) return;

    setPaths(prev => {
        const newPaths = [...prev];
        const lastPath = newPaths[newPaths.length - 1];
        lastPath.points.push(point);
        return newPaths;
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    isDrawing.current = false;
    generateMask();
  };

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1));
    // Trigger mask regeneration after state update
    setTimeout(generateMask, 0); 
  };
  
  const handleClear = () => {
    setPaths([]);
    onMaskChange(null);
  };
  
  const isModal = !!onDone;

  return (
    <div className={`flex flex-col h-full w-full ${isModal ? 'bg-zinc-950' : ''}`}>
      {isModal && (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
          <h2 className="font-bold text-lg text-lime-400">Editar Marca D'água</h2>
          <button
            onClick={onDone}
            className="flex items-center gap-2 bg-lime-500 text-zinc-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-600"
          >
            <Icons.CheckIcon className="w-5 h-5" />
            Concluir
          </button>
        </header>
      )}

      {!isModal && (
         <p className="font-semibold text-gray-300 text-sm mb-2">Pinte sobre a marca d'água</p>
      )}

      <div ref={containerRef} className="relative w-full flex-grow bg-zinc-800/50 rounded-lg overflow-hidden select-none flex items-center justify-center min-h-0">
        <img
          src={image.previewUrl}
          className="max-w-full max-h-full object-contain pointer-events-none"
          alt="Para Edição"
        />
        <canvas
          ref={canvasRef}
          className="absolute cursor-crosshair"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

       <div className={`flex-shrink-0 flex flex-wrap items-center gap-4 p-4 ${isModal ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-transparent'}`}>
            <div className="flex items-center gap-2 text-gray-300">
                <Icons.BrushIcon className="w-5 h-5"/>
                <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24 md:w-32 accent-lime-500"
                />
            </div>
            <div className="flex items-center gap-2">
                 <button
                    onClick={handleUndo}
                    disabled={paths.length === 0}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 text-gray-300 rounded-md disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    title="Desfazer"
                  >
                    <Icons.UndoIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={paths.length === 0}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 text-gray-300 rounded-md disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    title="Limpar"
                  >
                    <Icons.RemoveBgIcon className="w-5 h-5" />
                  </button>
            </div>
      </div>
    </div>
  );
};

export default WatermarkRemover;