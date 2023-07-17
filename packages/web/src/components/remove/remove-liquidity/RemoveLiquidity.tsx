import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import RemoveLiquiditySelectList from "@components/remove/remove-liquidity-select-list/RemoveLiquiditySelectList";
import RemoveLiquiditySelectResult from "@components/remove/remove-liquidity-select-result/RemoveLiquiditySelectResult";
import { wrapper } from "./RemoveLiquidity.styles";

interface RemoveLiquidityProps {
  data: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, tokenId: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const RemoveLiquidity: React.FC<RemoveLiquidityProps> = ({
  data,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
}) => {
  return (
    <div css={wrapper}>
      <h3 className="title">Remove Liquidity</h3>
      <RemoveLiquiditySelectList
        list={data}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
      />
      <RemoveLiquiditySelectResult checkedList={checkedList} />
      <Button
        text="Remove Liquidity"
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

export default RemoveLiquidity;
