import { ThemeKeys } from "@styles/ThemeTypes";
import { atom } from "recoil";

const gnoswap_theme_key = "app_theme";
const store = typeof window !== "undefined" ? window.localStorage : null;

export const themeKey = atom<ThemeKeys>({
  key: "theme/themeKey",
  default: "dark",
  effects: [
    ({ setSelf, onSet }) => {
      if (store) {
        const savedValue = store.getItem(gnoswap_theme_key);
        if (savedValue != null) {
          setSelf(JSON.parse(savedValue));
        }
        onSet((newValue, _, isReset) => {
          isReset
            ? store.removeItem(gnoswap_theme_key)
            : store.setItem(gnoswap_theme_key, JSON.stringify(newValue));
        });
      }
    },
  ],
});
