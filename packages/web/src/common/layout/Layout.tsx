import { ThemeState } from "@/states";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ChildrenProps } from "../types/global-prop-types";
import { getTheme } from "@utils/themeUtils";

const GnoswapThemeProvider = ({ children }: ChildrenProps) => {
  const themeKey = useRecoilValue(ThemeState.themeMode);

  const theme = useMemo(() => {
    return getTheme(themeKey);
  }, [themeKey]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GnoswapThemeProvider;
