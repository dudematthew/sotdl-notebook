/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional PWA Elements */
import { defineCustomElements } from '@ionic/pwa-elements/loader';
/* Theme variables */
import "./theme/variables.css";

import { bookOutline, codeOutline, informationCircleOutline } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";

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
import { SpellDetailPage } from "./features/spells/pages/SpellDetailPage";
import { SpellEditPage } from "./features/spells/pages/SpellEditPage";
import { SpellListPage } from "./features/spells/pages/SpellListPage";
import BiometricAuthPage from "./pages/functions/BiometricAuthPage";
import CameraPage from "./pages/functions/CameraPage";
import FileExplorerPage from "./pages/functions/FileExplorerPage";
import LocalNotificationPage from "./pages/functions/LocalNotificationPage";
import LocationPage from "./pages/functions/LocationPage";
import PushNotificationPage from "./pages/functions/PushNotificationPage";
import SentryTest from "./pages/functions/SentryTest";
import FunctionsPage from "./pages/FunctionsPage";
import InfoPage from "./pages/InfoPage";
import UnknownRoute from "./pages/UnknownRoute";

// Initialize PWA Elements
defineCustomElements(window);

setupIonicReact();

const isDevelopment = import.meta.env.DEV;

const App: React.FC = () => {
  return (
    <DetailedErrorBoundary>
      <IonApp>
        <EnvironmentBanner />
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/tabs">
              <IonTabs>
                <IonRouterOutlet>
                  {/* Spellbook routes */}
                  <Route exact path="/tabs/spellbook" component={SpellListPage} />
                  <Route exact path="/tabs/spellbook/new" component={SpellEditPage} />
                  <Route exact path="/tabs/spellbook/spell/:id" component={SpellDetailPage} />
                  <Route exact path="/tabs/spellbook/spell/:id/edit" component={SpellEditPage} />

                  {/* Development-only routes */}
                  {isDevelopment && (
                    <>
                      <Route exact path="/tabs/functions" component={FunctionsPage} />
                      <Route exact path="/tabs/info" component={InfoPage} />
                      <Route exact path="/tabs/functions/location" component={LocationPage} />
                      <Route exact path="/tabs/functions/push-notifications" component={PushNotificationPage} />
                      <Route exact path="/tabs/functions/biometric-auth" component={BiometricAuthPage} />
                      <Route exact path="/tabs/functions/local-notifications" component={LocalNotificationPage} />
                      <Route exact path="/tabs/functions/sentry-test" component={SentryTest} />
                      <Route exact path="/tabs/functions/camera" component={CameraPage} />
                      <Route exact path="/tabs/functions/file-explorer" component={FileExplorerPage} />
                    </>
                  )}

                  <Route exact path="/tabs">
                    <Redirect to="/tabs/spellbook" />
                  </Route>
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                  <IonTabButton tab="spellbook" href="/tabs/spellbook">
                    <IonIcon icon={bookOutline} />
                    <IonLabel>Spellbook</IonLabel>
                  </IonTabButton>
                  {isDevelopment && (
                    <>
                      <IonTabButton tab="functions" href="/tabs/functions">
                        <IonIcon icon={codeOutline} />
                        <IonLabel>Dev Tools</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="info" href="/tabs/info">
                        <IonIcon icon={informationCircleOutline} />
                        <IonLabel>Info</IonLabel>
                      </IonTabButton>
                    </>
                  )}
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
