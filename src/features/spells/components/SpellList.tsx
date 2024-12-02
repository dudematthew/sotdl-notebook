import { bookOutline, createOutline, trashOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSkeletonText,
} from '@ionic/react';

import { Spell } from '../types/spell';

interface SpellListProps {
  spells: Spell[];
  loading: boolean;
  onDeleteSpell: (spellId: string) => Promise<void>;
}

export const SpellList: React.FC<SpellListProps> = ({ spells, loading, onDeleteSpell }) => {
  const history = useHistory();

  if (loading) {
    return (
      <IonList>
        {[1, 2, 3].map((i) => (
          <IonItem key={i}>
            <IonLabel>
              <IonSkeletonText animated style={{ width: '60%' }} />
              <p>
                <IonSkeletonText animated style={{ width: '40%' }} />
              </p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    );
  }

  if (spells.length === 0) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>No Spells Found</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>Start by adding your first spell!</p>
          <IonButton expand="block" onClick={() => history.push('/tabs/spellbook/add')}>
            <IonIcon slot="start" icon={createOutline} />
            Add Spell
          </IonButton>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonList>
      {spells.map((spell) => (
        <IonItem key={spell.id} button onClick={() => history.push(`/tabs/spellbook/${spell.id}`)}>
          <IonIcon icon={bookOutline} slot="start" />
          <IonLabel>
            <h2>{spell.title}</h2>
            <p>
              {spell.tradition && <span>{spell.tradition} • </span>}
              {spell.level !== undefined && <span>Level {spell.level} • </span>}
              {spell.source && <span>{spell.source}</span>}
            </p>
          </IonLabel>
          <IonNote slot="end">
            <IonButtons>
              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/tabs/spellbook/${spell.id}/edit`);
                }}
              >
                <IonIcon icon={createOutline} />
              </IonButton>
              <IonButton
                fill="clear"
                color="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSpell(spell.id);
                }}
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonButtons>
          </IonNote>
        </IonItem>
      ))}
    </IonList>
  );
}; 