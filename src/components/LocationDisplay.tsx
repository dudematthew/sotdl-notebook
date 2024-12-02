import React, { useState } from "react";

import { Geolocation } from "@capacitor/geolocation";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";

const LocationDisplay: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = async () => {
    try {
      // Request permissions
      const permResult = await Geolocation.checkPermissions();
      if (permResult.location === "prompt" || permResult.location === "prompt-with-rationale") {
        await Geolocation.requestPermissions();
      }

      // Get position
      const position = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    } catch (err) {
      setError("Error getting location: " + (err instanceof Error ? err.message : String(err)));
      setLocation(null);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>GPS Location</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="block" onClick={getCurrentPosition}>
          Get Current Location
        </IonButton>

        {location && (
          <div style={{ marginTop: "1rem" }}>
            <IonText>
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
            </IonText>
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default LocationDisplay;
