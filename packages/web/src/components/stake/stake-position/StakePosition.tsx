import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { wrapper } from "./StakePosition.styles";
import { ValuesType } from "utility-types";
import SelectLiquidity from "@components/stake/select-liquidity/SelectLiquidity";
import SelectStakeResult from "@components/stake/select-stake-result/SelectStakeResult";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface StakePositionProps {
  stakedPositions: PoolPositionModel[];
  unstakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  submitPosition: () => void;
  isUnstake?: boolean;
}

export const CONTENT_TITLE = {
  PERIOD: "1. Select Unstaking Period",
  LIQUIDITY: "2. Select Liquidity",
  TOTAL_STAKING: "Total Staking Amount",
  APR: "Estimated APR",
};
export type CONTENT_TITLE = ValuesType<typeof CONTENT_TITLE>;

const StakePosition: React.FC<StakePositionProps> = ({
  stakedPositions,
  unstakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  submitPosition,
}) => {
  const isEmptyCheckList = useMemo(() => {
    return checkedList.length === 0;
  }, [checkedList]);

  const selectedPositions = useMemo(() => {
    return unstakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, unstakedPositions]);

  return (
    <div css={wrapper}>
      <h3 className="title">Stake Position</h3>
      <SelectLiquidity
        stakedPositions={stakedPositions}
        unstakedPositions={unstakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isHiddenTitle
      />
      <SelectStakeResult
        positions={selectedPositions}
        isHiddenBadge
      />
      <Button
        className="button-stake-position"
        text={isEmptyCheckList ? "Select Position" : "Stake Position"}
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
