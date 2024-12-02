import {
  addOutline,
  cloudUploadOutline,
  downloadOutline,
  searchOutline,
} from 'ionicons/icons';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonToast,
  IonSpinner,
} from '@ionic/react';

import { useSpells } from '../hooks/useSpells';

export const SpellListPage: React.FC = () => {
  const location = useLocation();
  const { spells, loading, saving, exportSpells, importSpells, reloadSpells } = useSpells();
  const [searchText, setSearchText] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [present] = useIonToast();

  // Refresh spells when navigating to this page
  useEffect(() => {
    reloadSpells();
  }, [location.pathname, reloadSpells]);

  // Memoize filtered spells to optimize performance
  const filteredSpells = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return spells.filter(
      (spell) =>
        spell.title.toLowerCase().includes(searchLower) ||
        spell.description.toLowerCase().includes(searchLower) ||
        (spell.tradition?.toLowerCase().includes(searchLower) ?? false)
    );
  }, [spells, searchText]);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importSpells(file);
      present({
        message: 'Spells imported successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
    } catch (error) {
      present({
        message: 'Failed to import spells',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
    }
  };

  const handleExport = async () => {
    try {
      await exportSpells();
      present({
        message: 'Spells exported successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
    } catch (error) {
      present({
        message: 'Failed to export spells',
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
          <IonTitle>Spells</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleExport} disabled={saving || loading}>
              <IonIcon slot="icon-only" icon={downloadOutline} />
            </IonButton>
            <IonButton 
              onClick={() => fileInputRef.current?.click()} 
              disabled={saving || loading}
            >
              <IonIcon slot="icon-only" icon={cloudUploadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding-horizontal">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value || '')}
            placeholder="Search spells..."
            debounce={300}
            animated={true}
            showClearButton="always"
            disabled={loading || saving}
            className="spell-searchbar"
          />
        </div>

        {loading ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
            <p>Loading spells...</p>
          </div>
        ) : saving ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
            <p>Saving changes...</p>
          </div>
        ) : filteredSpells.length === 0 ? (
          <div className="ion-padding ion-text-center">
            <p>{searchText ? 'No spells match your search' : 'No spells found'}</p>
            {!searchText && (
              <IonButton routerLink="/tabs/spellbook/new">
                Add your first spell
              </IonButton>
            )}
          </div>
        ) : (
          <IonList>
            {filteredSpells.map((spell) => (
              <IonItem
                key={spell.id}
                routerLink={`/tabs/spellbook/spell/${spell.id}`}
                detail={true}
              >
                <IonLabel>
                  <h2>{spell.title}</h2>
                  <p>
                    {spell.tradition} {spell.level !== undefined && `• Level ${spell.level}`}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleImport}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/tabs/spellbook/new" disabled={saving}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      <style>{`
        .spell-searchbar {
          --background: var(--ion-background-color);
          --box-shadow: none;
          --border-radius: 8px;
          padding: 0;
        }
      `}</style>
    </IonPage>
  );
}; 