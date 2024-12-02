import { fingerPrintOutline } from "ionicons/icons";
import React, { useState } from "react";

import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from "@ionic/react";

import Header from "../../components/Header";

const BiometricAuthPage: React.FC = () => {
  const [status, setStatus] = useState<string>("");

  const handleBiometricAuth = async () => {
    setStatus("Biometric authentication will be implemented in a future update.");
  };

  return (
    <IonPage>
      <Header title="Biometric Authentication">
        <IonIcon icon={fingerPrintOutline} slot="end" />
      </Header>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>Biometric Authentication</h2>
              <IonText color="medium">
                <p>Use fingerprint or face recognition to authenticate.</p>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonButton expand="block" onClick={handleBiometricAuth}>
              Authenticate with Biometrics
            </IonButton>
          </IonItem>
          {status && (
            <IonItem>
              <IonText color="medium">{status}</IonText>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default BiometricAuthPage;
