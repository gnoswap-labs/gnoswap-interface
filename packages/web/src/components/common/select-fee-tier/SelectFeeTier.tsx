import React, { useCallback, useMemo } from "react";
import { SelectFeeTierItemWrapper, SelectFeeTierWrapper } from "./SelectFeeTier.styles";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";

interface SelectFeeTierProps {
  feetierOfLiquidityMap: { [key in string]: number };
  feeTiers: SwapFeeTierType[];
  feeTier: SwapFeeTierType | null;
  pools: PoolModel[],
  selectFeeTier: (feeTier: SwapFeeTierType) => void;
}

const SelectFeeTier: React.FC<SelectFeeTierProps> = ({
  feetierOfLiquidityMap,
  feeTiers,
  feeTier,
  pools,
  selectFeeTier,
}) => {

  const onClickFeeTierItem = useCallback((feeTier: SwapFeeTierType) => {
    selectFeeTier(feeTier);
  }, [selectFeeTier]);

  return (
    <SelectFeeTierWrapper>
      {feeTiers.map((item, index) => (
        <SelectFeeTierItem
          key={index}
          selected={feeTier === item}
          feeTier={item}
          pools={pools}
          liquidityRange={feetierOfLiquidityMap[SwapFeeTierInfoMap[item].fee]}
          onClick={() => onClickFeeTierItem(item)}
        />
      ))}
    </SelectFeeTierWrapper>
  );
};

interface SelectFeeTierItemProps {
  selected: boolean;
  feeTier: SwapFeeTierType;
  pools: PoolModel[];
  liquidityRange: number | undefined | null;
  onClick: () => void;
}

const SelectFeeTierItem: React.FC<SelectFeeTierItemProps> = ({
  selected,
  feeTier,
  liquidityRange,
  onClick,
}) => {
  const feeRateStr = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].rateStr;
  }, [feeTier]);

  const rangeStr = useMemo(() => {
    if (liquidityRange === null || liquidityRange === undefined) {
      return "Not created";
    }
    return `${Math.round(liquidityRange)}% selected`;
  }, [liquidityRange]);

  const description = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].description;
  }, [feeTier]);

  return (
    <SelectFeeTierItemWrapper className={selected ? "selected" : ""} onClick={onClick}>
      <div>
        <strong className="fee-rate">{feeRateStr}</strong>
        <p className="desc">{description}</p>
      </div>
      <span className="selected-fee-rate">{rangeStr}</span>
    </SelectFeeTierItemWrapper>
  );
};


export default SelectFeeTier;
