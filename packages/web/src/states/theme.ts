import { atom } from "recoil";

export const themeMode = atom<"dark" | "light">({
  key: "theme/themeMode",
  default: "dark",
});
