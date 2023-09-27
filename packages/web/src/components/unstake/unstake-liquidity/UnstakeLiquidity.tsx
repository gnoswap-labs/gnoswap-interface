import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import SelectLiquidity from "@components/unstake/select-liquidity/SelectLiquidity";
import SelectUnstakeResult from "@components/unstake/select-unstake-result/SelectUnstakeResult";
import { wrapper } from "./UnstakeLiquidity.styles";

interface UnstakeLiquidityProps {
  data: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const UnstakeLiquidity: React.FC<UnstakeLiquidityProps> = ({
  data,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
}) => {
  return (
    <div css={wrapper}>
      <h3 className="title">Unstake Liquidity</h3>
      <SelectLiquidity
        list={data}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
      />
      <SelectUnstakeResult checkedList={checkedList} />
      <Button
        text="Unstake"
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

export default UnstakeLiquidity;
