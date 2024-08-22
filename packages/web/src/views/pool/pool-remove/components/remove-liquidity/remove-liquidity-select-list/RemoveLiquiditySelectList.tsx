import React from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { PoolPositionModel } from "@models/position/pool-position-model";

import RemoveLiquiditySelectListItem from "./remove-liquidity-select-list-item/RemoveLiquiditySelectListItem";

import { loadingWrapper } from "../RemoveLiquidity.styles";
import { RemoveLiquiditySelectListWrapper } from "./RemoveLiquiditySelectList.styles";

interface RemoveLiquiditySelectListProps {
  stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: number[];
  onCheckedItem: (checked: boolean, id: number) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  isLoading: boolean;
}

const RemoveLiquiditySelectList: React.FC<RemoveLiquiditySelectListProps> = ({
  stakedPositions,
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <RemoveLiquiditySelectListWrapper>
      <div className="checked-all-wrap">
        <div className="wrapper-check-label">
          <input
            id="checkbox-all"
            type="checkbox"
            checked={checkedAll}
            onChange={e => onCheckedAll(e.target.checked)}
          />
          <label htmlFor="checkbox-all" />
          <span className="custom-label">
            {t("common:select", {
              context: "with",
            })}
          </span>
        </div>
        <span>{t("business:liquidity")}</span>
      </div>
      <ul>
        {isLoading && (
          <div css={loadingWrapper}>
            <LoadingSpinner />
          </div>
        )}
        {!isLoading &&
          unstakedPositions.map((position, index) => (
            <RemoveLiquiditySelectListItem
              position={position}
              checkedList={checkedList}
              onCheckedItem={onCheckedItem}
              key={index}
            />
          ))}
        {!isLoading &&
          stakedPositions.map((position, index) => (
            <RemoveLiquiditySelectListItem
              position={position}
              checkedList={checkedList}
              onCheckedItem={onCheckedItem}
              key={index}
              disabled
            />
          ))}
        {!isLoading &&
          unstakedPositions.length === 0 &&
          stakedPositions.length === 0 && (
            <div className="no-position">{t("business:noPosition")}</div>
          )}
      </ul>
    </RemoveLiquiditySelectListWrapper>
  );
};

export default RemoveLiquiditySelectList;
