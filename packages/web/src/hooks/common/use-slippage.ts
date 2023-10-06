import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { useCallback } from "react";
import { toDecimalNumber } from "@utils/number-utils";

const DEFAULT_SLIPPAGE = 0.5;

export const useSlippage = () => {
  const [slippage, setSlippage] = useAtom(CommonState.slippage);

  const changeSlippage = useCallback(
    (slippage: number) => {
      let changedSlippage = slippage;
      if (slippage < 0) {
        changedSlippage = 0;
      } else if (slippage > 100) {
        changedSlippage = 100;
      }
      changedSlippage = toDecimalNumber(changedSlippage);
      setSlippage(changedSlippage);
    },
    [setSlippage],
  );

  const resetSlippage = useCallback(() => {
    setSlippage(DEFAULT_SLIPPAGE);
  }, [setSlippage]);

  return { slippage, changeSlippage, resetSlippage };
};
