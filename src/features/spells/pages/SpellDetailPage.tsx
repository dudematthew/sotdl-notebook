import { createOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useSpells } from '../hooks/useSpells';
import { Spell } from '../types/spell';

export const SpellDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { spells } = useSpells();
  const [spell, setSpell] = useState<Spell | null>(null);

  useEffect(() => {
    const foundSpell = spells.find((s) => s.id === id);
    if (foundSpell) {
      setSpell(foundSpell);
    }
  }, [id, spells]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/spellbook" />
          </IonButtons>
          <IonTitle>{spell?.title || 'Loading...'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push(`/tabs/spellbook/spell/${id}/edit`)}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {!spell ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
            <p>Loading spell details...</p>
          </div>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{spell.title}</IonCardTitle>
              <IonCardSubtitle>
                {spell.tradition && <span>{spell.tradition} • </span>}
                {spell.level !== undefined && <span>Level {spell.level}</span>}
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              {spell.area && (
                <p>
                  <strong>Area:</strong> {spell.area}
                </p>
              )}
              {spell.duration && (
                <p>
                  <strong>Duration:</strong> {spell.duration}
                </p>
              )}
              <p className="ion-padding-top">{spell.description}</p>

              {spell.sourceBook && (
                <p className="ion-padding-top">
                  <strong>Source:</strong> {spell.sourceBook}
                </p>
              )}

              {spell.tags && spell.tags.length > 0 && (
                <div className="ion-padding-top">
                  {spell.tags.map((tag) => (
                    <IonChip key={tag}>
                      <IonLabel>{tag}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {spell?.images && spell.images.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Original Images</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {spell.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Original scan of ${spell.title}`}
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
              ))}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
}; 