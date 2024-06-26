import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useMemo } from "react";
import SelectLiquidity from "@components/unstake/select-liquidity/SelectLiquidity";
import SelectUnstakeResult from "@components/unstake/select-unstake-result/SelectUnstakeResult";
import { StakeWarningContentWrapper, wrapper } from "./UnstakeLiquidity.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import WarningCard from "@components/common/warning-card/WarningCard";

interface UnstakeLiquidityProps {
  stakedPositions: PoolPositionModel[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  handleConfirmUnstake: () => void;
  isLoading: boolean;
}

const UnstakeLiquidity: React.FC<UnstakeLiquidityProps> = ({
  stakedPositions,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  handleConfirmUnstake,
  isLoading,
}) => {

  const selectedPositions = useMemo(() => {
    return stakedPositions.filter(position => checkedList.includes(position.id));
  }, [checkedList, stakedPositions]);

  return (
    <div css={wrapper}>
      <h3 className="title">Unstake Position</h3>
      <SelectLiquidity
        stakedPositions={stakedPositions}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isLoading={isLoading}
      />
      <SelectUnstakeResult positions={selectedPositions} />
      {selectedPositions.length > 0 && <WarningCard
        title={"Your Staking Progress Will be Reset"}
        icon={<IconCircleExclamationMark />}
        content={<StakeWarningContentWrapper>
          <p>This will completely reset your staking progress. Once you re-stake, you will have to wait 30 days to start receiving max staking rewards. Be sure to understand how the warm-up period works before unstaking.</p>
          <a href="/">
            Learn More
            <IconOpenLink className="icon-link" />
          </a>
        </StakeWarningContentWrapper>}
      />}
      <Button
        text={checkedList.length === 0 ? "Select Position" : "Unstake Position"}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
        disabled={checkedList.length === 0}
        onClick={handleConfirmUnstake}
      />
    </div>
  );
};

export default UnstakeLiquidity;
