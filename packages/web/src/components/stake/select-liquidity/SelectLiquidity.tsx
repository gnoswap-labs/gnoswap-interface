import React from "react";
import { CONTENT_TITLE } from "@components/stake/stake-liquidity/StakeLiquidity";
import { wrapper } from "./SelectLiquidity.styles";
import SelectLiquidityList from "@components/stake/select-liquidity-list/SelectLiquidityList";
import { DEVICE_TYPE } from "@styles/media";

interface SelectLiquidityProps {
  liquidity: any[];
  checkedList: string[];
  onCheckedItem: (checked: boolean, path: string) => void;
  onCheckedAll: (checked: boolean) => void;
  checkedAll: boolean;
  breakpoint: DEVICE_TYPE;
  isHiddenTitle?: boolean;
}

const SelectLiquidity: React.FC<SelectLiquidityProps> = ({
  liquidity,
  checkedList,
  onCheckedItem,
  onCheckedAll,
  checkedAll,
  isHiddenTitle = false,
  breakpoint,
}) => {
  return (
    <section css={wrapper}>
      {!isHiddenTitle && <h5 className="section-title">{CONTENT_TITLE.LIQUIDITY}</h5>}
      <SelectLiquidityList
        list={liquidity}
        checkedList={checkedList}
        onCheckedItem={onCheckedItem}
        onCheckedAll={onCheckedAll}
        checkedAll={checkedAll}
        breakpoint={breakpoint}
      />
    </section>
  );
};

export default SelectLiquidity;
