import React from "react";

import { IonText, IonToolbar } from "@ionic/react";

const EnvironmentBanner: React.FC = () => {
  const isDev = import.meta.env.DEV;
  if (!isDev) return null;

  return (
    <IonToolbar color="warning" style={{ height: "auto", padding: "0px 5px" }}>
      <IonText slot="start" style={{ height: "18px" }}>
        DEV
      </IonText>
    </IonToolbar>
  );
};

export default EnvironmentBanner;
