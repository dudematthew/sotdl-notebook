import React, { Component, ErrorInfo } from "react";

import { IonButton, IonContent, IonItem, IonLabel, IonList, IonPage, IonText } from "@ionic/react";
import * as Sentry from "@sentry/react";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class DetailedErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🔴 Detailed Error Boundary caught an error:", {
      error,
      componentStack: errorInfo.componentStack,
    });

    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        additional: {
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString(),
        },
      },
      tags: {
        errorBoundary: "DetailedErrorBoundary",
        errorType: error.name,
      },
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <IonPage>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h1>Something went wrong</h1>
                  <IonText color="danger">
                    <h2>{this.state.error.name}</h2>
                    <p>{this.state.error.message}</p>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.error.stack}</pre>
                    <h3>Component Stack:</h3>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.errorInfo?.componentStack}</pre>
                  </IonText>
                  <IonButton expand="block" color="medium" onClick={() => Sentry.showReportDialog()}>
                    Report Feedback
                  </IonButton>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPage>
      );
    }

    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(DetailedErrorBoundary, {
  showDialog: true,
});
