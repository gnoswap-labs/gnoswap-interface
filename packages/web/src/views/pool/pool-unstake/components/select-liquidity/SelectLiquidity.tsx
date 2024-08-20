import React from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { PoolPositionModel } from "@models/position/pool-position-model";

import SelectLiquidityItem from "./select-liquidity-item/SelectLiquidityItem";

import { loadingWrapper, wrapper } from "./SelectLiquidity.styles";

interface SelectLiquidityProps {
  stakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isLoading: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  stakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <div className="checked-all-wrap">
        <input
          id="checkbox-all"
          type="checkbox"
          checked={checkedAll}
          onChange={e => onCheckedAll(e.target.checked)}
        />
        <label htmlFor="checkbox-all" className="select-all-label" />
        <span className="custom-label">
          {t("common:select", {
            context: "all",
          })}
        </span>
        <span className="liquidity-label">{t("business:liquidity")}</span>
      </div>
      <ul>
        {isLoading && (
          <div css={loadingWrapper}>
            <LoadingSpinner />
          </div>
        )}
        {!isLoading &&
          stakedPositions.map((position, index) => (
            <SelectLiquidityItem
              position={position}
              checkedList={checkedList}
              onCheckedItem={onCheckedItem}
              key={index}
            />
          ))}
        {!isLoading && stakedPositions.length === 0 && (
          <div className="no-position">{t("business:noPosition")}</div>
        )}
      </ul>
    </div>
  );
};

export default SelectLiquidity;
