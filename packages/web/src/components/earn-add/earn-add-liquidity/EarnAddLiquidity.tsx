import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectFeeTier from "@components/common/select-fee-tier/SelectFeeTier";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  EarnAddLiquidityWrapper,
  OutOfRangeWrapper,
} from "./EarnAddLiquidity.styles";
import {
  AddLiquidityType,
  SwapFeeTierType,
  SwapFeeTierInfoMap,
  AddLiquiditySubmitType,
  PriceRangeType,
  DefaultTick,
} from "@constants/option.constant";
import {
  AddLiquidityPriceRage,
  PoolTick,
  PriceRangeSummary,
} from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import LiquidityEnterAmounts from "@components/common/liquidity-enter-amounts/LiquidityEnterAmounts";
import SelectPair from "@components/common/select-pair/SelectPair";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { PoolModel } from "@models/pool/pool-model";
import SelectPriceRange from "@components/common/select-price-range/SelectPriceRange";
import SelectPriceRangeSummary from "@components/common/select-price-range-summary/SelectPriceRangeSummary";
import { TokenModel } from "@models/token/token-model";
import IconSettings from "@components/common/icons/IconSettings";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import IconStaking from "@components/common/icons/IconStaking";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import { SelectPool } from "@hooks/pool/use-select-pool";
import IconFailed from "@components/common/icons/IconFailed";
import { isEmptyObject } from "@utils/validation-utils";
import { useLoading } from "@hooks/common/use-loading";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";

interface EarnAddLiquidityProps {
  mode: AddLiquidityType;
  defaultPrice: number | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  tokenAInput: TokenAmountInputModel;
  tokenBInput: TokenAmountInputModel;
  changeTokenAAmount: (amount: string) => void;
  changeTokenBAmount: (amount: string) => void;
  feetierOfLiquidityMap: { [key in string]: number };
  feeTiers: SwapFeeTierType[];
  feeTier: SwapFeeTierType | null;
  pools: PoolModel[];
  selectFeeTier: (feeRate: SwapFeeTierType) => void;
  priceRanges: AddLiquidityPriceRage[];
  priceRange: AddLiquidityPriceRage | null;
  changePriceRange: (priceRange: AddLiquidityPriceRage) => void;
  priceRangeSummary: PriceRangeSummary;
  currentTick: PoolTick | null;
  submitType: AddLiquiditySubmitType;
  submit: () => void;
  isEarnAdd: boolean;
  connected: boolean;
  slippage: number;
  changeSlippage: (value: number) => void;
  submitOneClickStaking: () => void;
  selectPool: SelectPool;
  changeStartingPrice: (price: string) => void;
  createOption: { startPrice: number | null; isCreate: boolean };
  handleSwapValue: () => void;
  isKeepToken: boolean;
  setPriceRange: (type?: PriceRangeType) => void;
  defaultPriceRangeRef?: React.MutableRefObject<
    [number | null, number | null] | undefined
  >;
  resetPriceRangeTypeTarget: PriceRangeType;
  defaultTicks?: DefaultTick;
  isLoadingTokens?: boolean;
  showDim: boolean;
  isLoadingSelectFeeTier: boolean;
  isLoadingSelectPriceRange: boolean;
  hasStakingRewardPool: boolean;
}

const EarnAddLiquidity: React.FC<EarnAddLiquidityProps> = ({
  defaultPrice,
  tokenA,
  tokenB,
  changeTokenA,
  changeTokenB,
  tokenAInput,
  tokenBInput,
  changeTokenAAmount,
  changeTokenBAmount,
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
  isEarnAdd,
  connected,
  slippage,
  changeSlippage,
  submitOneClickStaking,
  selectPool,
  changeStartingPrice,
  handleSwapValue,
  isKeepToken,
  setPriceRange,
  defaultTicks,
  resetPriceRangeTypeTarget,
  isLoadingTokens = false,
  showDim,
  isLoadingSelectFeeTier,
  isLoadingSelectPriceRange,
  hasStakingRewardPool,
}) => {
  const [openedSelectPair] = useState(isEarnAdd ? true : false);
  const [openedFeeTier, setOpenedFeeTier] = useState(false);
  const [openedPriceRange, setOpenedPriceRange] = useState(
    isEarnAdd ? false : true,
  );
  const [openedSetting, setOpenedSetting] = useState(false);
  const { isLoading: isLoadingCommon } = useLoading();

  useEffect(() => {
    if (tokenA && tokenB && isEarnAdd) {
      setOpenedFeeTier(true);
      setOpenedPriceRange(true);
    }
    return () => {
      setOpenedFeeTier(false);
      isEarnAdd && setOpenedPriceRange(false);
    };
  }, [tokenA, tokenB, isEarnAdd]);

  const existTokenPair = useMemo(() => {
    return tokenA !== null && tokenB !== null;
  }, [tokenA, tokenB]);

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

  const visiblePriceRangeLabel = useMemo(() => {
    return selectedFeeRate && existTokenPair && selectPool.isCreate === false;
  }, [existTokenPair, selectPool.isCreate, selectedFeeRate]);

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
        return "Add Position";
      case "ADD_LIQUIDITY":
        return "Add Liquidity";
      case "CONNECT_WALLET":
        return "Wallet Login";
      case "SWITCH_NETWORK":
        return "Switch to Gnoland";
      case "INVALID_PAIR":
        return "Select a pair";
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

  const handleChangeTokenB = useCallback(
    (token: TokenModel) => {
      if (tokenA && tokenA.symbol !== token.symbol) {
        setOpenedFeeTier(true);
        setOpenedPriceRange(true);
      }
      changeTokenB(token);
    },
    [changeTokenB, tokenA, tokenB],
  );

  const handleChangeTokenA = useCallback(
    (token: TokenModel) => {
      if (tokenB && tokenB.symbol !== token.symbol) {
        setOpenedFeeTier(true);
        setOpenedPriceRange(true);
      }
      changeTokenA(token);
    },
    [changeTokenA, tokenA, tokenB],
  );

  const handleSelectFeeTier = useCallback(
    (feeTier: SwapFeeTierType) => {
      selectFeeTier(feeTier);
      selectPool.setIsChangeMinMax(false);
    },
    [selectFeeTier],
  );

  const openSetting = useCallback(() => {
    setOpenedSetting(true);
  }, []);

  const closeSetting = useCallback(() => {
    setOpenedSetting(() => false);
  }, []);

  const isShowOutRange = useMemo(() => {
    if (!tokenA || !tokenB) return false;

    if (!selectPool.selectedFullRange) {
      if (selectPool.minPrice === null || selectPool.maxPrice === null) {
        return false;
      }
    }

    const { minPrice, maxPrice, currentPrice } = selectPool;

    return (
      ((minPrice || 0) > (currentPrice || 0) &&
        (maxPrice || 0) > (currentPrice || 0)) ||
      ((minPrice || 0) < (currentPrice || 0) &&
        (maxPrice || 0) < (currentPrice || 0))
    );
  }, [
    selectPool.selectedFullRange,
    selectPool.minPrice,
    selectPool.maxPrice,
    selectPool.currentPrice,
    tokenA,
    tokenB,
  ]);

  const isLoading = useMemo(
    () => selectPool.renderState() === "LOADING" || isLoadingCommon,
    [selectPool.renderState, isLoadingCommon],
  );

  const tokenPair = useMemo(() => {
    return [
      isKeepToken ? tokenA : tokenB,
      !isKeepToken ? tokenA : tokenB,
    ].filter(item => item !== null) as TokenModel[];
  }, [isKeepToken, tokenA, tokenB]);

  return (
    <EarnAddLiquidityWrapper>
      <h3>Add Position</h3>
      <div className="select-content">
        <article className="selector-wrapper">
          <div
            className={`header-wrapper default-cursor ${
              !isEarnAdd ? "disable-text" : ""
            }`}
          >
            <h5>1. Select Pair</h5>
            {!isEarnAdd && existTokenPair && (
              <OverlapTokenLogo tokens={tokenPair} size={32} />
            )}
          </div>
          {openedSelectPair && (
            <SelectPair
              tokenA={tokenA}
              tokenB={tokenB}
              changeTokenA={handleChangeTokenA}
              changeTokenB={handleChangeTokenB}
              disabled={isLoadingTokens}
            />
          )}
        </article>

        <article className="selector-wrapper selector-wrapper-fee-tier">
          <div
            className={`header-wrapper ${
              !isEarnAdd || !existTokenPair ? "default-cursor" : ""
            } ${!isEarnAdd && "disable-text"}`}
            onClick={toggleFeeTier}
          >
            <div className="header-wrapper-title">
              <h5>2. Select Fee Tier</h5>
              {existTokenPair &&
                isEarnAdd &&
                (!openedFeeTier ? <IconArrowDown /> : <IconArrowUp />)}
            </div>
            {selectedFeeRate && existTokenPair && (
              <Badge
                text={selectedFeeRate}
                type={BADGE_TYPE.LINE}
                className="fee-tier-bad"
              />
            )}
          </div>

          <SelectFeeTier
            feetierOfLiquidityMap={feetierOfLiquidityMap}
            feeTiers={feeTiers}
            feeTier={feeTier}
            pools={pools}
            selectFeeTier={handleSelectFeeTier}
            fetching={isLoadingSelectFeeTier}
            openedFeeTier={openedFeeTier}
          />
        </article>

        <article
          className={`selector-wrapper ${
            !openedPriceRange ? "selector-wrapper-price-range" : ""
          }`}
        >
          <div
            className={`header-wrapper ${
              !existTokenPair ? "default-cursor" : ""
            }`}
            onClick={togglePriceRange}
          >
            <div className="header-wrapper-title">
              <h5>3. Select Price Range</h5>
              {existTokenPair &&
                (!openedPriceRange ? <IconArrowDown /> : <IconArrowUp />)}
            </div>
            {visiblePriceRangeLabel && (
              <Badge
                text={selectedPriceRange}
                type={BADGE_TYPE.LINE}
                className="fee-tier-bad"
              />
            )}
          </div>
          <SelectPriceRange
            opened={openedPriceRange}
            defaultPrice={defaultPrice}
            tokenA={tokenA}
            tokenB={tokenB}
            priceRanges={priceRanges}
            priceRange={priceRange}
            changePriceRange={changePriceRange}
            changeStartingPrice={changeStartingPrice}
            selectPool={selectPool}
            showDim={showDim}
            handleSwapValue={handleSwapValue}
            isEmptyLiquidity={isEmptyObject(feetierOfLiquidityMap)}
            isKeepToken={isKeepToken}
            setPriceRange={setPriceRange}
            defaultTicks={defaultTicks}
            resetPriceRangeTypeTarget={resetPriceRangeTypeTarget}
            isLoadingSelectPriceRange={isLoadingSelectPriceRange}
          />
          {selectedPriceRange &&
            existTokenPair &&
            selectedFeeRate &&
            !showDim && <SelectPriceRangeSummary {...priceRangeSummary} />}
          {!isLoading && isShowOutRange && (
            <OutOfRangeWrapper>
              <div>
                <IconFailed /> Your position will not earn any fees
              </div>
              <p>
                If you add a position with the current range, you will not earn
                any fees until the token price moves into your range.
              </p>
            </OutOfRangeWrapper>
          )}
        </article>

        <article className="selector-wrapper amount-input-wrapper">
          <div className="header-wrapper default-cursor">
            <h5>4. Enter Amounts</h5>
            <button className="setting-button" onClick={openSetting}>
              <IconSettings className="setting-icon" />
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
              compareToken={selectPool.compareToken}
              depositRatio={selectPool.depositRatio}
              tokenAInput={tokenAInput}
              tokenBInput={tokenBInput}
              changeTokenA={changeTokenA}
              changeTokenB={changeTokenB}
              changeTokenAAmount={changeTokenAAmount}
              changeTokenBAmount={changeTokenBAmount}
              connected={connected}
            />
          </div>
          {showDim && <div className="dim-content-4" />}
        </article>
        {isEarnAdd && !existTokenPair && <div className="dim-content" />}
      </div>
      <Button
        text={submitButtonStr}
        onClick={submit}
        style={{
          hierarchy: activatedSubmit
            ? ButtonHierarchy.Primary
            : ButtonHierarchy.Gray,
          fullWidth: true,
        }}
        disabled={!activatedSubmit}
        className="button-submit"
      />
      {submitType === "CREATE_POOL" &&
        existTokenPair &&
        selectedFeeRate &&
        hasStakingRewardPool && (
          <div className="btn-one-click" onClick={submitOneClickStaking}>
            <IconStaking /> One-Click Staking
          </div>
        )}
    </EarnAddLiquidityWrapper>
  );
};

export default EarnAddLiquidity;
