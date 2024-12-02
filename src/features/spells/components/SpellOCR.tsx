import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { cameraOutline, scanOutline, textOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import type { Worker } from 'tesseract.js';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonSpinner,
  IonText,
  IonTextarea,
  IonToolbar,
  IonTitle,
} from '@ionic/react';

import { SpellLanguage } from '../types/spell';

interface SpellOCRProps {
  onOCRComplete: (data: {
    title?: string;
    tradition?: string;
    type?: string;
    rank?: number;
    area?: string;
    target?: string;
    duration?: string;
    description?: string;
    attackRoll?: string;
    criticalEffect?: string;
  }) => void;
  language: SpellLanguage;
}

interface ParsedSpell {
  title?: string;
  tradition?: string;
  type?: string;
  rank?: number;
  area?: string;
  target?: string;
  duration?: string;
  description?: string;
  attackRoll?: string;
  criticalEffect?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SpellOCR: React.FC<SpellOCRProps> = ({ onOCRComplete, language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [manualText, setManualText] = useState('');
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getMousePosition = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const pos = getMousePosition(event);
    if (!pos) return;

    setIsDragging(true);
    setDragStart(pos);
    setCropArea({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragStart || !containerRef.current) return;

    const pos = getMousePosition(event);
    if (!pos) return;

    setCropArea({
      x: Math.min(dragStart.x, pos.x),
      y: Math.min(dragStart.y, pos.y),
      width: Math.abs(pos.x - dragStart.x),
      height: Math.abs(pos.y - dragStart.y),
    });

    drawCropArea();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    drawCropArea();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const pos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    setIsDragging(true);
    setDragStart(pos);
    setCropArea({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging || !dragStart || !containerRef.current) return;

    const touch = event.touches[0];
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const currentPos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    setCropArea({
      x: Math.min(dragStart.x, currentPos.x),
      y: Math.min(dragStart.y, currentPos.y),
      width: Math.abs(currentPos.x - dragStart.x),
      height: Math.abs(currentPos.y - dragStart.y),
    });

    drawCropArea();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
    drawCropArea();
  };

  const drawCropArea = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !cropArea) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Darken the area outside the crop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear the crop area
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // Draw crop border
    ctx.strokeStyle = '#3880ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
  }, [cropArea]);

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawCropArea();
    }
  }, [cropArea, drawCropArea]);

  const parseSpellText = (text: string): ParsedSpell => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const result: ParsedSpell = {};

    // Top line parsing
    const topLineRegex = /(.+)\s+(AIR|FIRE|SHADOW|WATER|EARTH|ARCANA)\s+(ATTACK|UTILITY)\s+(\d+)/i;
    const firstLine = lines[0];
    const topLineMatch = firstLine.match(topLineRegex);
    
    if (topLineMatch) {
      result.title = topLineMatch[1].trim();
      result.tradition = topLineMatch[2].toUpperCase();
      result.type = topLineMatch[3].toUpperCase();
      result.rank = parseInt(topLineMatch[4], 10);
    } else {
      result.title = firstLine;
    }

    // Area/Target parsing
    const areaLine = lines.find(line => line.toLowerCase().startsWith('area'));
    const targetLine = lines.find(line => line.toLowerCase().startsWith('target'));
    
    if (areaLine) {
      result.area = areaLine.replace(/^area\s*/i, '').trim();
    }
    if (targetLine) {
      result.target = targetLine.replace(/^target\s*/i, '').trim();
    }

    // Duration parsing
    const durationLine = lines.find(line => line.toLowerCase().startsWith('duration'));
    if (durationLine) {
      result.duration = durationLine.replace(/^duration\s*/i, '').trim();
    }

    // Attack roll parsing
    const attackLine = lines.find(line => line.toLowerCase().includes('attack roll'));
    if (attackLine) {
      result.attackRoll = attackLine.trim();
      
      // Check for critical effect
      const critIndex = lines.findIndex(line => line.includes('20+'));
      if (critIndex !== -1) {
        result.criticalEffect = lines[critIndex].trim();
      }
    }

    // Description is everything after the metadata
    const metadataKeywords = ['area', 'target', 'duration', 'attack roll'];
    const descriptionStartIndex = lines.findIndex((line, index) => 
      index > 0 && !metadataKeywords.some(keyword => line.toLowerCase().startsWith(keyword))
    );
    
    if (descriptionStartIndex !== -1) {
      result.description = lines.slice(descriptionStartIndex).join('\n');
    }

    return result;
  };

  const captureImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Select Image Source',
        promptLabelPhoto: 'Choose from Gallery',
        promptLabelPicture: 'Take Picture',
      });

      if (image.webPath) {
        setImageUrl(image.webPath);
        setIsModalOpen(true);
        setIsTextMode(false);
      }
    } catch (error) {
      // Only log errors that aren't user cancellation
      if (!(error instanceof Error) || !error.message.includes('cancelled')) {
        console.error('Error capturing image:', error);
      }
    }
  };

  const processOCR = async () => {
    if (!imageUrl || !cropArea || !imageRef.current) return;

    try {
      setIsProcessing(true);

      const worker = await createWorker() as Worker;
      const lang = language === SpellLanguage.POLISH ? 'pol' : 'eng';
      await (worker as any).loadLanguage(lang);
      await (worker as any).initialize(lang);

      // Scale crop area to match original image dimensions
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

      const { data } = await worker.recognize(imageUrl, {
        rectangle: {
          left: Math.floor(cropArea.x * scaleX),
          top: Math.floor(cropArea.y * scaleY),
          width: Math.floor(cropArea.width * scaleX),
          height: Math.floor(cropArea.height * scaleY),
        },
      });

      const parsedSpell = parseSpellText(data.text);
      onOCRComplete(parsedSpell);
      setIsModalOpen(false);
      await worker.terminate();
    } catch (error) {
      console.error('Error processing OCR:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (!manualText.trim()) return;
    const parsedSpell = parseSpellText(manualText);
    onOCRComplete(parsedSpell);
    setIsModalOpen(false);
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" style={{ gap: '1rem' }}>
        <IonFabButton onClick={captureImage} style={{ marginBottom: '1rem' }}>
          <IonIcon icon={cameraOutline} />
        </IonFabButton>
        <IonFabButton onClick={() => {
          setIsModalOpen(true);
          setIsTextMode(true);
          setImageUrl(null);
        }}>
          <IonIcon icon={textOutline} />
        </IonFabButton>
      </IonFab>

      <IonModal 
        isOpen={isModalOpen} 
        onDidDismiss={() => setIsModalOpen(false)}
        className="fullscreen-modal"
      >
        <IonContent>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>
              {isTextMode ? 'Paste Spell Text' : 'Select Spell Area'}
            </IonTitle>
          </IonToolbar>

          <div className="ion-padding">
            <div className="mode-toggle ion-margin-bottom ion-text-center">
              <IonButton
                fill={!isTextMode ? 'solid' : 'outline'}
                onClick={() => {
                  setIsTextMode(false);
                  if (!imageUrl) {
                    captureImage();
                  }
                }}
                style={{ marginRight: '0.5rem' }}
              >
                <IonIcon slot="start" icon={cameraOutline} />
                OCR
              </IonButton>
              <IonButton
                fill={isTextMode ? 'solid' : 'outline'}
                onClick={() => setIsTextMode(true)}
              >
                <IonIcon slot="start" icon={textOutline} />
                Text
              </IonButton>
            </div>

            {isTextMode ? (
              <>
                <IonTextarea
                  value={manualText}
                  onIonChange={e => setManualText(e.detail.value || '')}
                  placeholder="Paste spell text here..."
                  rows={10}
                  className="ion-margin-bottom"
                />
                <IonButton
                  expand="block"
                  onClick={handleTextSubmit}
                  disabled={!manualText.trim()}
                >
                  <IonIcon slot="start" icon={scanOutline} />
                  Process Text
                </IonButton>
              </>
            ) : (
              <>
                <IonText color="medium" className="ion-padding-bottom">
                  <p>Draw a rectangle around the spell text</p>
                </IonText>
                <div
                  ref={containerRef}
                  style={{ 
                    position: 'relative',
                    width: '100%',
                    height: 'calc(100vh - 250px)',
                    overflow: 'hidden'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {imageUrl && (
                    <>
                      <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Spell scan"
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          cursor: isDragging ? 'crosshair' : 'default',
                        }}
                      />
                    </>
                  )}
                </div>
                {isProcessing ? (
                  <div className="ion-text-center ion-padding">
                    <IonSpinner />
                    <p>Processing image...</p>
                  </div>
                ) : (
                  <IonButton
                    expand="block"
                    onClick={processOCR}
                    disabled={!cropArea}
                    className="ion-margin-top"
                  >
                    <IonIcon slot="start" icon={scanOutline} />
                    Process Image
                  </IonButton>
                )}
              </>
            )}
          </div>
        </IonContent>
      </IonModal>

      <style>{`
        .fullscreen-modal {
          --height: 100%;
          --width: 100%;
        }
        .mode-toggle {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
      `}</style>
    </>
  );
}; 