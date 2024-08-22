import React from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { PoolPositionModel } from "@models/position/pool-position-model";

import SelectLiquidityListItem from "./select-lilquidity-list-item/SelectLiquidityListItem";

import { loadingWrapper, wrapper } from "./SelectLiquidityList.styles";

interface SelectLiquidityProps {
  unstakedPositions: PoolPositionModel[];
  checkedList: number[];
  onCheckedItem: (checked: boolean, path: number) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isEmpty: boolean;
  isLoading: boolean;
}

const SelectLiquidityList: React.FC<SelectLiquidityProps> = ({
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isEmpty,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <div className="checked-all-wrap">
        <div className="wrapper-check-label">
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
        </div>
        <span>{t("StakePosition:liquidity")}</span>
      </div>
      <ul>
        {isLoading && (
          <div css={loadingWrapper}>
            <LoadingSpinner />
          </div>
        )}
        {!isLoading &&
          unstakedPositions
            .filter(item => item.closed === false)
            .map((position, index) => (
              <SelectLiquidityListItem
                position={position}
                checkedList={checkedList}
                onCheckedItem={onCheckedItem}
                key={index}
              />
            ))}
        {!isLoading && isEmpty && (
          <div className="no-position">{t("StakePosition:noPosi")}</div>
        )}
      </ul>
    </div>
  );
};

export default SelectLiquidityList;
