import theme, { darkTheme } from "@/styles/theme";

export const getTheme = (themeKey: string) => {
  return { ...theme, colors: darkTheme };
};
