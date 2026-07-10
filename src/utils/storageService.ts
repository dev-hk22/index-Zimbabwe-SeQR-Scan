import { createMMKV, MMKV } from 'react-native-mmkv';

// Initialize MMKV instance
export const storage = createMMKV()

// Create a wrapper for MMKV to match redux-persist's Storage interface
export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve();
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return Promise.resolve(value || null);
    },
    removeItem: (key: string) => {
        storage.remove(key);
        return Promise.resolve();
    },
};