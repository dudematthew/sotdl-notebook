import { cloudDoneOutline, cloudOfflineOutline, refreshOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";

import { Network } from "@capacitor/network";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonSkeletonText,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";

import Header from "../../components/Header";
import { trpc } from "../../utils/trpc";

const UserProfileOfflinePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [networkStatus, setNetworkStatus] = useState<{ connected: boolean }>({ connected: true });

  const {
    data: userData,
    isLoading,
    error: trpcError,
    refetch,
    isError,
  } = trpc.users.me.useQuery(undefined, {
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: "online",
    placeholderData: (previousData) => previousData,
    structuralSharing: true,
    refetchOnMount: networkStatus.connected,
    refetchOnReconnect: true,
    refetchOnWindowFocus: networkStatus.connected,
  });

  useEffect(() => {
    let cleanup: (() => Promise<void>) | undefined;

    const setupNetwork = async () => {
      // Initial network status
      const status = await Network.getStatus();
      setNetworkStatus(status);

      // Listen for network changes
      const handler = await Network.addListener("networkStatusChange", (status) => setNetworkStatus(status));
      cleanup = handler.remove;
    };

    void setupNetwork();

    return () => {
      if (cleanup) {
        void cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (networkStatus.connected && userData) {
      queryClient.setQueryData(["users.me"], userData);
    }
  }, [networkStatus.connected, userData, queryClient]);

  const handleRefresh = async () => {
    await refetch();
  };

  const renderHeader = () => (
    <Header title="Offline Profile" showBackButton>
      <IonButton onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? (
          <IonSpinner name="crescent" slot="icon-only" />
        ) : (
          <IonIcon slot="icon-only" icon={refreshOutline} />
        )}
      </IonButton>
    </Header>
  );

  const renderConnectionStatus = () => (
    <IonCard color={networkStatus.connected ? "success" : "warning"}>
      <IonCardHeader>
        <IonCardTitle className="ion-text-center">
          <IonIcon
            icon={networkStatus.connected ? cloudDoneOutline : cloudOfflineOutline}
            style={{ fontSize: "2em", marginBottom: "8px" }}
          />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-text-center">
        <IonText>
          <p>{networkStatus.connected ? "Connected - Data will be synchronized" : "Offline - Using cached data"}</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );

  const handleOfflineData = () => {
    if (!networkStatus.connected) {
      const cachedData = queryClient.getQueryData<typeof userData>(["users.me"]);
      return cachedData || userData;
    }
    return null;
  };

  if (isLoading) {
    return (
      <IonPage>
        {renderHeader()}
        <IonContent>
          {renderConnectionStatus()}
          <IonCard>
            <IonCardContent>
              <IonSkeletonText animated style={{ width: "60%" }} />
              <IonSkeletonText animated style={{ width: "80%" }} />
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  const offlineData = handleOfflineData();

  if (isError && !offlineData) {
    return (
      <IonPage>
        {renderHeader()}
        <IonContent>
          {renderConnectionStatus()}
          <IonCard color="danger">
            <IonCardContent>
              <h2>Error Loading Profile</h2>
              <p>{trpcError?.message || "Unknown error occurred"}</p>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  const displayData = offlineData || userData;

  if (!displayData) return null;

  return (
    <IonPage>
      {renderHeader()}
      <IonContent>
        {renderConnectionStatus()}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>User Profile (Offline Capable)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {displayData.type === "user" ? (
              <>
                <p>
                  <strong>Name:</strong> {displayData.info.first_name} {displayData.info.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {displayData.info.email}
                </p>
              </>
            ) : displayData.type === "caregiver" ? (
              <p>
                <strong>Username:</strong> {displayData.info.username}
              </p>
            ) : null}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default UserProfileOfflinePage;
