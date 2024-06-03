import { ThemeKeys } from "@styles/ThemeTypes";
import { atomWithStorage } from "jotai/utils";

export const GNOSWAP_THEME_KEY = "app_theme";

export const themeKey = atomWithStorage<ThemeKeys>(GNOSWAP_THEME_KEY, "dark");
