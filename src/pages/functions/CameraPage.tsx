import { camera, close } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonFab, IonFabButton, IonIcon, IonImg, IonPage, isPlatform } from '@ionic/react';

import Header from '../../components/Header';
import SafeAreaContent from '../../components/SafeAreaContent';

const CameraPage: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
          aspectRatio: window.innerWidth / window.innerHeight,
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access camera");
    }
  };

  const stopWebCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const takePhoto = async () => {
    try {
      setError(undefined);

      if (isPlatform("mobileweb") || isPlatform("desktop")) {
        // Web implementation (just for fun and testing)
        if (videoRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const photoUrl = canvas.toDataURL("image/jpeg", 1.0);
          setPhoto(photoUrl);
          stopWebCamera();
        }
      } else {
        // Mobile implementation
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          width: window.innerWidth * window.devicePixelRatio,
          height: window.innerHeight * window.devicePixelRatio,
        });
        setPhoto(image.webPath);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to take photo");
    }
  };

  const clearPhoto = () => {
    setPhoto(undefined);
    if (isPlatform("mobileweb") || isPlatform("desktop")) {
      startWebCamera();
    }
  };

  useEffect(() => {
    if ((isPlatform("mobileweb") || isPlatform("desktop")) && !photo) {
      startWebCamera();
    }
    return () => {
      stopWebCamera();
    };
  }, []);

  return (
    <IonPage>
      <Header title="Camera" />
      <SafeAreaContent className="camera-content">
        {photo ? (
          <div className="camera-container">
            <IonImg src={photo} />
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton onClick={clearPhoto} color="light">
                <IonIcon icon={close} />
              </IonFabButton>
            </IonFab>
          </div>
        ) : (
          <div className="camera-container">
            {isPlatform("mobileweb") || isPlatform("desktop") ? <video ref={videoRef} autoPlay playsInline /> : null}
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton
                onClick={takePhoto}
                color="light"
                disabled={!isStreaming && (isPlatform("mobileweb") || isPlatform("desktop"))}
              >
                <IonIcon icon={camera} />
              </IonFabButton>
            </IonFab>
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              left: "0",
              right: "0",
              textAlign: "center",
              color: "#fff",
              backgroundColor: "rgba(var(--ion-color-danger-rgb), 0.7)",
              padding: "8px",
            }}
          >
            {error}
          </div>
        )}
      </SafeAreaContent>
    </IonPage>
  );
};

export default CameraPage;
