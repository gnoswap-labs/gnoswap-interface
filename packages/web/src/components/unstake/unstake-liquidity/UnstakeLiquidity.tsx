import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import SelectLiquidity from "@components/unstake/select-liquidity/SelectLiquidity";
import SelectUnstakeResult from "@components/unstake/select-unstake-result/SelectUnstakeResult";
import { wrapper } from "./UnstakeLiquidity.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { DEVICE_TYPE } from "@styles/media";

interface UnstakeLiquidityProps {
  data: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  handleConfirmUnstake: () => void;
  breakpoint: DEVICE_TYPE;
}

const UnstakeLiquidity: React.FC<UnstakeLiquidityProps> = ({
  data,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  handleConfirmUnstake,
  breakpoint,
}) => {
  return (
    <div css={wrapper}>
      <h3 className="title">Unstake Position</h3>
      <SelectLiquidity
        list={data}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        breakpoint={breakpoint}
      />
      <SelectUnstakeResult checkedList={checkedList} />
      {checkedList.length > 0 && <div className="unstake-des">
        <h5>Your Staking Progress Will be Reset</h5>
        <p>This will completely reset your staking progress. Once you re-stake, you will have to wait 30 days to start receiving max staking rewards. Be sure to understand how the warm-up period works before unstaking.</p>
        <a href="/">
          Learn more
          <IconOpenLink className="icon-link"/>
        </a>
      </div>}
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
