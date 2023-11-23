import { Global, ThemeProvider } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { getTheme } from "@utils/theme-utils";
import globalStyle from "@styles/globalStyle";
import { useAtom } from "jotai";
import { ThemeState } from "@states/index";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DeviceSize } from "@styles/media";
import { GNOSWAP_THEME_KEY } from "@states/theme";

const getInitialThemeValue = () => {
  const storedTheme = localStorage.getItem(GNOSWAP_THEME_KEY);
  return storedTheme !== null ? storedTheme.slice(1, -1) as any : "light";
};

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeKey] = useAtom(ThemeState.themeKey);
  const [currentTheme, setCurrentTheme] = useState(null);
  const { breakpoint, handleBreakpoint } = useWindowSize();

  useEffect(() => {
    setCurrentTheme(themeKey as any);
  }, [themeKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleWindowSize();
      window.addEventListener("resize", handleWindowSize);
      return () => {
        window.removeEventListener("resize", handleWindowSize);
      };
    }
  }, [breakpoint]);

  function handleWindowSize() {
    handleBreakpoint(window?.innerWidth || DeviceSize.WEB);
  }

  useEffect(() => {
    const initialTheme = getInitialThemeValue();
    console.log(initialTheme);
    
    setCurrentTheme(initialTheme as any);
  }, []);

  const theme = useMemo(() => {
    return getTheme(currentTheme as any);
  }, [currentTheme]);

  if (!currentTheme) return null;

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      {children}
    </ThemeProvider>
  );
};

export default GnoswapThemeProvider;
