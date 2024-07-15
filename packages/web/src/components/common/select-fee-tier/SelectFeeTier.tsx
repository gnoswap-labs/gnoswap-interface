import React, { useCallback, useMemo } from "react";
import {
  SelectFeeTierItemWrapper,
  SelectFeeTierWrapper,
} from "./SelectFeeTier.styles";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

interface SelectFeeTierProps {
  feetierOfLiquidityMap: { [key in string]: number };
  feeTiers: SwapFeeTierType[];
  feeTier: SwapFeeTierType | null;
  pools: PoolModel[];
  selectFeeTier: (feeTier: SwapFeeTierType) => void;
  fetching: boolean;
  openedFeeTier: boolean;
}

const SelectFeeTier: React.FC<SelectFeeTierProps> = ({
  feetierOfLiquidityMap,
  feeTiers,
  feeTier,
  selectFeeTier,
  fetching,
  openedFeeTier,
}) => {
  const onClickFeeTierItem = useCallback(
    (feeTier: SwapFeeTierType) => {
      selectFeeTier(feeTier);
    },
    [selectFeeTier],
  );

  return (
    <SelectFeeTierWrapper className={openedFeeTier ? "open" : ""}>
      {feeTiers.map((item, index) => (
        <SelectFeeTierItem
          key={index}
          selected={feeTier === item}
          feeTier={item}
          liquidityRange={feetierOfLiquidityMap[SwapFeeTierInfoMap[item].fee]}
          onClick={() => onClickFeeTierItem(item)}
          fetching={fetching}
        />
      ))}
    </SelectFeeTierWrapper>
  );
};

interface SelectFeeTierItemProps {
  selected: boolean;
  feeTier: SwapFeeTierType;
  liquidityRange: number | undefined | null;
  onClick: () => void;
  fetching: boolean;
}

const SelectFeeTierItem: React.FC<SelectFeeTierItemProps> = ({
  selected,
  feeTier,
  liquidityRange,
  onClick,
  fetching,
}) => {
  const feeRateStr = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].rateStr;
  }, [feeTier]);

  const rangeStr = useMemo(() => {
    if (liquidityRange === null || liquidityRange === undefined) {
      return "Not created";
    }
    return `${Math.round(liquidityRange)}% Selected`;
  }, [liquidityRange]);

  const description = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].description;
  }, [feeTier]);

  return (
    <SelectFeeTierItemWrapper
      className={selected ? "selected" : ""}
      onClick={onClick}
    >
      <div>
        <strong className="fee-rate">{feeRateStr}</strong>
        <p className="desc">{description}</p>
      </div>
      <span className="selected-fee-rate">
        {fetching ? <LoadingSpinner /> : rangeStr}
      </span>
    </SelectFeeTierItemWrapper>
  );
};

export default SelectFeeTier;
