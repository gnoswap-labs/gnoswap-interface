import { ThemeState } from "@/states";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { getTheme } from "@utils/themeUtils";
import Footer from "@components/common/footer/Footer";

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const themeKey = useRecoilValue(ThemeState.themeKey);

  const theme = useMemo(() => {
    return getTheme(themeKey);
  }, [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      {children}
      <Footer />
    </ThemeProvider>
  );
};

export default GnoswapThemeProvider;
