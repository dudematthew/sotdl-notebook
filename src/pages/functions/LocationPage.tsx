import "./LocationPage.css";

import { locationOutline, refreshOutline } from "ionicons/icons";
import React, { useState } from "react";

import { Geolocation } from "@capacitor/geolocation";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  IonText,
} from "@ionic/react";

import Header from "../../components/Header";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  timestamp: string | null;
  error: string | null;
}

const LocationPage: React.FC = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    timestamp: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setLocation((prev) => ({ ...prev, error: null }));

      // Request permissions
      const permResult = await Geolocation.checkPermissions();
      if (permResult.location === "prompt" || permResult.location === "prompt-with-rationale") {
        await Geolocation.requestPermissions();
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(position.timestamp).toLocaleString(),
        error: null,
      });
    } catch (error) {
      setLocation((prev) => ({
        ...prev,
        error: `Error getting location: ${error instanceof Error ? error.message : String(error)}`,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <Header title="Location Check" />
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>GPS Location Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={getCurrentLocation} disabled={isLoading}>
              <IonIcon icon={isLoading ? refreshOutline : locationOutline} slot="start" />
              {isLoading ? "Getting Location..." : "Check Location"}
              {isLoading && <IonSpinner name="crescent" />}
            </IonButton>

            {location.error ? (
              <IonText color="danger">
                <p>{location.error}</p>
              </IonText>
            ) : (
              <>
                {location.latitude && location.longitude && (
                  <div className="ion-padding-top">
                    <IonText>
                      <p>
                        <strong>Latitude:</strong> {location.latitude}
                      </p>
                      <p>
                        <strong>Longitude:</strong> {location.longitude}
                      </p>
                      <p>
                        <strong>Last Updated:</strong> {location.timestamp}
                      </p>
                    </IonText>
                  </div>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LocationPage;
