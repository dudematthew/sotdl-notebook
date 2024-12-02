import "./TRPCTest.css";

import { refreshOutline } from "ionicons/icons";
import React from "react";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSkeletonText,
  IonSpinner,
  IonText,
} from "@ionic/react";

import Header from "../components/Header";
import { env } from "../env";
import { trpc } from "../utils/trpc";

const TRPCTest: React.FC = () => {
  const {
    data: userData,
    isLoading,
    error: trpcError,
    refetch,
  } = trpc.users.me.useQuery(undefined, {
    retry: false,
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const renderHeader = () => (
    <Header title="TRPC Test" showBackButton={false}>
      <IonButton onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? (
          <IonSpinner name="crescent" slot="icon-only" />
        ) : (
          <IonIcon slot="icon-only" icon={refreshOutline} />
        )}
      </IonButton>
    </Header>
  );

  if (trpcError) {
    console.error("TRPC Error:", trpcError);
    const errorMessage = trpcError.message;
    const isFetchError = errorMessage.includes("Failed to fetch") || errorMessage.includes("Network request failed");

    const errorDetails = {
      message: errorMessage,
      type: isFetchError ? "NETWORK_ERROR" : "AUTH_ERROR",
      details: isFetchError
        ? "Unable to connect to the server. Please check your internet connection and make sure the API server is running."
        : "Authentication failed. Please try logging in again.",
      timestamp: new Date().toISOString(),
      code: trpcError.data?.code || "UNKNOWN",
      path: trpcError.data?.path || "users.me",
      apiUrl: env.API_URL,
    };

    return (
      <IonPage>
        {renderHeader()}
        <IonContent>
          <IonCard color="danger">
            <IonCardContent>
              <h2>Error Details</h2>
              <IonText color="danger">
                <h3>{errorDetails.details}</h3>
              </IonText>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  userSelect: "all",
                  fontSize: "12px",
                  backgroundColor: "#2b2b2b",
                  color: "#ffffff",
                  padding: "12px",
                  borderRadius: "4px",
                  margin: "8px 0",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  if (isLoading || !userData) {
    return (
      <IonPage>
        {renderHeader()}
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <IonSkeletonText animated style={{ width: "60%" }} />
              </IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      {renderHeader()}
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>User Type</h2>
              <IonText>{userData.type}</IonText>
            </IonLabel>
          </IonItem>
          {userData.type === "user" ? (
            <IonItem>
              <IonLabel>
                <h2>User Info</h2>
                <IonText>
                  {userData.info.first_name} {userData.info.last_name}
                </IonText>
              </IonLabel>
            </IonItem>
          ) : (
            <IonItem>
              <IonLabel>
                <h2>Caregiver Info</h2>
                <IonText>{userData.info.username}</IonText>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TRPCTest;
