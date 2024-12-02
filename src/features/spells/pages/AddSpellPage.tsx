import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { SpellForm } from '../components/SpellForm';
import { useSpells } from '../hooks/useSpells';
import { Spell } from '../types/spell';

export const AddSpellPage: React.FC = () => {
  const history = useHistory();
  const { addSpell } = useSpells();

  const handleSubmit = async (spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addSpell(spellData);
      history.push('/tabs/spellbook');
    } catch (error) {
      console.error('Error adding spell:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/spellbook" />
          </IonButtons>
          <IonTitle>Add Spell</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <SpellForm onSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}; 