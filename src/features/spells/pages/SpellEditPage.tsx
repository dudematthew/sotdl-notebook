import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  IonSpinner,
} from '@ionic/react';

import { SpellForm } from '../components/SpellForm';
import { useSpells } from '../hooks/useSpells';
import { Spell } from '../types/spell';

export const SpellEditPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const history = useHistory();
  const { spells, addSpell, updateSpell, loading: spellsLoading, saving, reloadSpells } = useSpells();
  const [spell, setSpell] = useState<Spell | null>(null);
  const [present] = useIonToast();
  const isAddMode = location.pathname === '/tabs/spellbook/new';

  useEffect(() => {
    if (!isAddMode && id) {
      const foundSpell = spells.find((s) => s.id === id);
      if (foundSpell) {
        setSpell(foundSpell);
      } else if (!spellsLoading) {
        history.push('/tabs/spellbook');
      }
    }
  }, [id, spells, history, isAddMode, spellsLoading]);

  const handleSubmit = async (spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isAddMode) {
        const newSpell = await addSpell(spellData);
        setSpell(newSpell);
        present({
          message: 'Spell added successfully',
          duration: 2000,
          position: 'bottom',
          color: 'success',
        });
      } else if (id && spell) {
        const updatedSpell = await updateSpell(id, spellData);
        if (updatedSpell) {
          setSpell(updatedSpell);
        }
        present({
          message: 'Spell updated successfully',
          duration: 2000,
          position: 'bottom',
          color: 'success',
        });
      }
      
      // Ensure spells are reloaded before navigating
      await reloadSpells();
      history.push('/tabs/spellbook');
    } catch (error) {
      console.error('Error saving spell:', error);
      present({
        message: 'Error saving spell',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/spellbook" />
          </IonButtons>
          <IonTitle>
            {isAddMode ? 'Add Spell' : spell ? `Edit ${spell.title}` : 'Loading...'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {(!isAddMode && !spell && spellsLoading) ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
            <p>Loading spell details...</p>
          </div>
        ) : (
          <SpellForm
            spell={isAddMode ? undefined : spell || undefined}
            onSubmit={handleSubmit}
            disabled={saving}
            loading={spellsLoading}
          />
        )}
      </IonContent>
    </IonPage>
  );
}; 