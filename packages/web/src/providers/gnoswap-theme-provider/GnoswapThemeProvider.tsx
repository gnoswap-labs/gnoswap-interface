import { ThemeState } from "@/states";
import { Global, ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { getTheme } from "@utils/themeUtils";
import globalStyle from "@/styles/globalStyle";

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const themeKey = useRecoilValue(ThemeState.themeKey);

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
