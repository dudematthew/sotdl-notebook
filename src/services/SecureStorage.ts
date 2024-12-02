import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export class SecureStorage {
  static async set(key: string, value: string): Promise<void> {
    await SecureStoragePlugin.set({
      key,
      value,
    });
  }

  static async get(key: string): Promise<string | null> {
    try {
      const { value } = await SecureStoragePlugin.get({ key });
      return value;
    } catch (error) {
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    await SecureStoragePlugin.remove({ key });
  }

  static async clear(): Promise<void> {
    await SecureStoragePlugin.clear();
  }
}
