import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectFeeTier from "@components/common/select-fee-tier/SelectFeeTier";
import SelectPriceRange from "@components/common/select-price-range/SelectPriceRange";
import React, { useCallback, useMemo, useState } from "react";
import { EarnAddLiquidityWrapper } from "./EarnAddLiquidity.styles";
import { AddLiquidityType, FEE_RATE_OPTION, PriceRangeType } from "@constants/option.constant";
import { AddLiquidityFeeTier, AddLiquidityPriceRage, PoolTick, PriceRangeSummary } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import LiquidityEnterAmounts from "@components/common/liquidity-enter-amounts/LiquidityEnterAmounts";
import { TokenInfo } from "@models/token/token-info";
import SelectPair from "@components/common/select-pair/SelectPair";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconSettings from "@components/common/icons/IconSettings";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import SelectPriceRangeCustom from "@components/common/select-price-range-custom/SelectPriceRangeCustom";
import SelectPriceRangeSummary from "@components/common/select-price-range-summary/SelectPriceRangeSummary";

interface EarnAddLiquidityProps {
  mode: AddLiquidityType;
  tokenA: TokenInfo | undefined;
  tokenB: TokenInfo | undefined;
  changeToken0: (token: TokenInfo) => void;
  changeToken1: (token: TokenInfo) => void;
  token0Input: TokenAmountInputModel;
  token1Input: TokenAmountInputModel;
  feeTiers: AddLiquidityFeeTier[];
  feeRate: FEE_RATE_OPTION | undefined;
  selectFeeTier: (feeRate: FEE_RATE_OPTION) => void;
  priceRangeMap: { [key in PriceRangeType]: AddLiquidityPriceRage | undefined };
  priceRange: PriceRangeType | undefined;
  priceRangeSummary: PriceRangeSummary;
  selectPriceRange: (priceRange: PriceRangeType) => void;
  ticks: PoolTick[];
  currentTick?: PoolTick;
}

const EarnAddLiquidity: React.FC<EarnAddLiquidityProps> = ({
  tokenA,
  tokenB,
  changeToken0,
  changeToken1,
  token0Input,
  token1Input,
  feeTiers,
  feeRate,
  selectFeeTier,
  priceRangeMap,
  priceRange,
  priceRangeSummary,
  selectPriceRange,
  ticks,
  currentTick,
}) => {
  const [openedSelectPair, setOpenedSelectPair] = useState(true);
  const [openedFeeTier, setOpenedFeeTier] = useState(true);
  const [openedPriceRange, setOpenedPriceRange] = useState(true);

  const existTokenPair = useMemo(() => {
    return tokenA !== undefined && tokenB !== undefined;
  }, [tokenA, tokenB]);

  const token0Logo = useMemo(() => {
    return tokenA?.logoURI || "";
  }, [tokenA]);

  const token1Logo = useMemo(() => {
    return tokenB?.logoURI || "";
  }, [tokenB]);

  const selectedFeeRate = useMemo(() => {
    if (!feeRate) {
      return null;
    }
    return `${feeRate}%`;
  }, [feeRate]);

  const selectedPriceRange = useMemo(() => {
    if (!priceRange) {
      return null;
    }
    return `${priceRange}`;
  }, [priceRange]);

  const selectableCustomPriceRange = useMemo(() => {
    if (priceRange !== "Custom") {
      return false;
    }
    if (!tokenA || !tokenB) {
      return false;
    }
    return true;
  }, [priceRange, tokenA, tokenB]);

  const toggleSelectPair = useCallback(() => {
    setOpenedSelectPair(!openedSelectPair);
  }, [openedSelectPair]);

  const toggleFeeTier = useCallback(() => {
    setOpenedFeeTier(!openedFeeTier);
  }, [openedFeeTier]);

  const togglePriceRange = useCallback(() => {
    setOpenedPriceRange(!openedPriceRange);
  }, [openedPriceRange]);

  return (
    <EarnAddLiquidityWrapper>
      <h3>Add Liquidity</h3>
      <div className="select-content">
        <article className="selector-wrapper">
          <div className="header-wrapper" onClick={toggleSelectPair}>
            <h5>1. Select Pair</h5>
            {existTokenPair && (
              <DoubleLogo
                left={token0Logo}
                right={token1Logo}
                size={24}
              />
            )}
          </div>
          {openedSelectPair && (
            <SelectPair
              tokenA={tokenA}
              tokenB={tokenB}
              changeToken0={changeToken0}
              changeToken1={changeToken1}
            />
          )}
        </article>

        <article className="selector-wrapper">
          <div className="header-wrapper" onClick={toggleFeeTier}>
            <h5>2. Select Fee Tier</h5>
            {selectedFeeRate && (
              <Badge
                text={selectedFeeRate}
                type={BADGE_TYPE.LINE}
              />
            )}
          </div>

          {openedFeeTier && (
            <SelectFeeTier
              feeTiers={feeTiers}
              feeRate={feeRate}
              selectFeeTier={selectFeeTier}
            />
          )}
        </article>

        <article className="selector-wrapper">
          <div className="header-wrapper" onClick={togglePriceRange}>
            <h5>3. Select Price Range</h5>
            {selectedPriceRange && (
              <Badge
                text={selectedPriceRange}
                type={BADGE_TYPE.LINE}
              />
            )}
          </div>

          {openedPriceRange && (
            <SelectPriceRange
              priceRangeMap={priceRangeMap}
              priceRange={priceRange}
              selectPriceRange={selectPriceRange}
            />
          )}

          {selectableCustomPriceRange && (
            <SelectPriceRangeCustom
              currentTick={currentTick}
              tokenA={tokenA}
              tokenB={tokenB}
              ticks={ticks}
            />
          )}

          <SelectPriceRangeSummary {...priceRangeSummary} />
        </article>

        <article className="selector-wrapper">
          <div className="header-wrapper">
            <h5>4. Enter Amounts</h5>
            <button className="setting-button">
              <IconSettings className="setting-icon" />
            </button>
          </div>
          <LiquidityEnterAmounts
            token0Input={token0Input}
            token1Input={token1Input}
            changeToken0={changeToken0}
            changeToken1={changeToken1}
          />
        </article>
      </div>
      <Button
        text="Connect Wallet"
        onClick={() => { }}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
          height: 57,
          fontType: "body7",
        }}
      />
    </EarnAddLiquidityWrapper>
  );
};

export default EarnAddLiquidity;
