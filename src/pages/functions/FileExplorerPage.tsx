import { camera, document, images, trash } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import {
  IonActionSheet,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  isPlatform,
} from "@ionic/react";

import Header from "../../components/Header";
import SafeAreaContent from "../../components/SafeAreaContent";

interface FileItem {
  id: string;
  filepath: string;
  webviewPath: string;
  type: "photo" | "file";
  name: string;
  mimeType?: string;
}

const FILE_STORAGE_KEY = "files";

const FileExplorerPage: React.FC = () => {
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileItem>();
  const [error, setError] = useState<string | undefined>();
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const savedItems = await Preferences.get({ key: FILE_STORAGE_KEY });
      const items = savedItems.value ? JSON.parse(savedItems.value) : [];
      setItems(items);
    } catch (err) {
      setError("Failed to load saved items");
    }
  };

  const saveItem = async (item: FileItem) => {
    try {
      if (!isPlatform("mobileweb") && !isPlatform("desktop")) {
        // For mobile platforms, ensure the file exists in filesystem before saving reference
        const fileExists = await Filesystem.stat({
          path: item.filepath,
          directory: Directory.Data,
        }).catch(() => null);

        if (!fileExists) {
          throw new Error("File not found in filesystem");
        }
      }

      const updatedItems = [item, ...items];
      setItems(updatedItems);
      await Preferences.set({
        key: FILE_STORAGE_KEY,
        value: JSON.stringify(updatedItems),
      });
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save item: " + (err instanceof Error ? err.message : "Unknown error"));
      throw err; // Re-throw to handle in calling function
    }
  };

  const takePhoto = async () => {
    try {
      setError(undefined);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        const fileName = `photo_${Date.now()}.jpeg`;
        const newItem: FileItem = {
          id: Date.now().toString(),
          filepath: image.path || fileName,
          webviewPath: image.webPath,
          type: "photo",
          name: fileName,
          mimeType: "image/jpeg",
        };
        await saveItem(newItem);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to take photo");
    }
  };

  const pickFile = async () => {
    try {
      setError(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pick file");
    }
  };

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(undefined);
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const dataUrl = e.target?.result as string;
          const fileName = `file_${Date.now()}_${file.name}`;

          if (!isPlatform("mobileweb") && !isPlatform("desktop")) {
            // For mobile platforms, first save to filesystem
            await Filesystem.writeFile({
              path: fileName,
              data: dataUrl.split(",")[1],
              directory: Directory.Data,
            });

            // Verify file was written
            const savedFile = await Filesystem.stat({
              path: fileName,
              directory: Directory.Data,
            });

            const newItem: FileItem = {
              id: Date.now().toString(),
              filepath: savedFile.uri,
              webviewPath: dataUrl,
              type: file.type.startsWith("image/") ? "photo" : "file",
              name: file.name,
              mimeType: file.type,
            };
            await saveItem(newItem);
          } else {
            // Web platform handling remains the same
            const newItem: FileItem = {
              id: Date.now().toString(),
              filepath: fileName,
              webviewPath: dataUrl,
              type: file.type.startsWith("image/") ? "photo" : "file",
              name: file.name,
              mimeType: file.type,
            };
            await saveItem(newItem);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to process file");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
    }
  };

  const deleteItem = async (item: FileItem) => {
    try {
      const newItems = items.filter((i) => i.id !== item.id);
      setItems(newItems);
      await Preferences.set({
        key: FILE_STORAGE_KEY,
        value: JSON.stringify(newItems),
      });

      if (!isPlatform("mobileweb") && !isPlatform("desktop")) {
        await Filesystem.deleteFile({
          path: item.filepath,
          directory: Directory.Data,
        });
      }
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return document;
    if (mimeType.startsWith("image/")) return images;
    return document;
  };

  return (
    <IonPage>
      <Header title="File Explorer" />
      <SafeAreaContent>
        <IonContent>
          <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="*/*" style={{ display: "none" }} />

          <IonGrid>
            <IonRow>
              {items.map((item) => (
                <IonCol size="6" key={item.id}>
                  <div
                    className="gallery-item"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowActions(true);
                    }}
                  >
                    {item.type === "photo" ? (
                      <IonImg src={item.webviewPath} alt={item.name} />
                    ) : (
                      <div className="file-item">
                        <IonIcon icon={getFileIcon(item.mimeType)} size="large" />
                        <p>{item.name}</p>
                      </div>
                    )}
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonActionSheet
            isOpen={showActions}
            onDidDismiss={() => {
              setShowActions(false);
              setSelectedItem(undefined);
            }}
            buttons={[
              {
                text: "Delete",
                role: "destructive",
                icon: trash,
                handler: () => {
                  if (selectedItem) {
                    deleteItem(selectedItem);
                  }
                },
              },
              {
                text: "Cancel",
                role: "cancel",
              },
            ]}
          />

          {error && <div className="error-message">{error}</div>}

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={pickFile}>
              <IonIcon icon={document} />
            </IonFabButton>
          </IonFab>

          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={takePhoto}>
              <IonIcon icon={camera} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </SafeAreaContent>
    </IonPage>
  );
};

export default FileExplorerPage;
