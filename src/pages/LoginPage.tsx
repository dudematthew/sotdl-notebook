import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";

import { AuthContext } from "../AuthContext";
import Header from "../components/Header";

interface LocationState {
  from: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState(import.meta.env.VITE_COGNITO_TEST_USERNAME || "");
  const [password, setPassword] = useState(import.meta.env.VITE_COGNITO_TEST_PASSWORD || "");
  const [error, setError] = useState("");

  const navigate = useHistory();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || "/tabs";

  const handleLogin = async () => {
    try {
      await auth?.signIn(username, password);
      navigate.replace(from);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid credentials";
      setError(errorMessage);
    }
  };

  return (
    <IonPage>
      <Header title="Login" />
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
        </IonItem>
        {error && (
          <div className="ion-padding ion-text-center" style={{ color: "red" }}>
            {error}
          </div>
        )}
        <div className="ion-padding">
          <IonButton expand="block" onClick={handleLogin}>
            Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
