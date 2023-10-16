import React from "react";
import { CONTENT_TITLE } from "@components/stake/stake-liquidity/StakeLiquidity";
import { wrapper } from "./SelectLiquidity.styles";
import SelectLiquidityList from "@components/stake/select-liquidity-list/SelectLiquidityList";

interface SelectLiquidityProps {
  liquidity: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  liquidity,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
}) => {
  return (
    <section css={wrapper}>
      <h5 className="section-title">{CONTENT_TITLE.LIQUIDITY}</h5>
      <SelectLiquidityList
        list={liquidity}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
      />
    </section>
  );
};

export default SelectLiquidity;
