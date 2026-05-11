import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { PoolPositionModel } from "@models/position/pool-position-model";

import SelectLiquidity from "./select-liquidity/SelectLiquidity";
import SelectStakeResult from "./select-stake-result/SelectStakeResult";

import { wrapper } from "./StakePosition.styles";

interface StakePositionProps {
  unstakedPositions: PoolPositionModel[];
  checkedList: number[];
  onCheckedItem: (checked: boolean, path: number) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  submitPosition: () => void;
  isUnstake?: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  connected: boolean;
}

const StakePosition: React.FC<StakePositionProps> = ({
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  submitPosition,
  isEmpty,
  isLoading,
  connected,
}) => {
  const { t } = useTranslation();

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, unstakedPositions]);

  // Use derived selectedPositions length, not raw checkedList length —
  // stale ids that no longer match unstakedPositions must not enable submit.
  const isEmptyCheckList = useMemo(() => {
    return selectedPositions.length === 0 && connected;
  }, [selectedPositions.length, connected]);

  return (
    <div css={wrapper}>
      <h3 className="title">{t("StakePosition:title")}</h3>
      <SelectLiquidity
        unstakedPositions={unstakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isHiddenTitle
        isEmpty={isEmpty}
        isLoading={isLoading}
      />
      <SelectStakeResult positions={selectedPositions} isHiddenBadge />
      <Button
        className="button-stake-position"
        text={
          !connected
            ? t("common:btn.walletLogin")
            : isEmptyCheckList
            ? t("StakePosition:btn.selectPosi")
            : t("StakePosition:title")
        }
        disabled={isEmptyCheckList}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        onClick={submitPosition}
      />
    </div>
  );
};

export default StakePosition;
