import { Preferences } from '@capacitor/preferences';
import { useCallback, useEffect, useState } from 'react';

import { Spell } from '../types/spell';

const SPELLS_STORAGE_KEY = 'spells';

export const useSpells = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSpells = useCallback(async () => {
    try {
      setLoading(true);
      const { value } = await Preferences.get({ key: SPELLS_STORAGE_KEY });
      if (value) {
        setSpells(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading spells:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpells();
  }, [loadSpells]);

  const saveSpells = async (updatedSpells: Spell[]) => {
    try {
      setSaving(true);
      await Preferences.set({
        key: SPELLS_STORAGE_KEY,
        value: JSON.stringify(updatedSpells),
      });
      setSpells(updatedSpells);
    } catch (error) {
      console.error('Error saving spells:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const addSpell = async (spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSpell: Spell = {
      ...spellData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedSpells = [...spells, newSpell];
    await saveSpells(updatedSpells);
    return newSpell;
  };

  const updateSpell = async (
    id: string,
    spellData: Omit<Spell, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const updatedSpells = spells.map((spell) =>
      spell.id === id
        ? {
            ...spell,
            ...spellData,
            updatedAt: Date.now(),
          }
        : spell
    );

    await saveSpells(updatedSpells);
    return updatedSpells.find(spell => spell.id === id);
  };

  const deleteSpell = async (id: string) => {
    const updatedSpells = spells.filter((spell) => spell.id !== id);
    await saveSpells(updatedSpells);
  };

  const exportSpells = async () => {
    const exportData = {
      version: '1.0',
      timestamp: Date.now(),
      spells,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sotdl-spells-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSpells = async (file: File) => {
    try {
      setSaving(true);
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.version || !importData.spells || !Array.isArray(importData.spells)) {
        throw new Error('Invalid import file format');
      }

      // Merge imported spells with existing ones, avoiding duplicates
      const mergedSpells = [...spells];
      for (const importedSpell of importData.spells) {
        const existingIndex = mergedSpells.findIndex((s) => s.id === importedSpell.id);
        if (existingIndex === -1) {
          mergedSpells.push(importedSpell);
        } else {
          // Update existing spell if imported one is newer
          if (importedSpell.updatedAt > mergedSpells[existingIndex].updatedAt) {
            mergedSpells[existingIndex] = importedSpell;
          }
        }
      }

      await saveSpells(mergedSpells);
    } catch (error) {
      console.error('Error importing spells:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    spells,
    loading,
    saving,
    addSpell,
    updateSpell,
    deleteSpell,
    exportSpells,
    importSpells,
    reloadSpells: loadSpells,
  };
}; 