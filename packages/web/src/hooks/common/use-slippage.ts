import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback, useEffect } from "react";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

export const useSlippage = () => {
  const [slippage, setSlippage] = useAtom(CommonState.slippage || 0);

  useEffect(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, []);

  const changeSlippage = useCallback(
    (slippage: string) => {
      setSlippage(slippage);
    },
    [setSlippage],
  );

  const resetSlippage = useCallback(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, [setSlippage]);

  return { slippage, changeSlippage, resetSlippage };
};
