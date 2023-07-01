import Button, { ButtonHierarchy } from "@components/common/button/Button";
import EnterAmounts from "@components/common/enter-amounts/EnterAmounts";
import SelectFeeTier from "@components/common/select-fee-tier/SelectFeeTier";
import SelectPair from "@components/common/select-pair/SelectPair";
import SelectPriceRange from "@components/common/select-price-range/SelectPriceRange";
import React from "react";
import { ValuesType } from "utility-types";
import { wrapper } from "./EarnAddLiquidity.styles";

interface EarnAddLiquidityProps {
  data?: any;
  openFeeTier: boolean;
  onClickOpenFeeTier: () => void;
  openPriceRange: boolean;
  onClickOpenPriceRange: () => void;
}

export const CONTENT_TITLE = {
  PAIR: "1. Select Pair",
  FEE_TIER: "2. Select Fee Tier",
  PRICE_RANGE: "3. Select Price Range",
  AMOUNTS: "4. Enter Amounts",
};
export type CONTENT_TITLE = ValuesType<typeof CONTENT_TITLE>;

const EarnAddLiquidity: React.FC<EarnAddLiquidityProps> = ({
  data,
  openFeeTier,
  onClickOpenFeeTier,
  openPriceRange,
  onClickOpenPriceRange,
}) => {
  return (
    <div css={wrapper}>
      <h3>Add Liquidity</h3>
      <div className="select-content">
        <SelectPair active={true} data={data} />
        <SelectFeeTier
          active={true}
          data={data}
          openFeeTier={openFeeTier}
          onClickOpenFeeTier={onClickOpenFeeTier}
        />
        <SelectPriceRange
          data={data}
          openPriceRange={openPriceRange}
          onClickOpenPriceRange={onClickOpenPriceRange}
        />
        <EnterAmounts
          from={{ token: "GNOT", amount: "121", price: "$0.00", balance: "0" }}
          to={{ token: "GNOS", amount: "5000", price: "$0.00", balance: "0" }}
        />
      </div>
      <Button
        text="Connect Wallet"
        onClick={() => {}}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
          height: 57,
          fontType: "body7",
        }}
      />
    </div>
  );
};

export default EarnAddLiquidity;
