import React, { useEffect } from "react";

import { LocalNotifications } from "@capacitor/local-notifications";
import { IonButton, IonContent, IonPage, IonText } from "@ionic/react";

import Header from "../../components/Header";

const LocalNotificationPage: React.FC = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display === "prompt") {
          await LocalNotifications.requestPermissions();
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    setupNotifications();
  }, []);

  const sendTestNotification = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Test Notification",
            body: "This is a test notification",
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  return (
    <IonPage>
      <Header title="Local Notifications" />
      <IonContent className="ion-padding">
        <IonText>
          <p>This is the Local Notifications Page.</p>
        </IonText>
        <IonButton expand="block" onClick={sendTestNotification}>
          Send Test Notification
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LocalNotificationPage;
