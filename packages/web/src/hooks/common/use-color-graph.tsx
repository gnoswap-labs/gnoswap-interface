import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

interface ColorProps {
  start: string;
  end: string;
  gradient: string;
  startLine: string;
}

export const useColorGraph = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  const redColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
        start: "#EA3943B2",
        end: "#EA394324",
        gradient: "#ff020233",
        startLine: "#FF503F",
        endLine: "#FF503F",
      }
      : {
        start: "#EA3943",
        end: "#EA394333",
        gradient: "#ff020233",
        startLine: "#FF503F",
        endLine: "#FF503F",
      };
  }, [themeKey]);

  const greenColor: ColorProps = useMemo(() => {
    return themeKey === "dark"
      ? {
        start: "#16C78AB2",
        end: "#16C78A24",
        gradient: "#00cd2e33",
        startLine: "#60E66A",
        endLine: "#60E66A",
      }
      : {
        start: "#16C78A",
        end: "#16C78A33",
        gradient: "#00cd2e33",
        startLine: "#60E66A",
        endLine: "#60E66A",
      };
  }, [themeKey]);

  return { redColor, greenColor };
};
