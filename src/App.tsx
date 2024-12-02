/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Theme variables */
import "./theme/variables.css";

import { bookOutline, codeOutline, informationCircleOutline } from "ionicons/icons";
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";

import { LiveUpdate } from "@capawesome/capacitor-live-update";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import DetailedErrorBoundary from "./components/DetailedErrorBoundary";
import EnvironmentBanner from "./components/EnvironmentBanner";
import BiometricAuthPage from "./pages/functions/BiometricAuthPage";
import CameraPage from "./pages/functions/CameraPage";
import FileExplorerPage from "./pages/functions/FileExplorerPage";
import LocalNotificationPage from "./pages/functions/LocalNotificationPage";
import LocationPage from "./pages/functions/LocationPage";
import PushNotificationPage from "./pages/functions/PushNotificationPage";
import SentryTest from "./pages/functions/SentryTest";
import FunctionsPage from "./pages/FunctionsPage";
import InfoPage from "./pages/InfoPage";
import SpellbookPage from "./pages/SpellbookPage";
import UnknownRoute from "./pages/UnknownRoute";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const result = await LiveUpdate.sync();
        if (result.nextBundleId) {
          console.log("Update available:", result.nextBundleId);
        }
      } catch (error) {
        console.error("Update check failed:", error);
      }
    };

    void checkForUpdates();
  }, []);

  return (
    <DetailedErrorBoundary>
      <IonApp>
        <EnvironmentBanner />
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/tabs">
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/tabs/spellbook">
                    <SpellbookPage />
                  </Route>
                  <Route exact path="/tabs/functions">
                    <FunctionsPage />
                  </Route>
                  <Route exact path="/tabs/info">
                    <InfoPage />
                  </Route>
                  <Route exact path="/tabs">
                    <Redirect to="/tabs/spellbook" />
                  </Route>
                  {/* Keep function pages for reference */}
                  <Route exact path="/tabs/functions/location">
                    <LocationPage />
                  </Route>
                  <Route exact path="/tabs/functions/push-notifications">
                    <PushNotificationPage />
                  </Route>
                  <Route exact path="/tabs/functions/biometric-auth">
                    <BiometricAuthPage />
                  </Route>
                  <Route exact path="/tabs/functions/local-notifications">
                    <LocalNotificationPage />
                  </Route>
                  <Route exact path="/tabs/functions/sentry-test">
                    <SentryTest />
                  </Route>
                  <Route exact path="/tabs/functions/camera">
                    <CameraPage />
                  </Route>
                  <Route exact path="/tabs/functions/file-explorer">
                    <FileExplorerPage />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="spellbook" href="/tabs/spellbook">
                    <IonIcon icon={bookOutline} />
                    <IonLabel>Spellbook</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="functions" href="/tabs/functions">
                    <IonIcon icon={codeOutline} />
                    <IonLabel>Dev Tools</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="info" href="/tabs/info">
                    <IonIcon icon={informationCircleOutline} />
                    <IonLabel>Info</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </Route>
            <Route exact path="/">
              <Redirect to="/tabs/spellbook" />
            </Route>
            <Route>
              <UnknownRoute />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </DetailedErrorBoundary>
  );
};

export default App;
