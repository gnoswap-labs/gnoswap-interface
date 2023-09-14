import React, { useCallback, useMemo } from "react";
import { SelectFeeTierItemWrapper, SelectFeeTierWrapper } from "./SelectFeeTier.styles";
import { AddLiquidityFeeTier } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { FEE_RATE_OPTION } from "@constants/option.constant";

interface SelectFeeTierProps {
  feeTiers: AddLiquidityFeeTier[];
  feeRate: string | undefined;
  selectFeeTier: (feeRate: FEE_RATE_OPTION) => void;
}

const SelectFeeTier: React.FC<SelectFeeTierProps> = ({
  feeTiers,
  feeRate,
  selectFeeTier,
}) => {

  const onClickFeeTierItem = useCallback((feeRate: string) => {
    const feeRateOption = Object.values(FEE_RATE_OPTION).find(option => option === feeRate);
    if (feeRateOption) {
      selectFeeTier(feeRateOption);
    }
  }, [selectFeeTier]);

  return (
    <SelectFeeTierWrapper>
      {feeTiers.map((feeTier, index) => (
        <SelectFeeTierItem
          selected={feeTier.feeRate === feeRate}
          key={index}
          feeRate={feeTier.feeRate}
          description={feeTier.description}
          range={feeTier.range}
          onClick={() => onClickFeeTierItem(feeTier.feeRate)}
        />
      ))}
    </SelectFeeTierWrapper>
  );
};

interface SelectFeeTierItemProps extends AddLiquidityFeeTier {
  selected: boolean;
  onClick: () => void;
}

const SelectFeeTierItem: React.FC<SelectFeeTierItemProps> = ({
  selected,
  feeRate,
  description,
  range,
  onClick,
}) => {
  const feeRateStr = useMemo(() => {
    return `${feeRate}%`;
  }, [feeRate]);

  const rangeStr = useMemo(() => {
    if (range === "0") {
      return "Not created";
    }
    return `${range}% select`;
  }, [range]);

  return (
    <SelectFeeTierItemWrapper className={selected ? "selected" : ""} onClick={onClick}>
      <strong className="fee-rate">{feeRateStr}</strong>
      <p className="desc">{description}</p>
      <span className="selected-fee-rate">{rangeStr}</span>
    </SelectFeeTierItemWrapper>
  );
};


export default SelectFeeTier;
