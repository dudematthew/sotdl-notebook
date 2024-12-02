import React from "react";

import { IonButton, IonContent, IonItem, IonList, IonPage, IonText } from "@ionic/react";
import * as Sentry from "@sentry/react";

import Header from "../../components/Header";

const SentryTest: React.FC = () => {
  const throwError = (): never => {
    throw new Error("Test error for Sentry monitoring");
  };

  const captureMessage = (): void => {
    Sentry.captureMessage("This is a test message", "info");
  };

  const captureException = (): void => {
    try {
      throw new Error("Test exception for Sentry");
    } catch (error) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: {
            location: "SentryTest",
            type: "manual_exception",
          },
        });
      }
    }
  };

  const createTransaction = (): void => {
    Sentry.startSpan(
      {
        name: "Test Transaction",
        op: "test",
        forceTransaction: true,
      },
      (span) => {
        if (span) {
          span.setTag("location", "SentryTest");
          span.setTag("type", "manual_exception");
        }

        // Create a child span
        Sentry.startSpan(
          {
            name: "Child Operation",
            op: "test.child",
          },
          (childSpan) => {
            if (childSpan) {
              childSpan.description = "This is a child span";
            }

            setTimeout(() => {
              if (childSpan) {
                childSpan.finish();
              }
              if (span) {
                span.finish();
              }
            }, 2000);
          }
        );
      }
    );
  };

  return (
    <IonPage>
      <Header title="Sentry Testing" />
      <IonContent>
        <IonList>
          <IonItem>
            <IonText>
              <h2>Sentry Integration Testing</h2>
              <p>Use these buttons to test various Sentry features:</p>
            </IonText>
          </IonItem>

          <IonItem>
            <IonButton expand="block" color="danger" onClick={throwError}>
              Throw Error (Crash)
            </IonButton>
          </IonItem>

          <IonItem>
            <IonButton expand="block" color="warning" onClick={captureException}>
              Capture Exception
            </IonButton>
          </IonItem>

          <IonItem>
            <IonButton expand="block" color="primary" onClick={createTransaction}>
              Create Transaction
            </IonButton>
          </IonItem>

          <IonItem>
            <IonButton expand="block" color="secondary" onClick={captureMessage}>
              Send Test Message
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SentryTest;
