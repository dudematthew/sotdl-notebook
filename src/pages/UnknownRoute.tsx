import { arrowBack, homeOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router-dom";

import { IonButton, IonContent, IonIcon, IonItem, IonList, IonPage, IonText } from "@ionic/react";

import Header from "../components/Header";

const UnknownRoute: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <Header title="Screen Not Found" />
      <IonContent>
        <IonList className="ion-padding">
          <IonItem lines="none" className="ion-text-center">
            <IonText color="medium" className="ion-text-center">
              <h2>Oops!</h2>
              <p>This screen doesn't exist in the app.</p>
            </IonText>
          </IonItem>
          <IonItem lines="none">
            <IonButton expand="block" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} slot="start" />
              Go Back
            </IonButton>
          </IonItem>
          <IonItem lines="none">
            <IonButton expand="block" routerLink="/tabs/tab1" color="medium">
              <IonIcon icon={homeOutline} slot="start" />
              Go to Home Screen
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UnknownRoute;
