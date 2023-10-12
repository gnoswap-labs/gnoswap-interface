import React, { useCallback, useMemo } from "react";
import { SelectFeeTierItemWrapper, SelectFeeTierWrapper } from "./SelectFeeTier.styles";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import BigNumber from "bignumber.js";

interface SelectFeeTierProps {
  feeTiers: SwapFeeTierType[];
  feeTier: SwapFeeTierType | null;
  pools: PoolModel[],
  selectFeeTier: (feeTier: SwapFeeTierType) => void;
}

const SelectFeeTier: React.FC<SelectFeeTierProps> = ({
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
  onClick: () => void;
}

const SelectFeeTierItem: React.FC<SelectFeeTierItemProps> = ({
  selected,
  feeTier,
  pools,
  onClick,
}) => {
  const feeRateStr = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].rateStr;
  }, [feeTier]);

  const rangeStr = useMemo(() => {
    const fee = SwapFeeTierInfoMap[feeTier].fee;
    const pool = pools.find(pool => pool.fee === fee);
    if (!pool || pool.bins.length < 2) {
      return "Not created";
    }
    const sortedBins = pool.bins.sort((p1, p2) => p1.currentTick - p2.currentTick);
    const fullTickRange = 1774545;
    const currentTickGap = sortedBins[0].currentTick - sortedBins[sortedBins.length - 1].currentTick;
    return BigNumber(currentTickGap)
      .dividedBy(fullTickRange)
      .multipliedBy(100)
      .toFixed();
  }, [feeTier, pools]);

  const description = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].description;
  }, [feeTier]);

  return (
    <SelectFeeTierItemWrapper className={selected ? "selected" : ""} onClick={onClick}>
      <strong className="fee-rate">{feeRateStr}</strong>
      <p className="desc">{description}</p>
      <span className="selected-fee-rate">{rangeStr}</span>
    </SelectFeeTierItemWrapper>
  );
};


export default SelectFeeTier;
