import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { IonBackButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

import { AuthContext } from "../AuthContext";
import EnvironmentBanner from "./EnvironmentBanner";

const Header: React.FC<{ title: string; showBackButton?: boolean; children?: React.ReactNode }> = ({
  title,
  showBackButton = true,
  children,
}) => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      await auth?.signOut();
      history.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <IonHeader>
      <EnvironmentBanner />
      <IonToolbar>
        {showBackButton && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs" />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          {children}
          {auth?.user && <IonButton onClick={handleLogout}>Logout</IonButton>}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
