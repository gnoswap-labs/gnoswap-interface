import React, { useCallback, useMemo } from "react";
import { SelectPriceRangeCutomControllerWrapper } from "./SelectPriceRangeCutomController.styles";
import BigNumber from "bignumber.js";

export interface SelectPriceRangeCutomControllerProps {
  title: string;
  token0Symbol: string;
  token1Symbol: string;
  current?: string;
  decrease: () => void;
  increase: () => void;
}

const SelectPriceRangeCutomController: React.FC<SelectPriceRangeCutomControllerProps> = ({
  title,
  token0Symbol,
  token1Symbol,
  current,
  decrease,
  increase,
}) => {

  const tokenInfo = useMemo(() => {
    return `${token0Symbol} per ${token1Symbol}`;
  }, [token0Symbol, token1Symbol]);

  const currentPriceStr = useMemo(() => {
    if (!current) {
      return "-";
    }
    return BigNumber(current).toFixed(4);
  }, [current]);

  const onClickDecrease = useCallback(() => {
    decrease();
  }, [decrease]);

  const onClickIncrease = useCallback(() => {
    increase();
  }, [increase]);

  return (
    <SelectPriceRangeCutomControllerWrapper>
      <span className="title">{title}</span>
      <div className="controller-wrapper">
        <div className="icon-wrapper decrease" onClick={onClickDecrease}>
          <span>-</span>
        </div>
        <div className="value-wrapper">
          <span className="value">{currentPriceStr}</span>
        </div>
        <div className="icon-wrapper increase" onClick={onClickIncrease}>
          <span>+</span>
        </div>
      </div>

      <div className="token-info-wrapper">
        <span className="token-info">{tokenInfo}</span>
      </div>
    </SelectPriceRangeCutomControllerWrapper>
  );
};
export default SelectPriceRangeCutomController;