import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

interface ColorProps {
  start: string;
  end: string;
  gradient: string;
}

export const useColorGraph = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  const redColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
        start: "#EA3943B2",
        end: "#EA394324",
        gradient: "#ff020233",
      }
      : {
        start: "#EA3943",
        end: "#EA394333",
        gradient: "#ff020233",
      };
  }, [themeKey]);

  const greenColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
        start: "#16C78AB2",
        end: "#16C78A24",
        gradient: "#00cd2e33",
      }
      : {
        start: "#16C78A",
        end: "#16C78A33",
        gradient: "#00cd2e33",
      };
  }, [themeKey]);

  return { redColor, greenColor };
};
