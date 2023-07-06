import { Global, ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { getTheme } from "@utils/theme-utils";
import globalStyle from "@styles/globalStyle";
import { useAtom } from "jotai";
import { ThemeState } from "@states/index";

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeKey] = useAtom(ThemeState.themeKey);

  const theme = useMemo(() => {
    return getTheme(themeKey);
  }, [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle} />
      {children}
    </ThemeProvider>
  );
};

export default GnoswapThemeProvider;
