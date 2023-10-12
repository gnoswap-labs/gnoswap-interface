import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback } from "react";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

export const useSlippage = () => {
  const [slippage, setSlippage] = useAtom(CommonState.slippage);

  const changeSlippage = useCallback(
    (slippage: number) => {
      const changedSlippage = Math.min(100, Math.max(0, slippage));
      setSlippage(changedSlippage);
    },
    [setSlippage],
  );

  const resetSlippage = useCallback(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, [setSlippage]);

  return { slippage, changeSlippage, resetSlippage };
};
