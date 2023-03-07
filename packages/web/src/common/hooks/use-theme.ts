import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { ThemeState } from "@/states";

const useTheme = (): [typeof themeMode, typeof toggleTheme] => {
  const [themeMode, setThemeMode] = useRecoilState(ThemeState.darkMode);

  const toggleTheme = useCallback(() => {
    setThemeMode((prevTheme) => prevTheme === "dark" ? "light" : "dark");
  }, [themeMode]);

  return [themeMode, toggleTheme];
};

export default useTheme;