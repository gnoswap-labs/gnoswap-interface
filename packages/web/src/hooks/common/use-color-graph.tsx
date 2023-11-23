import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

interface ColorProps {
  start: string;
  end: string;
}

export const useColorGraph = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  const redColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
          start: "#EA3943B2",
          end: "#EA394324",
        }
      : {
          start: "#EA3943",
          end: "#EA394333",
        };
  }, [themeKey]);

  const greenColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
          start: "#16C78AB2",
          end: "#16C78A24",
        }
      : {
          start: "#16C78A",
          end: "#16C78A33",
        };
  }, [themeKey]);

  return { redColor, greenColor };
};
