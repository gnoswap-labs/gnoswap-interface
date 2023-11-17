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
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { PoolModel } from "@models/pool/pool-model";
import SelectPriceRange from "@components/common/select-price-range/SelectPriceRange";
import SelectPriceRangeSummary from "@components/common/select-price-range-summary/SelectPriceRangeSummary";
import { TokenModel } from "@models/token/token-model";
import SelectPriceRangeCustom from "@components/common/select-price-range-custom/SelectPriceRangeCustom";
import IconSettings from "@components/common/icons/IconSettings";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import IconStaking from "@components/common/icons/IconStaking";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

interface EarnAddLiquidityProps {
  mode: AddLiquidityType;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  tokenAInput: TokenAmountInputModel;
  tokenBInput: TokenAmountInputModel;
  feetierOfLiquidityMap: { [key in string]: number };
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
  isEarnAdd: boolean;
  connected: boolean;
  slippage: number;
  changeSlippage: (value: string) => void;
  handleClickOneStaking?: () => void;
  openModal: () => void;
}

const EarnAddLiquidity: React.FC<EarnAddLiquidityProps> = ({
  tokenA,
  tokenB,
  changeTokenA,
  changeTokenB,
  tokenAInput,
  tokenBInput,
  feetierOfLiquidityMap,
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
  currentTick,
  ticks,
  isEarnAdd,
  connected,
  slippage,
  changeSlippage,
  handleClickOneStaking,
  openModal,
}) => {
  const [openedSelectPair] = useState(isEarnAdd ? true : false);
  const [openedFeeTier, setOpenedFeeTier] = useState(false);
  const [openedPriceRange, setOpenedPriceRange] = useState(isEarnAdd ? false : true);
  const [openCustomPriceRange, setOpenCustomPriceRange] = useState(false);
  const [openedSetting, setOpenedSetting] = useState(false);
  

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

  const toggleFeeTier = useCallback(() => {
    if (isEarnAdd) {
      tokenA && tokenB && setOpenedFeeTier(!openedFeeTier);
    }
  }, [tokenA, tokenB, openedFeeTier, isEarnAdd]);

  const togglePriceRange = useCallback(() => {
    tokenA && tokenB && setOpenedPriceRange(!openedPriceRange);
  }, [tokenA, tokenB, openedPriceRange]);

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
      case "AMOUNT_TOO_LOW":
        return "Amount Too Low";
      case "ENTER_AMOUNT":
      default:
        return "Enter Amount";
    }
  }, [submitType]);

  const handleChangeTokenB = useCallback((token: TokenModel) => {
    if (tokenA && tokenA.symbol !== token.symbol) {
      setOpenedFeeTier(true);
      setOpenedPriceRange(true);
      handleClickOneStaking?.();
    }
    changeTokenB(token);
  }, [changeTokenB, tokenA, tokenB]);

  const handleChangeTokenA = useCallback((token: TokenModel) => {
    if (tokenB && tokenB.symbol !== token.symbol) {
      setOpenedFeeTier(true);
      setOpenedPriceRange(true);
      handleClickOneStaking?.();
    }
    changeTokenA(token);
  }, [changeTokenA, tokenA, tokenB]);

  const handleSelectFeeTier = useCallback((feeTier: SwapFeeTierType) => {
    selectFeeTier(feeTier);
  }, [selectFeeTier]);

  const handlePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    if (priceRange.type !== "Custom") {
      setOpenCustomPriceRange(false);
    } else {
      setOpenCustomPriceRange(true);
    }
    changePriceRange(priceRange);
  }, [changePriceRange]);
  
  const openSetting = useCallback(() => {
    setOpenedSetting(true);
  }, []);

  const closeSetting = useCallback(() => {
    setOpenedSetting(() => false);
  }, []);
  
  return (
    <EarnAddLiquidityWrapper>
      <h3>Create Position</h3>
      <div className="select-content">
        <article className="selector-wrapper">
          <div className={`header-wrapper default-cursor ${!isEarnAdd ? "disable-text" : ""}`}>
            <h5>1. Select Pair</h5>
            {!isEarnAdd && existTokenPair && (
              <DoubleLogo
                left={tokenALogo}
                right={tokenBLogo}
                size={30}
              />
            )}
          </div>
          {openedSelectPair && (
            <SelectPair
              tokenA={tokenA}
              tokenB={tokenB}
              changeTokenA={handleChangeTokenA}
              changeTokenB={handleChangeTokenB}
            />
          )}
        </article>

        <article className="selector-wrapper">
          <div className={`header-wrapper ${!isEarnAdd || !existTokenPair ? "default-cursor" : ""} ${!isEarnAdd && "disable-text"}`} onClick={toggleFeeTier}>
            <div className="header-wrapper-title">
              <h5>2. Select Fee Tier</h5>
              {existTokenPair && isEarnAdd && (!openedFeeTier ? <IconArrowDown /> : <IconArrowUp />)}
            </div>
            {selectedFeeRate && (
              <Badge
                text={selectedFeeRate}
                type={BADGE_TYPE.LINE}
                className="fee-tier-bad"
              />
            )}
          </div>

          {openedFeeTier && (
            <SelectFeeTier
              feetierOfLiquidityMap={feetierOfLiquidityMap}
              feeTiers={feeTiers}
              feeTier={feeTier}
              pools={pools}
              selectFeeTier={handleSelectFeeTier}
            />
          )}
        </article>

        <article className="selector-wrapper">
          <div className={`header-wrapper ${!existTokenPair ? "default-cursor" : ""}`} onClick={togglePriceRange}>
            <div className="header-wrapper-title">
              <h5>3. Select Price Range</h5>
              {existTokenPair && (!openedPriceRange ? <IconArrowDown /> : <IconArrowUp />)}
            </div>
            {selectedPriceRange && (
              <Badge
                text={selectedPriceRange}
                type={BADGE_TYPE.LINE}
                className="fee-tier-bad"
              />
            )}
          </div>

          {openedPriceRange && (
            <SelectPriceRange
              priceRanges={priceRanges}
              priceRange={priceRange}
              changePriceRange={handlePriceRange}
            />
          )}
          {openedPriceRange && openCustomPriceRange && tokenA && tokenB && currentTick && ticks && <SelectPriceRangeCustom
            tokenA={tokenA}
            tokenB={tokenB}
            currentTick={currentTick}
            ticks={ticks}
          />
          }
          {selectedPriceRange && existTokenPair && selectedFeeRate && <SelectPriceRangeSummary {...priceRangeSummary} />}
        </article>

        <article className="selector-wrapper">
          <div className="header-wrapper default-cursor">
            <h5>4. Enter Amounts</h5>
            <button className="setting-button" onClick={openSetting}>
              <IconSettings className="setting-icon"/>
            </button>
            {openedSetting && (
              <SettingMenuModal
                slippage={slippage}
                changeSlippage={changeSlippage}
                close={closeSetting}
                className="setting-modal"
              />
            )}
          </div>
          <div className="liquity-enter-amount">
            <LiquidityEnterAmounts
              tokenAInput={tokenAInput}
              tokenBInput={tokenBInput}
              changeTokenA={changeTokenA}
              changeTokenB={changeTokenB}
              connected={connected}
            />
          </div>
        </article>
        {isEarnAdd && !existTokenPair && <div className="dim-content" />}
      </div>
      <Button
        text={submitButtonStr}
        onClick={submit}
        style={{
          hierarchy: activatedSubmit ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
          fullWidth: true,
        }}
        className="button-submit"
      />
      {submitType === "CREATE_POOL" && existTokenPair && selectedFeeRate && <div className="btn-one-click" onClick={openModal}>
        <IconStaking /> One-Click Staking
      </div>}
    </EarnAddLiquidityWrapper>
  );
};

export default EarnAddLiquidity;
