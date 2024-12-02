import {
    alertCircleOutline, cameraOutline, cloudOffline, documentOutline, fingerPrintOutline,
    informationCircleOutline, locationOutline, notifications, notificationsOutline
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { IonIcon, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';

import Header from '../components/Header';
import SafeAreaContent from '../components/SafeAreaContent';

const FunctionsPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <Header title="Functions" showBackButton={false} />
      <SafeAreaContent>
        <IonList>
          <IonItem button onClick={() => history.push("/tabs/functions/info")}>
            <IonLabel>Info</IonLabel>
            <IonIcon icon={informationCircleOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/location")}>
            <IonLabel>Location</IonLabel>
            <IonIcon icon={locationOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/local-notifications")}>
            <IonLabel>Local Notifications</IonLabel>
            <IonIcon icon={notificationsOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/push-notifications")}>
            <IonLabel>Push Notifications (FCM)</IonLabel>
            <IonIcon icon={notifications} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/biometric-auth")}>
            <IonLabel>Biometric Authentication</IonLabel>
            <IonIcon icon={fingerPrintOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/offline-profile")}>
            <IonLabel>Offline Profile</IonLabel>
            <IonIcon icon={cloudOffline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/sentry-test")}>
            <IonLabel>Sentry Testing</IonLabel>
            <IonIcon icon={alertCircleOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/camera")}>
            <IonLabel>Camera</IonLabel>
            <IonIcon icon={cameraOutline} slot="end" />
          </IonItem>
          <IonItem button onClick={() => history.push("/tabs/functions/file-explorer")}>
            <IonLabel>File Explorer</IonLabel>
            <IonIcon icon={documentOutline} slot="end" />
          </IonItem>
        </IonList>
      </SafeAreaContent>
    </IonPage>
  );
};

export default FunctionsPage;
