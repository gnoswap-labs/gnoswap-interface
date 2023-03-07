import { atom } from "recoil";

const themeStoreKey = 'app_theme';
type ThemeKeyType = 'light' | 'dark';
const store = typeof window !== 'undefined' ? window.localStorage : null;

export const darkMode = atom<ThemeKeyType>({
  key: "theme/darkMode",
  default: 'dark',
  effects: [({ setSelf, onSet }) => {
    if (store) {
      const savedValue = store.getItem(themeStoreKey);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue, _, isReset) => {
        isReset ? store.removeItem(themeStoreKey) : store.setItem(themeStoreKey, JSON.stringify(newValue));
      });
    }
  }]
});