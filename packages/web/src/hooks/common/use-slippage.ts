import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback, useEffect } from "react";
import { DEFAULT_SLIPPAGE } from "@constants/option.constant";

interface UseSlippageOptions {
  /**
   * Resets the shared setting to the default when the consumer mounts. The
   * Swap, DCA and Limit forms share one selection across their tabs and opt
   * out, so switching modes keeps the user's tolerance.
   */
  resetOnMount?: boolean;
}

export const useSlippage = ({ resetOnMount = true }: UseSlippageOptions = {}) => {
  const [slippage, setSlippage] = useAtom(CommonState.slippage || 0);

  useEffect(() => {
    if (resetOnMount) setSlippage(DEFAULT_SLIPPAGE);
  }, []);

  const changeSlippage = useCallback(
    (slippage: number) => {
      setSlippage(slippage);
    },
    [setSlippage],
  );

  const resetSlippage = useCallback(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, [setSlippage]);

  return { slippage, changeSlippage, resetSlippage };
};
