import React from "react";
import { IonContent } from "@ionic/react";

const SafeAreaContent: React.FC<React.ComponentProps<typeof IonContent>> = ({ children, ...props }) => {
  return (
    <IonContent {...props} className="ion-padding-safe">
      {children}
    </IonContent>
  );
};

export default SafeAreaContent;
