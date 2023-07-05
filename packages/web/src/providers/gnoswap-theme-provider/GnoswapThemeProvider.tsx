import { Global, ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { getTheme } from "@utils/themeUtils";
import globalStyle from "@/styles/globalStyle";
import { useAtom } from "jotai";
import { ThemeAtom } from "@atoms/index";

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeKey] = useAtom(ThemeAtom.themeKey);

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
