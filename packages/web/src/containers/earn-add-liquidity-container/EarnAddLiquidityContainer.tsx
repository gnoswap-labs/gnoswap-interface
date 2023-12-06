import React, { useCallback, useEffect, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import {
  AddLiquiditySubmitType,
  PriceRangeType,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { useWallet } from "@hooks/wallet/use-wallet";
// import BigNumber from "bignumber.js";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useEarnAddLiquidityConfirmModal } from "@hooks/token/use-earn-add-liquidity-confirm-modal";
import { useAtom } from "jotai";
import { EarnState, SwapState } from "@states/index";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { usePool } from "@hooks/pool/use-pool";
import { useOneClickStakingModal } from "@hooks/earn/use-one-click-staking-modal";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import BigNumber from "bignumber.js";
import { priceToNearTick, tickToPrice } from "@utils/swap-utils";

export interface AddLiquidityPriceRage {
  type: PriceRangeType;
  apr?: string;
}

export interface PoolTick {
  value: string;
  price: string;
  tick: number;
}

export interface PriceRangeSummary {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

export const SWAP_FEE_TIERS: SwapFeeTierType[] = [
  "FEE_100",
  "FEE_500",
  "FEE_3000",
  "FEE_10000",
];

const PRICE_RANGES: AddLiquidityPriceRage[] = [
  { type: "Active" },
  { type: "Passive" },
  { type: "Custom" }
];

const EarnAddLiquidityContainer: React.FC = () => {
  const [isEarnAdd, setIsEarnAdd] = useAtom(EarnState.isOneClick);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN" } = swapValue;

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [exactType, setExactType] = useState<"EXACT_IN" | "EXACT_OUT">("EXACT_IN");
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>(null);
  const [priceRanges] = useState<AddLiquidityPriceRage[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>(
    null
  );

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const {
    connected: connectedWallet,
    account,
    switchNetwork,
    isSwitchNetwork,
  } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const { updateTokenPrices } = useTokenData();
  const [createOption, setCreateOption] = useState<{ startPrice: number | null, isCreate: boolean }>({ isCreate: false, startPrice: null });
  const selectPool = useSelectPool({ tokenA, tokenB, feeTier: swapFeeTier, isCreate: createOption.isCreate, startPrice: createOption.startPrice });
  const { pools, feetierOfLiquidityMap, createPool, addLiquidity } = usePool({ tokenA, tokenB, compareToken: selectPool.compareToken });
  const { openModal: openConfirmModal } = useEarnAddLiquidityConfirmModal({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    selectPool,
    slippage,
    swapFeeTier,
    createPool,
    addLiquidity,
  });

  const { openModal: openOneClickModal } = useOneClickStakingModal({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    priceRange,
    selectPool,
    swapFeeTier,
  });

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    let depositRatio = "-";
    let feeBoost: string | null = null;
    if (selectPool.selectedFullRange) {
      const tokenASymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenA?.symbol : tokenB?.symbol;
      const tokenBSymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenB?.symbol : tokenA?.symbol;
      depositRatio = `50.0% ${tokenASymbol} / 50.0% ${tokenBSymbol}`;
      return {
        depositRatio,
        feeBoost: "x1",
        estimatedApr: "-",
      };
    }
    const deposiRatio = selectPool.depositRatio;
    if (deposiRatio !== null) {
      const tokenARatioStr = BigNumber(deposiRatio).toFixed(1);
      const tokenBRatioStr = BigNumber(100 - deposiRatio).toFixed(1);
      const tokenASymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenA?.symbol : tokenB?.symbol;
      const tokenBSymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenB?.symbol : tokenA?.symbol;
      depositRatio = `${tokenARatioStr}% ${tokenASymbol} / ${tokenBRatioStr}% ${tokenBSymbol}`;

    }
    feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    return {
      depositRatio,
      feeBoost,
      estimatedApr: "-",
    };
  }, [selectPool.compareToken?.symbol, selectPool.depositRatio, selectPool.feeBoost, selectPool.selectedFullRange, tokenA?.symbol, tokenB?.symbol]);

  const submitType: AddLiquiditySubmitType = useMemo(() => {
    if (!connectedWallet) {
      return "CONNECT_WALLET";
    }
    if (isSwitchNetwork) {
      return "SWITCH_NETWORK";
    }
    if (!tokenA || !tokenB) {
      return "INVALID_PAIR";
    }
    if ((selectPool.minPrice && selectPool.maxPrice) && selectPool.minPrice >= selectPool.maxPrice) {
      return "INVALID_RANGE";
    }
    if (!Number(tokenAAmountInput.amount) && !Number(tokenBAmountInput.amount)) {
      return "ENTER_AMOUNT";
    }
    if (Number(tokenAAmountInput.amount) < 0.000001 && Number(tokenBAmountInput.amount) < 0.000001) {
      return "AMOUNT_TOO_LOW";
    }
    if (Number(tokenAAmountInput.amount) > Number(parseFloat(tokenAAmountInput.balance.replace(/,/g, "")))) {
      return "INSUFFICIENT_BALANCE";
    }
    if (Number(tokenBAmountInput.amount) > Number(parseFloat(tokenBAmountInput.balance.replace(/,/g, "")))) {
      return "INSUFFICIENT_BALANCE";
    }

    // if (!account?.balances || account.balances.length === 0) {
    //   return "INSUFFICIENT_BALANCE";
    // }
    // if (BigNumber(account.balances[0].amount).isLessThanOrEqualTo(1)) {
    //   return "INSUFFICIENT_BALANCE";
    // }
    if (!account?.balances || account.balances.length === 0) {
      return "INSUFFICIENT_BALANCE";
    }
    if (BigNumber(account.balances[0].amount).isLessThanOrEqualTo(1)) {
      return "INSUFFICIENT_BALANCE";
    }
    const ordered = selectPool.compareToken?.path === tokenA?.path;
    const checkTokenA = ordered ? selectPool.depositRatio !== 0 : selectPool.depositRatio !== 100;
    const checkTokenB = ordered ? selectPool.depositRatio !== 100 : selectPool.depositRatio !== 0;
    if (checkTokenA && !BigNumber(tokenAAmountInput.amount).isGreaterThan(0)) {
      return "ENTER_AMOUNT";
    }
    if (checkTokenB && !BigNumber(tokenBAmountInput.amount).isGreaterThan(0)) {
      return "ENTER_AMOUNT";
    }
    return "CREATE_POOL";
  }, [connectedWallet, isSwitchNetwork, tokenA, tokenB, tokenAAmountInput.amount, tokenAAmountInput.balance, tokenBAmountInput.amount, tokenBAmountInput.balance, selectPool.minPrice, selectPool.maxPrice, selectPool.compareToken?.path, selectPool.depositRatio, account?.balances]);

  useEffect(() => {
    updateTokenPrices();
  }, []);

  const selectSwapFeeTier = useCallback((swapFeeTier: SwapFeeTierType) => {
    setSwapFeeTier(swapFeeTier);
    setPriceRange(priceRanges.find(range => range.type === "Passive") || null);
  }, [priceRanges]);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
  }, []);

  const changeTokenA = useCallback((token: TokenModel) => {
    setSwapValue((prev) => ({
      tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
      tokenB: prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
      type: type,
    }));
  }, [type]);

  const changeTokenB = useCallback((token: TokenModel) => {
    setSwapValue((prev) => ({
      tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
      tokenA: prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
      type: type,
    }));
  }, [type]);

  const changeStartingPrice = useCallback((price: string) => {
    if (price === "") {
      setCreateOption({
        ...createOption,
        startPrice: null
      });
      return;
    }
    const priceNum = BigNumber(price).toNumber();
    if (BigNumber(Number(priceNum)).isNaN()) {
      setCreateOption({
        ...createOption,
        startPrice: null
      });
      return;
    }
    const tick = priceToNearTick(priceNum, selectPool.tickSpacing);
    const nearStartPrice = tickToPrice(tick);
    setCreateOption({
      isCreate: true,
      startPrice: nearStartPrice
    });
  }, [selectPool.tickSpacing]);

  const updateTokenBAmountByTokenA = useCallback((amount: string) => {
    if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
      return;
    }
    if (selectPool.currentPrice === null) {
      return;
    }
    const ordered = tokenA?.symbol === selectPool.compareToken?.symbol;
    const currentPrice = ordered ? selectPool.currentPrice : 1 / selectPool.currentPrice;
    const depositRatioA = selectPool.depositRatio;
    if (selectPool.minPrice === null || selectPool.maxPrice === null || depositRatioA === null) {
      tokenBAmountInput.changeAmount(BigNumber(amount).multipliedBy(currentPrice).toFixed(0));
    } else {
      const isZero = ordered ? depositRatioA === 100 : depositRatioA === 0;
      if (isZero) {
        tokenBAmountInput.changeAmount("0");
        return;
      }
      const depositRatioB = 100 - depositRatioA;
      const ratio = ordered ? depositRatioB / depositRatioA : depositRatioA / depositRatioB;
      const changedAmount = BigNumber(amount).multipliedBy(currentPrice * ratio);
      tokenBAmountInput.changeAmount(changedAmount.toFixed(0));
    }
  }, [selectPool.compareToken?.symbol, selectPool.currentPrice, tokenA?.symbol, tokenBAmountInput, selectPool.depositRatio]);

  const updateTokenAAmountByTokenB = useCallback((amount: string) => {
    if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
      return;
    }
    if (selectPool.currentPrice === null) {
      return;
    }
    const ordered = tokenB?.symbol === selectPool.compareToken?.symbol;
    const currentPrice = ordered ? selectPool.currentPrice : 1 / selectPool.currentPrice;
    const depositRatioA = selectPool.depositRatio;
    if (!selectPool.minPrice || !selectPool.maxPrice || depositRatioA === null) {
      tokenAAmountInput.changeAmount(BigNumber(amount).multipliedBy(currentPrice).toFixed(0));
    } else {
      const isZero = ordered ? depositRatioA === 100 : depositRatioA === 0;
      if (isZero) {
        tokenAAmountInput.changeAmount("0");
        return;
      }
      const depositRatioB = 100 - depositRatioA;
      const ratio = ordered ? depositRatioB / depositRatioA : depositRatioA / depositRatioB;
      const changedAmount = BigNumber(amount).multipliedBy(currentPrice * ratio);
      tokenAAmountInput.changeAmount(changedAmount.toFixed(0));
    }
  }, [selectPool.compareToken?.symbol, selectPool.currentPrice, tokenAAmountInput, tokenB?.symbol, selectPool.depositRatio]);


  const changeTokenAAmount = useCallback((amount: string) => {
    tokenAAmountInput.changeAmount(amount);
    setExactType("EXACT_IN");
    updateTokenBAmountByTokenA(amount);
  }, [tokenAAmountInput]);

  const changeTokenBAmount = useCallback((amount: string) => {
    tokenBAmountInput.changeAmount(amount);
    setExactType("EXACT_OUT");
    updateTokenAAmountByTokenB(amount);
  }, [tokenBAmountInput]);

  const submit = useCallback(() => {
    if (submitType === "CONNECT_WALLET") {
      openConnectWalletModal();
      return;
    }
    if (submitType === "SWITCH_NETWORK") {
      switchNetwork();
      return;
    }
    if (submitType !== "CREATE_POOL") {
      return;
    }
    if (!tokenA || !tokenB || !priceRange || !swapFeeTier) {
      return;
    }
    openConfirmModal();
  }, [
    submitType,
    tokenA,
    tokenB,
    priceRange,
    swapFeeTier,
    openConfirmModal,
    openConnectWalletModal,
    switchNetwork,
  ]);

  const handleClickOneStaking = useCallback(() => {
    if (!isEarnAdd) {
      setIsEarnAdd(true);
    }
  }, [isEarnAdd, setIsEarnAdd]);

  useEffect(() => {
    if (exactType === "EXACT_IN") {
      updateTokenBAmountByTokenA(tokenAAmountInput.amount);
    } else {
      updateTokenAAmountByTokenB(tokenBAmountInput.amount);
    }
  }, [selectPool.currentPrice, selectPool.minPrice, selectPool.maxPosition]);

  useEffect(() => {
    if (!swapFeeTier) {
      return;
    }
    const fee = SwapFeeTierInfoMap[swapFeeTier].fee;
    if (feetierOfLiquidityMap[fee] === undefined) {
      setCreateOption({
        ...createOption,
        isCreate: true
      });
    } else {
      setCreateOption({
        ...createOption,
        isCreate: false
      });
    }
  }, [feetierOfLiquidityMap, swapFeeTier]);

  return (
    <EarnAddLiquidity
      mode={"POOL"}
      tokenA={tokenA}
      tokenB={tokenB}
      tokenAInput={tokenAAmountInput}
      tokenBInput={tokenBAmountInput}
      changeTokenA={changeTokenA}
      changeTokenB={changeTokenB}
      changeTokenAAmount={changeTokenAAmount}
      changeTokenBAmount={changeTokenBAmount}
      feeTiers={SWAP_FEE_TIERS}
      feetierOfLiquidityMap={feetierOfLiquidityMap}
      feeTier={swapFeeTier}
      selectFeeTier={selectSwapFeeTier}
      priceRanges={priceRanges}
      priceRange={priceRange}
      priceRangeSummary={priceRangeSummary}
      changePriceRange={changePriceRange}
      ticks={[]}
      pools={pools}
      currentTick={null}
      submitType={submitType}
      submit={submit}
      isEarnAdd={true}
      connected={connectedWallet}
      slippage={slippage}
      changeSlippage={changeSlippage}
      handleClickOneStaking={handleClickOneStaking}
      openModal={openOneClickModal}
      selectPool={selectPool}
      changeStartingPrice={changeStartingPrice}
    />
  );
};

export default EarnAddLiquidityContainer;
