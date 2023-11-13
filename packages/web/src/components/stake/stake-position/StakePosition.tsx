import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { wrapper } from "./StakePosition.styles";
import { ValuesType } from "utility-types";
import SelectLiquidity from "@components/stake/select-liquidity/SelectLiquidity";
import SelectStakeResult from "@components/stake/select-stake-result/SelectStakeResult";
import IconOpenLink from "@components/common/icons/IconOpenLink";

interface StakePositionProps {
  data: any;
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
  data,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  submitPosition,
  isUnstake,
}) => {
  const isEmptyCheckList = useMemo(() => {
    return checkedList.length === 0;
  }, [checkedList]);
  
  return (
    <div css={wrapper}>
      <h3 className="title">{isUnstake ? "Unstake Position" : "Stake Position"}</h3>
      <SelectLiquidity
        liquidity={data.liquidity}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        isHiddenTitle
      />
      <SelectStakeResult checkedList={checkedList} isHiddenBadge isUnstake={isUnstake} />
      {isUnstake && checkedList.length > 0 && <div className="unstake-des">
        <h5>Your Staking Progress Will be Reset</h5>
        <p>This will completely reset your staking progress. Once you re-stake, you will have to wait 30 days to start receiving max staking rewards. Be sure to understand how the warm-up period works before unstaking.</p>
        <a href="/">
          Learn more
          <IconOpenLink className="icon-link"/>
        </a>
      </div>}
      <Button
        className="button-stake-position"
        text={isEmptyCheckList ? "Select Position" : isUnstake ? "Stake Position" : "Unstake"}
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
