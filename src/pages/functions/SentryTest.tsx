import React from 'react';
import * as Sentry from '@sentry/react';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const SentryTest: React.FC = () => {
  const throwError = () => {
    throw new Error('Test error for Sentry');
  };

  const startTransaction = () => {
    const transaction = Sentry.startTransaction({
      name: 'Test Transaction',
      op: 'test',
    });

    Sentry.configureScope(scope => {
      scope.setSpan(transaction);
    });

    try {
      // Do something that might fail
      throw new Error('Test error in transaction');
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      transaction.finish();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sentry Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <IonButton expand="block" onClick={throwError}>
            Throw Error
          </IonButton>
          <IonButton expand="block" onClick={startTransaction}>
            Start Transaction
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SentryTest;
