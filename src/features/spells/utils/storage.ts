import { Preferences } from '@capacitor/preferences';
import { Spell, SpellImage } from '../types/spell';

const SPELLS_STORAGE_KEY = 'spells';
const SPELL_IMAGES_STORAGE_KEY = 'spell_images';

export class SpellStorage {
  static async getSpells(): Promise<Spell[]> {
    const { value } = await Preferences.get({ key: SPELLS_STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  static async saveSpells(spells: Spell[]): Promise<void> {
    await Preferences.set({
      key: SPELLS_STORAGE_KEY,
      value: JSON.stringify(spells),
    });
  }

  static async addSpell(spell: Spell): Promise<void> {
    const spells = await this.getSpells();
    spells.push(spell);
    await this.saveSpells(spells);
  }

  static async updateSpell(updatedSpell: Spell): Promise<void> {
    const spells = await this.getSpells();
    const index = spells.findIndex((spell) => spell.id === updatedSpell.id);
    if (index !== -1) {
      spells[index] = updatedSpell;
      await this.saveSpells(spells);
    }
  }

  static async deleteSpell(spellId: string): Promise<void> {
    const spells = await this.getSpells();
    const filteredSpells = spells.filter((spell) => spell.id !== spellId);
    await this.saveSpells(filteredSpells);
  }

  static async getSpellImages(): Promise<SpellImage[]> {
    const { value } = await Preferences.get({ key: SPELL_IMAGES_STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  static async saveSpellImages(images: SpellImage[]): Promise<void> {
    await Preferences.set({
      key: SPELL_IMAGES_STORAGE_KEY,
      value: JSON.stringify(images),
    });
  }

  static async addSpellImage(image: SpellImage): Promise<void> {
    const images = await this.getSpellImages();
    images.push(image);
    await this.saveSpellImages(images);
  }

  static async deleteSpellImage(imageId: string): Promise<void> {
    const images = await this.getSpellImages();
    const filteredImages = images.filter((image) => image.id !== imageId);
    await this.saveSpellImages(filteredImages);
  }

  static async exportData(): Promise<string> {
    const spells = await this.getSpells();
    const images = await this.getSpellImages();
    return JSON.stringify({
      spells,
      images,
    });
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      if (data.spells) {
        await this.saveSpells(data.spells);
      }
      if (data.images) {
        await this.saveSpellImages(data.images);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }
} 