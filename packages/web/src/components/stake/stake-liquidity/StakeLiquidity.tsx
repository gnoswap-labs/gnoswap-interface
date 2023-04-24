import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectUnstakingPeriod from "@components/stake/select-unstake-period/SelectUnstakePeriod";
import { wrapper } from "./StakeLiquidity.styles";
import { ValuesType } from "utility-types";
import SelectLiquidity from "@components/stake/select-liquidity/SelectLiquidity";
import SelectStakeResult from "@components/stake/select-stake-result/SelectStakeResult";

interface StakeLiquidityProps {
  data: any;
  activePeriod: number;
  checkedList: string[];
  onClickPeriod: (idx: number) => void;
  onCheckedItem: (checked: boolean, tokenId: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

export const CONTENT_TITLE = {
  PERIOD: "1. Select Unstaking Period",
  LIQUIDITY: "2. Select Liquidity",
  TOTAL_STAKING: "Total Staking Amount",
  APR: "Estimated APR",
};
export type CONTENT_TITLE = ValuesType<typeof CONTENT_TITLE>;

const StakeLiquidity: React.FC<StakeLiquidityProps> = ({
  data,
  activePeriod,
  checkedList,
  onClickPeriod,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
}) => {
  return (
    <div css={wrapper}>
      <h3 className="title">Stake Liquidity</h3>
      <SelectUnstakingPeriod
        period={data.period}
        activePeriod={activePeriod}
        onClickPeriod={onClickPeriod}
      />
      <SelectLiquidity
        liquidity={data.liquidity}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
      />
      <SelectStakeResult checkedList={checkedList} />
      <Button
        text="Stake"
        disabled={true}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 57,
          fullWidth: true,
        }}
      />
    </div>
  );
};

export default StakeLiquidity;
