import React, { useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";

const EarnAddLiquidityContainer: React.FC = () => {
  const [openFeeTier, setOpenFeeTier] = useState(false);
  const [openPriceRange, setOpenPriceRange] = useState(false);

  const onClickOpenFeeTier = () => {
    setOpenFeeTier((prev: boolean) => !prev);
  };

  const onClickOpenPriceRange = () => {
    setOpenPriceRange((prev: boolean) => !prev);
  };

  return (
    <EarnAddLiquidity
      openFeeTier={openFeeTier}
      onClickOpenFeeTier={onClickOpenFeeTier}
      openPriceRange={openPriceRange}
      onClickOpenPriceRange={onClickOpenPriceRange}
    />
  );
};

export default EarnAddLiquidityContainer;
