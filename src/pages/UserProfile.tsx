import "./UserProfile.css";

import React, { useEffect } from "react";

import { IonContent, IonItem, IonLabel, IonList, IonPage, IonSkeletonText, IonText } from "@ionic/react";

import { useAuth } from "../AuthContext";
import Header from "../components/Header";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("UserProfile - Auth Data:", {
        user,
        attributes: user.attributes,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <IonPage>
        <Header title="User Profile" showBackButton={false} />
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

  const userData = {
    username: user.username,
    userId: user.userId,
    loginId: user.signInDetails?.loginId,
    authFlowType: user.signInDetails?.authFlowType,
    email: user.attributes?.email,
    createdAt: user.attributes?.created_at ? new Date(user.attributes.created_at).toLocaleDateString() : undefined,
    sub: user.attributes?.sub,
    isVerified: user.attributes?.email_verified,
  };

  return (
    <IonPage>
      <Header title="User Profile" showBackButton={false} />
      <IonContent>
        <IonList>
          {userData.username && (
            <IonItem>
              <IonLabel>
                <h2>Username</h2>
                <IonText>{userData.username}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.userId && (
            <IonItem>
              <IonLabel>
                <h2>User ID</h2>
                <IonText>{userData.userId}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.loginId && (
            <IonItem>
              <IonLabel>
                <h2>Login ID</h2>
                <IonText>{userData.loginId}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.authFlowType && (
            <IonItem>
              <IonLabel>
                <h2>Auth Flow Type</h2>
                <IonText>{userData.authFlowType}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.email && (
            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <IonText>{userData.email}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.createdAt && (
            <IonItem>
              <IonLabel>
                <h2>Account Created</h2>
                <IonText>{userData.createdAt}</IonText>
              </IonLabel>
            </IonItem>
          )}
          {userData.isVerified !== undefined && (
            <IonItem>
              <IonLabel>
                <h2>Email Verified</h2>
                <IonText>{userData.isVerified ? "Yes" : "No"}</IonText>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
