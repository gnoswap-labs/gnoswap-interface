import { Global, ThemeProvider } from "@emotion/react";
import { useEffect, useMemo } from "react";
import { getTheme } from "@utils/theme-utils";
import globalStyle from "@styles/globalStyle";
import { useAtom } from "jotai";
import { ThemeState } from "@states/index";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DeviceSize } from "@styles/media";

const GnoswapThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeKey] = useAtom(ThemeState.themeKey);
  const { breakpoint, handleBreakpoint } = useWindowSize();

  useEffect(() => {
    handleWindowSize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowSize);
      return () => {
        window.removeEventListener("resize", handleWindowSize);
      };
    }
  }, [breakpoint]);

  const handleWindowSize = () => {
    handleBreakpoint(window?.innerWidth || DeviceSize.WEB);
  };

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
