import { ThemeState } from "@/states";
import theme, { darkTheme, lightTheme } from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ChildrenProps } from "../types/global-prop-types";

const GnoswapThemeProvider = ({ children }: ChildrenProps) => {
  const themeMode = useRecoilValue(ThemeState.darkMode);

  return (
    <ThemeProvider
      theme={{
        ...theme,
        colors: themeMode === "dark" ? darkTheme : lightTheme,
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export default GnoswapThemeProvider;
