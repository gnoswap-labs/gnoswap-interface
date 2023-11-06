import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectFeeTier from "@components/common/select-fee-tier/SelectFeeTier";
import React, { useCallback, useMemo, useState } from "react";
import { EarnAddLiquidityWrapper } from "./EarnAddLiquidity.styles";
import { AddLiquidityType, SwapFeeTierType, SwapFeeTierInfoMap, AddLiquiditySubmitType } from "@constants/option.constant";
import { AddLiquidityPriceRage, PoolTick, PriceRangeSummary } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import LiquidityEnterAmounts from "@components/common/liquidity-enter-amounts/LiquidityEnterAmounts";
import SelectPair from "@components/common/select-pair/SelectPair";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconSettings from "@components/common/icons/IconSettings";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { PoolModel } from "@models/pool/pool-model";
import SelectPriceRange from "@components/common/select-price-range/SelectPriceRange";
import SelectPriceRangeSummary from "@components/common/select-price-range-summary/SelectPriceRangeSummary";
import { TokenModel } from "@models/token/token-model";

interface EarnAddLiquidityProps {
  mode: AddLiquidityType;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  tokenAInput: TokenAmountInputModel;
  tokenBInput: TokenAmountInputModel;
  feeTiers: SwapFeeTierType[];
  feeTier: SwapFeeTierType | null;
  pools: PoolModel[];
  selectFeeTier: (feeRate: SwapFeeTierType) => void;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage | null;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  priceRangeSummary: PriceRangeSummary;
  ticks: PoolTick[];
  currentTick: PoolTick | null;
  submitType: AddLiquiditySubmitType;
  submit: () => void;
}

const EarnAddLiquidity: React.FC<EarnAddLiquidityProps> = ({
  tokenA,
  tokenB,
  changeTokenA,
  changeTokenB,
  tokenAInput,
  tokenBInput,
  feeTiers,
  feeTier,
  pools,
  selectFeeTier,
  priceRanges,
  priceRange,
  priceRangeSummary,
  changePriceRange,
  submitType,
  submit,
}) => {
  const [openedSelectPair, setOpenedSelectPair] = useState(true);
  const [openedFeeTier, setOpenedFeeTier] = useState(true);
  const [openedPriceRange, setOpenedPriceRange] = useState(true);

  const existTokenPair = useMemo(() => {
    return tokenA !== null && tokenB !== null;
  }, [tokenA, tokenB]);

  const tokenALogo = useMemo(() => {
    return tokenA?.logoURI || "";
  }, [tokenA]);

  const tokenBLogo = useMemo(() => {
    return tokenB?.logoURI || "";
  }, [tokenB]);

  const selectedFeeRate = useMemo(() => {
    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[feeTier].rateStr;
  }, [feeTier]);

  const selectedPriceRange = useMemo(() => {
    if (!priceRange) {
      return null;
    }
    return `${priceRange.type}`;
  }, [priceRange]);

  const toggleSelectPair = useCallback(() => {
    setOpenedSelectPair(!openedSelectPair);
  }, [openedSelectPair]);

  const toggleFeeTier = useCallback(() => {
    setOpenedFeeTier(!openedFeeTier);
  }, [openedFeeTier]);

  const togglePriceRange = useCallback(() => {
    setOpenedPriceRange(!openedPriceRange);
  }, [openedPriceRange]);

  const activatedSubmit = useMemo(() => {
    switch (submitType) {
      case "CREATE_POOL":
      case "ADD_LIQUIDITY":
      case "CONNECT_WALLET":
      case "SWITCH_NETWORK":
        return true;
      default:
        return false;
    }
  }, [submitType]);

  const submitButtonStr = useMemo(() => {
    switch (submitType) {
      case "CREATE_POOL":
        return "Create Pool";
      case "ADD_LIQUIDITY":
        return "Add Liquidity";
      case "CONNECT_WALLET":
        return "Connect Wallet";
      case "SWITCH_NETWORK":
        return "Switch to Gnoland";
      case "INVALID_PAIR":
        return "Invalid Pair";
      case "INSUFFICIENT_BALANCE":
        return "Insufficient Balance";
      case "INVALID_RANGE":
        return "Invalid Range";
      case "ENTER_AMOUNT":
      default:
        return "Enter Amount";
    }
  }, [submitType]);

  return (
    <EarnAddLiquidityWrapper>
      <h3>Add Liquidity</h3>
      <div className="select-content">
        <article className="selector-wrapper">
          <div className="header-wrapper" onClick={toggleSelectPair}>
            <h5>1. Select Pair</h5>
            {existTokenPair && (
              <DoubleLogo
                left={tokenALogo}
                right={tokenBLogo}
                size={24}
              />
            )}
          </div>
          {openedSelectPair && (
            <SelectPair
              tokenA={tokenA}
              tokenB={tokenB}
              changeTokenA={changeTokenA}
              changeTokenB={changeTokenB}
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
              feeTier={feeTier}
              pools={pools}
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
              priceRanges={priceRanges}
              priceRange={priceRange}
              changePriceRange={changePriceRange}
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
            tokenAInput={tokenAInput}
            tokenBInput={tokenBInput}
            changeTokenA={changeTokenA}
            changeTokenB={changeTokenB}
          />
        </article>
      </div>
      <Button
        text={submitButtonStr}
        onClick={submit}
        style={{
          hierarchy: activatedSubmit ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
          fullWidth: true,
          height: 57,
          fontType: "body7",
        }}
      />
    </EarnAddLiquidityWrapper>
  );
};

export default EarnAddLiquidity;
