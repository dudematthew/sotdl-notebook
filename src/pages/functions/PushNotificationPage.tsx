import { copyOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";

import { PushNotifications } from "@capacitor/push-notifications";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonPage,
  IonText,
  IonToast,
  isPlatform,
} from "@ionic/react";

import Header from "../../components/Header";

interface NotificationMessage {
  id: string;
  title?: string;
  body?: string;
  timestamp: string;
}

const PushNotificationPage: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const initializePush = async () => {
      if (isPlatform("mobileweb") || isPlatform("desktop")) {
        setError(
          "Push notifications are not available in web browser. Please run the app on a mobile device or simulator."
        );
        return;
      }

      try {
        const permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === "prompt") {
          await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== "granted") {
          throw new Error("Push notification permission was denied");
        }

        await PushNotifications.register();

        // Add all listeners
        PushNotifications.addListener("registration", (token) => {
          console.log("FCM token:", token.value);
          setFcmToken(token.value);
        });

        PushNotifications.addListener("registrationError", (err) => {
          console.error("Registration error:", err.error);
          setError(`Registration error: ${err.error}`);
        });

        PushNotifications.addListener("pushNotificationReceived", (notification) => {
          console.log("Push notification received:", notification);
          const newNotification: NotificationMessage = {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            timestamp: new Date().toLocaleString(),
          };
          setNotifications((prev) => [newNotification, ...prev]);
        });

        PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
          console.log("Push notification action performed:", notification);
        });
      } catch (error) {
        console.error("Error initializing push notifications:", error);
        setError(error instanceof Error ? error.message : "Failed to initialize push notifications");
      }
    };

    initializePush();

    return () => {
      if (!isPlatform("mobileweb") && !isPlatform("desktop")) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  const checkDeliveredNotifications = async () => {
    try {
      const delivered = await PushNotifications.getDeliveredNotifications();
      console.log("Delivered notifications:", delivered);
      setNotifications(
        delivered.notifications.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          timestamp: new Date().toLocaleString(),
        }))
      );
    } catch (err) {
      console.error("Error checking delivered notifications:", err);
    }
  };

  const copyTokenToClipboard = async () => {
    if (fcmToken) {
      await navigator.clipboard.writeText(fcmToken);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <Header title="Push Notifications" />
      <IonContent className="ion-padding">
        <IonText>
          <p>Firebase Cloud Messaging Push Notifications</p>
        </IonText>

        <IonCard>
          <IonCardContent>
            {error ? (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            ) : (
              <>
                {fcmToken && (
                  <div className="ion-margin-bottom">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <IonText>
                        <p>
                          <strong>FCM Token:</strong>
                        </p>
                      </IonText>
                      <IonButton size="small" fill="clear" onClick={copyTokenToClipboard}>
                        <IonIcon icon={copyOutline} />
                      </IonButton>
                    </div>
                    <p style={{ wordBreak: "break-all" }}>{fcmToken}</p>
                  </div>
                )}

                <IonButton expand="block" onClick={checkDeliveredNotifications}>
                  Check Delivered Notifications
                </IonButton>

                {notifications.length > 0 && (
                  <div className="ion-margin-top">
                    <IonText>
                      <h2>Recent Notifications ({notifications.length})</h2>
                    </IonText>
                    {notifications.map((notification) => (
                      <div key={`${notification.id}-${notification.timestamp}`} className="ion-margin-top">
                        <IonText>
                          <p>
                            <strong>{notification.title}</strong>
                          </p>
                          <p>{notification.body}</p>
                          <p className="ion-text-end">
                            <small>{notification.timestamp}</small>
                          </p>
                        </IonText>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="FCM Token copied to clipboard"
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default PushNotificationPage;
