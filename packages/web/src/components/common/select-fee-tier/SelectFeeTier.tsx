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
import { useTranslation } from "react-i18next";

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
    <SelectFeeTierWrapper
      id={"select-fee-tier-comp"}
      className={openedFeeTier ? "open" : ""}
    >
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
  const { t } = useTranslation();

  const feeRateStr = useMemo(() => {
    return SwapFeeTierInfoMap[feeTier].rateStr;
  }, [feeTier]);

  const rangeStr = useMemo(() => {
    if (liquidityRange === null || liquidityRange === undefined) {
      return t("AddPosition:form.feeTier.status.notCreate");
    }
    return t("AddPosition:form.feeTier.status.created", {
      percent: Math.round(liquidityRange) + "%",
    });
  }, [liquidityRange, t]);

  const description = useMemo(() => {
    return t(SwapFeeTierInfoMap[feeTier].description);
  }, [feeTier, t]);

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
