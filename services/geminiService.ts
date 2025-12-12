
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { Mode, CreateFunction, EditFunction, AspectRatio, GeneratedMedia } from '../types';

interface GenerateMediaApiParams {
  prompt: string;
  mode: Mode;
  activeFunction: CreateFunction | EditFunction;
  image1?: File;
  image2?: File;
  image3?: File;
  image4?: File;
  mask?: File;
  aspectRatio?: AspectRatio;
  characterStyle?: string;
  instagramOptions?: {
    headline: string;
    palette: string;
    useGradient: boolean;
  }
}

// CONSTANTS FOR MODELS
const IMAGE_MODEL = 'gemini-3-pro-image-preview'; // Nano Banana Pro 3
const TEXT_MODEL = 'gemini-3-pro-preview'; // Pro Text Model for Prompt Enhancement
const VIDEO_MODEL = 'veo-3.1-fast-generate-preview'; // Veo for Video

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const convertFileToPngBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to create canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl.split(',')[1]);
            };
            img.onerror = () => reject(new Error('Failed to load image for conversion'));
            img.src = event.target?.result as string;
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

const fileToGenerativePart = async (file: File) => {
  const supportedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
  
  if (supportedMimeTypes.includes(file.type)) {
      const base64 = await fileToBase64(file);
      return {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      };
  } else {
      // Convert unsupported types (like avif) to png
      try {
          const base64 = await convertFileToPngBase64(file);
          return {
            inlineData: {
              mimeType: 'image/png',
              data: base64,
            },
          };
      } catch (e) {
          console.error("Conversion failed", e);
          throw new Error(`Formato de imagem não suportado (${file.type}). Por favor use PNG, JPEG ou WEBP.`);
      }
  }
};

const getImageFromResponse = (response: GenerateContentResponse): GeneratedMedia => {
    for (const candidate of response.candidates || []) {
        if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                  const base64ImageBytes: string = part.inlineData.data;
                  const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                  return { url: imageUrl, type: 'image' };
                }
            }
        }
    }
    throw new Error('Nenhuma imagem foi gerada na resposta. Tente novamente com um prompt diferente.');
};

export const generateMediaApi = async (params: GenerateMediaApiParams): Promise<GeneratedMedia> => {
  const { prompt, mode, activeFunction, image1, image2, image3, image4, mask, aspectRatio, characterStyle, instagramOptions } = params;

  // Check for API key for all operations involving Pro models
  if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
       throw new Error("Por favor, selecione uma chave de API para continuar.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  switch (mode) {
    case 'create': {
      switch (activeFunction as CreateFunction) {
        case 'free':
        case 'sticker':
        case 'text':
        case 'comic':
        case 'thumbnail': {
            let finalPrompt = prompt;
            if (activeFunction === 'sticker') finalPrompt = `um adesivo de vinil de "${prompt}", fundo branco, estilo de arte de desenho animado, borda grossa, alta qualidade`;
            if (activeFunction === 'text') finalPrompt = `um logotipo de texto para "${prompt}", design de logotipo profissional, vetor, minimalista, fundo branco`;
            if (activeFunction === 'comic') finalPrompt = `uma cena no estilo de história em quadrinhos de "${prompt}", arte em quadrinhos, cores vibrantes, hachuras detalhadas, 4k`;
            if (activeFunction === 'thumbnail') finalPrompt = `uma thumbnail de vídeo do YouTube atraente para um vídeo sobre "${prompt}", texto grande e legível, cores vibrantes, alta resolução, 8k`;
            
            const parts: any[] = [{ text: finalPrompt }];
            
            // Add optional image for 'free' mode (Prompt block)
            if (activeFunction === 'free' && image1) {
                parts.push(await fileToGenerativePart(image1));
            }

            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio || '1:1',
                        imageSize: '1K'
                    }
                },
            });

            return getImageFromResponse(response);
        }
        case 'fitting-room': {
             if (!image1 || !image2 || !image3 || !image4) throw new Error('Por favor, carregue a foto da pessoa e 3 peças de roupa.');
             
             const parts: any[] = [];
             parts.push(await fileToGenerativePart(image1)); // The Person
             parts.push(await fileToGenerativePart(image2)); // Cloth 1
             parts.push(await fileToGenerativePart(image3)); // Cloth 2
             parts.push(await fileToGenerativePart(image4)); // Cloth 3

             const finalPrompt = `
                 Realize uma prova virtual de roupas (Virtual Try-On) de alto realismo usando o modelo avançado.
                 
                 IMAGEM 1 (MODELO):
                 - Esta é a pessoa que vestirá as roupas. 
                 - MANTENHA EXATAMENTE o rosto, cabelo, tom de pele, tipo de corpo e a pose da pessoa da Imagem 1. A identidade deve ser preservada com perfeição.
                 
                 IMAGENS 2, 3 e 4 (ROUPAS):
                 - Estas são as peças de roupa a serem vestidas.
                 - Substitua as roupas originais da pessoa da Imagem 1 por estas peças novas.
                 - Combine as peças 2, 3 e 4 em um outfit completo e coeso. Ajuste o caimento para parecer natural no corpo do modelo.
                 
                 CENÁRIO E ESTILO:
                 - Fundo de estúdio fotográfico profissional neutro ou provador de luxo suavemente desfocado.
                 - Iluminação de moda (softbox), texturas de tecido ultra-realistas (4k/8k).
                 - A imagem final deve parecer uma fotografia real, não uma montagem.
             `;
             parts.push({ text: finalPrompt });

             const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio || '9:16',
                        imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'instagram': {
             const parts: any[] = [];
             
             if (image1) parts.push(await fileToGenerativePart(image1));
             if (image2) parts.push(await fileToGenerativePart(image2));
             
             const { headline, palette, useGradient } = instagramOptions || { headline: '', palette: 'Modern Tech', useGradient: false };

             const finalPrompt = `
                 Crie um post de Instagram profissional, de alto impacto visual e alta resolução (8k).
                 
                 HEADLINE (TÍTULO DE IMPACTO): "${headline}"
                 - A headline deve estar integrada no design de forma tipográfica moderna, legível e impactante.
                 
                 CONTEXTO VISUAL: ${prompt}
                 
                 ELEMENTOS OBRIGATÓRIOS:
                 - Ícones 3D de alta qualidade (estilo "glossy" ou "matte") que se relacionem com o contexto do post.
                 - Composição fotográfica profissional, iluminação de estúdio comercial.
                 - Estilo minimalista, limpo e sofisticado.
                 
                 PALETA DE CORES: ${palette}
                 ${useGradient ? '- APLIQUE CAMADAS DE GRADIENTE SUAVES (Overlay) para dar profundidade e um toque moderno tech.' : ''}
                 ${(image1 || image2) ? '- Use as imagens fornecidas como referência principal para o produto ou sujeito do post, integrando-as perfeitamente ao novo design.' : ''}
                 
                 O resultado deve parecer um post criado por uma agência de design de topo.
             `;
             
             parts.push({ text: finalPrompt });

             const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio || '4:5', // 4:5 is best for IG portrait
                        imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'character': {
            if (!image1) throw new Error('Por favor, carregue uma imagem para criar um personagem.');
            const imagePart = await fileToGenerativePart(image1);
            
            const finalPrompt = `Transforme a foto inteira fornecida em uma ilustração de personagem no estilo "${characterStyle}".
- A pessoa na imagem deve ser completamente redesenhada no estilo de arte especificado, incluindo rosto, cabelo, corpo inteiro e roupas.
- Mantenha a pose e a expressão originais da pessoa.
- Recrie o fundo e o cenário da imagem original no mesmo estilo "${characterStyle}" para criar uma cena completa e coesa.
- A composição geral da imagem original deve ser preservada.
${prompt ? `- Incorpore os seguintes detalhes adicionais: ${prompt}` : ''}
O resultado final não deve ser um personagem de "cabeça flutuante", mas uma ilustração completa do personagem em seu ambiente, alta resolução.`;

            // Putting text first can help with instructions adherence
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts: [{ text: finalPrompt }, imagePart] },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio || '1:1',
                        imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'start-end-video': {
            if (!image1 || !image2) throw new Error('Por favor, carregue as imagens de início e fim.');

            const startImagePart = {
                imageBytes: await fileToBase64(image1),
                mimeType: image1.type,
            };
            const endImagePart = {
                imageBytes: await fileToBase64(image2),
                mimeType: image2.type,
            };
            
            let operation = await ai.models.generateVideos({
                model: VIDEO_MODEL,
                prompt: prompt || 'Transição suave entre a imagem inicial e a final.',
                image: startImagePart,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    lastFrame: endImagePart,
                    aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                operation = await ai.operations.getVideosOperation({operation: operation});
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) throw new Error('Falha ao gerar o vídeo.');

            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const videoBlob = await videoResponse.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            return { url: videoUrl, type: 'video' };
        }
        default:
          throw new Error('Função de criação desconhecida.');
      }
    }
    case 'edit': {
      if (!image1) throw new Error('Por favor, carregue uma imagem para editar.');
      const imagePart = await fileToGenerativePart(image1);
      
      // All edit functions use Nano Banana Pro 3 (IMAGE_MODEL)
      switch (activeFunction as EditFunction) {
        case 'add-remove':
        case 'retouch':
        case 'style': {
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts: [{ text: prompt }, imagePart] },
                config: {
                    imageConfig: {
                         imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'compose': {
            if (!image2) throw new Error('Por favor, carregue a segunda imagem para compor.');
            const image2Part = await fileToGenerativePart(image2);
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts: [{ text: prompt }, imagePart, image2Part] },
                config: {
                    imageConfig: {
                         imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'remove-background': {
            const removeBgPrompt = 'Remova o fundo desta imagem, deixando o objeto principal em um fundo transparente. O resultado deve ser uma imagem PNG com fundo transparente. Corte preciso, alta qualidade.';
             const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts: [{ text: removeBgPrompt }, imagePart] },
                config: {
                    imageConfig: {
                         imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        case 'remove-watermark': {
            if (!mask) throw new Error('Máscara necessária para remover marca d\'água.');
            const maskPart = await fileToGenerativePart(mask);
            const removeWatermarkPrompt = 'Use a máscara fornecida para identificar a área da marca d\'água na imagem e remova-a, preenchendo a área de forma realista e imperceptível, combinando com o entorno. Alta resolução.';
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: { parts: [
                    {text: removeWatermarkPrompt},
                    imagePart,
                    maskPart, 
                ]},
                config: {
                    imageConfig: {
                         imageSize: '1K'
                    }
                },
            });
            return getImageFromResponse(response);
        }
        default:
          throw new Error('Função de edição desconhecida.');
      }
    }
    default:
      throw new Error('Modo desconhecido.');
  }
};


export const enhancePromptApi = async (prompt: string): Promise<string> => {
  if (!prompt) return '';
  // Check for API key before enhancing
  if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // If no key, return original prompt to avoid blocking, 
      // though generateMedia will catch it later.
      return prompt; 
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = "Você é um especialista em engenharia de prompt para modelos de IA generativa de imagem (Nano Banana Pro 3). Sua tarefa é reescrever o prompt do usuário para ser mais descritivo, vívido e detalhado, resultando em uma imagem de qualidade profissional 8k. Adicione detalhes sobre iluminação, composição, estilo de arte e emoção. Responda apenas com o prompt aprimorado, sem texto adicional.";
  
  const response = await ai.models.generateContent({
    model: TEXT_MODEL, // Using Gemini 3 Pro for better prompt understanding
    contents: prompt,
    config: {
        systemInstruction,
    },
  });

  return response.text.trim();
};
