import React, { useState } from 'react';

import {
  IonButton,
  IonContent,
  IonFab,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonSpinner,
} from '@ionic/react';

import { Spell, SpellLanguage } from '../types/spell';
import { SpellOCR } from './SpellOCR';

interface SpellFormProps {
  spell?: Spell;
  onSubmit: (spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const SpellForm: React.FC<SpellFormProps> = ({ 
  spell, 
  onSubmit,
  disabled = false,
  loading = false,
}) => {
  const [title, setTitle] = useState(spell?.title || '');
  const [area, setArea] = useState(spell?.area || '');
  const [duration, setDuration] = useState(spell?.duration || '');
  const [description, setDescription] = useState(spell?.description || '');
  const [tradition, setTradition] = useState(spell?.tradition || '');
  const [level, setLevel] = useState<number | undefined>(spell?.level);
  const [language, setLanguage] = useState<SpellLanguage>(SpellLanguage.ENGLISH);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || loading) return;

    await onSubmit({
      title,
      area,
      duration,
      description,
      tradition,
      level,
      images: spell?.images || [],
    });
  };

  const handleOCRComplete = (data: {
    title?: string;
    area?: string;
    duration?: string;
    description?: string;
  }) => {
    if (data.title) setTitle(data.title);
    if (data.area) setArea(data.area);
    if (data.duration) setDuration(data.duration);
    if (data.description) setDescription(data.description);
  };

  const isDisabled = disabled || loading;

  return (
    <form onSubmit={handleSubmit} className="ion-padding">
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Language</IonLabel>
          <IonSelect
            value={language}
            onIonChange={(e) => setLanguage(e.detail.value)}
            disabled={isDisabled}
          >
            <IonSelectOption value={SpellLanguage.ENGLISH}>English</IonSelectOption>
            <IonSelectOption value={SpellLanguage.POLISH}>Polish</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Title</IonLabel>
          <IonInput
            value={title}
            onIonChange={(e) => setTitle(e.detail.value || '')}
            required
            placeholder="Enter spell title"
            disabled={isDisabled}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Area</IonLabel>
          <IonInput
            value={area}
            onIonChange={(e) => setArea(e.detail.value || '')}
            placeholder="Enter spell area"
            disabled={isDisabled}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Duration</IonLabel>
          <IonInput
            value={duration}
            onIonChange={(e) => setDuration(e.detail.value || '')}
            placeholder="Enter spell duration"
            disabled={isDisabled}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={(e) => setDescription(e.detail.value || '')}
            required
            rows={6}
            placeholder="Enter spell description"
            disabled={isDisabled}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Tradition</IonLabel>
          <IonInput
            value={tradition}
            onIonChange={(e) => setTradition(e.detail.value || '')}
            placeholder="Enter spell tradition"
            disabled={isDisabled}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Level</IonLabel>
          <IonInput
            type="number"
            min={0}
            max={10}
            value={level}
            onIonChange={(e) => {
              const val = e.detail.value;
              setLevel(val ? parseInt(val, 10) : undefined);
            }}
            placeholder="Enter spell level"
            disabled={isDisabled}
          />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton 
          expand="block" 
          type="submit"
          disabled={isDisabled}
        >
          {isDisabled ? (
            <>
              <IonSpinner name="dots" />
              <span className="ion-padding-start">
                {loading ? 'Loading...' : spell ? 'Updating...' : 'Adding...'}
              </span>
            </>
          ) : (
            spell ? 'Update Spell' : 'Add Spell'
          )}
        </IonButton>
      </div>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <SpellOCR onOCRComplete={handleOCRComplete} language={language} />
      </IonFab>
    </form>
  );
}; 