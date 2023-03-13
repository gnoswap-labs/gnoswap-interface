import { ThemeState } from "@/states";
import { ThemeProvider } from "@emotion/react";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ChildrenProps } from "../types/global-prop-types";
import { getTheme } from "@utils/themeUtils";
import Footer from "@components/common/footer/Footer";

const GnoswapThemeProvider = ({ children }: ChildrenProps) => {
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
