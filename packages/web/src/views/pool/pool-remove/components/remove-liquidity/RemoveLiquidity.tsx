import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { PoolPositionModel } from "@models/position/pool-position-model";

import RemoveLiquiditySelectList from "./remove-liquidity-select-list/RemoveLiquiditySelectList";
import RemoveLiquiditySelectResult from "./remove-liquidity-select-result/RemoveLiquiditySelectResult";

import { wrapper } from "./RemoveLiquidity.styles";

interface RemoveLiquidityProps {
  stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: number[];
  onCheckedItem: (checked: boolean, id: number) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  removeLiquidity: () => void;
  isLoading: boolean;
  isGetWGNOT: boolean;
  setIsGetWGNOT: () => void;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  stakedPositions,
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  removeLiquidity,
  isLoading,
  isGetWGNOT,
  setIsGetWGNOT,
}) => {
  const { t } = useTranslation();

  const disabledRemoveLiquidity = useMemo(() => {
    return checkedList.length === 0;
  }, [checkedList.length]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position =>
      checkedList.includes(position.id),
    );
  }, [checkedList, unstakedPositions]);

  return (
    <div css={wrapper}>
      <h3 className="title">{t("RemovePosition:title")}</h3>
      <RemoveLiquiditySelectList
        stakedPositions={stakedPositions}
        unstakedPositions={unstakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isLoading={isLoading}
      />
      <RemoveLiquiditySelectResult
        positions={selectedPositions}
        isGetWGNOT={isGetWGNOT}
        setIsGetWGNOT={setIsGetWGNOT}
      />
      <Button
        text={t(
          disabledRemoveLiquidity
            ? "RemovePosition:btn.selectPosi"
            : "RemovePosition:btn.remove",
        )}
        disabled={disabledRemoveLiquidity}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-submit"
        onClick={removeLiquidity}
      />
    </div>
  );
};

export default RemoveLiquidity;
