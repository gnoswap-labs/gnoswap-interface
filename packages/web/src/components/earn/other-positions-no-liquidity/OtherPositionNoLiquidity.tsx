import IconInbox from "@components/common/icons/IconInbox";
import { AccountModel } from "@models/account/account-model";
import React from "react";
import { NoLiquidityWrapper } from "./OtherPositionNoLiquidity.styles";

interface OtherPositionNoLiquidityProps {
  account: AccountModel | null;
}

const OtherPositionNoLiquidity: React.FC<
  OtherPositionNoLiquidityProps
> = ({ }) => {
  
  return (
    <NoLiquidityWrapper>
      <IconInbox className="icon-no-position"/>
      <span className="description">
      This address does not own any positions.
      </span>
    </NoLiquidityWrapper>
  );
};

export default OtherPositionNoLiquidity;
