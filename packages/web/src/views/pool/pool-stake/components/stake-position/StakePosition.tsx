import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { PoolModel } from "@models/pool/pool-model";
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
  pool?: PoolModel;
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
  pool,
}) => {
  const { t } = useTranslation();

  const isEmptyCheckList = useMemo(() => {
    return checkedList.length === 0 && connected;
  }, [checkedList, connected]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position =>
      checkedList.includes(position.id),
    );
  }, [checkedList, unstakedPositions]);

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
      <SelectStakeResult
        positions={selectedPositions}
        isHiddenBadge
        pool={pool}
      />
      <Button
        className="button-stake-position"
        text={
          !connected
            ? t("business:walletLogin")
            : isEmptyCheckList
            ? t("StakePosition:btn.selectPosi")
            : t("StakePosition:btn.stake")
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
