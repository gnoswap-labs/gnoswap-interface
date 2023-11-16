import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback } from "react";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";
import { isNumber } from "@utils/number-utils";

export const useSlippage = () => {
  const [slippage, setSlippage] = useAtom(CommonState.slippage || 0);

  const changeSlippage = useCallback(
    (slippage: number) => {
      if (!isNumber(slippage)) {
        setSlippage(0.01);
        return;
      }
      
      const changedSlippage = Math.min(100, Math.max(0.01, slippage));
      setSlippage(changedSlippage);
    },
    [setSlippage],
  );

  const resetSlippage = useCallback(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, [setSlippage]);

  return { slippage, changeSlippage, resetSlippage };
};
