import { bookOutline } from "ionicons/icons";
import React from "react";

import {
  IonContent,
  IonIcon,
  IonPage,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

import Header from "../components/Header";

const SpellbookPage: React.FC = () => {
  return (
    <IonPage>
      <Header title="SotDL Spellbook" showBackButton={false}>
        <IonIcon icon={bookOutline} slot="end" />
      </Header>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome to SotDL Spellbook</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>Your digital companion for Shadow of the Demon Lord spellcasting.</p>
              <p>Features coming soon:</p>
              <ul>
                <li>Spell database</li>
                <li>Character spell lists</li>
                <li>Tradition management</li>
                <li>Quick spell reference</li>
                <li>Offline access</li>
              </ul>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default SpellbookPage; 