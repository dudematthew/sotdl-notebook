import React from "react";
import { IonContent, IonContentProps } from "@ionic/react";

const SafeAreaContent: React.FC<IonContentProps> = ({ children, ...props }) => {
  return (
    <IonContent {...props} className="ion-padding-safe">
      {children}
    </IonContent>
  );
};

export default SafeAreaContent;
