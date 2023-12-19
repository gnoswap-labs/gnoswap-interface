import React, { useCallback, useEffect, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import {
  AddLiquiditySubmitType,
  PriceRangeType,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useSlippage } from "@hooks/common/use-slippage";
import { useEarnAddLiquidityConfirmModal } from "@hooks/token/use-earn-add-liquidity-confirm-modal";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { useRouter } from "next/router";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { usePool } from "@hooks/pool/use-pool";
import { useTokenData } from "@hooks/token/use-token-data";
import { useOneClickStakingModal } from "@hooks/earn/use-one-click-staking-modal";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import BigNumber from "bignumber.js";
import { makeSwapFeeTier, priceToNearTick, tickToPrice } from "@utils/swap-utils";
import { usePoolData } from "@hooks/pool/use-pool-data";

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
  const [initialized, setInitialized] = useState(false);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN" } = swapValue;
  const router = useRouter();

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [exactType, setExactType] = useState<"EXACT_IN" | "EXACT_OUT">("EXACT_IN");
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>(null);
  const [priceRanges] = useState<AddLiquidityPriceRage[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>(
    null
  );
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const {
    connected: connectedWallet,
    account,
    switchNetwork,
    isSwitchNetwork,
  } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const { tokens, updateTokens, updateBalances, updateTokenPrices } = useTokenData();
  const [createOption, setCreateOption] = useState<{ startPrice: number | null, isCreate: boolean }>({ isCreate: false, startPrice: null });
  const selectPool = useSelectPool({ tokenA, tokenB, feeTier: swapFeeTier, isCreate: createOption?.isCreate, startPrice: createOption?.startPrice });
  const { pools: poolInfos, updatePools } = usePoolData();
  const { pools, feetierOfLiquidityMap, createPool, addLiquidity } = usePool({ tokenA, tokenB, compareToken: selectPool.compareToken });
  const { openModal: openOneClickModal } = useOneClickStakingModal({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    priceRange,
    selectPool,
    swapFeeTier,
  });

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
  }, [selectPool.currentPrice, selectPool.maxPrice, selectPool.minPrice, tokenA?.symbol, tokenB?.symbol]);

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
    return "CREATE_POOL";
  }, [connectedWallet, isSwitchNetwork, tokenA, tokenB, tokenAAmountInput.amount, tokenAAmountInput.balance, tokenBAmountInput.amount, tokenBAmountInput.balance, selectPool.minPrice, selectPool.maxPrice]);

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
  }, []);

  const selectSwapFeeTier = useCallback((swapFeeTier: SwapFeeTierType) => {
    setPriceRange(priceRanges.find(range => range.type === "Passive") || null);
    setSwapFeeTier(swapFeeTier);
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
      tokenBAmountInput.changeAmount(changedAmount.toFixed(tokenB?.decimals || 0, BigNumber.ROUND_FLOOR));
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
      tokenAAmountInput.changeAmount(changedAmount.toFixed(tokenA?.decimals || 0, BigNumber.ROUND_FLOOR));
    }
  }, [selectPool.compareToken?.symbol, selectPool.currentPrice, tokenAAmountInput, tokenB?.symbol, selectPool.depositRatio]);


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
  }, [createOption, selectPool.tickSpacing]);

  useEffect(() => {
    updatePools();
    updateTokenPrices();
  }, []);

  useEffect(() => {
    if (account?.address) {
      updateBalances();
    }
  }, [account?.address]);

  useEffect(() => {
    const poolId = router.query["pool-path"];
    const pool = poolInfos.find(pool => pool.id === poolId);
    if (pool) {
      const feeTier = makeSwapFeeTier(pool.fee);
      setSwapFeeTier(feeTier);
      setPriceRange({ type: "Passive" });
      setSwapValue({
        tokenA: pool.tokenA,
        tokenB: pool.tokenB,
        type: "EXACT_IN",
      });
    }
  }, [pools, router.query]);

  useEffect(() => {
    if (tokens.length === 0 || Object.keys(router.query).length === 0) {
      return;
    }
    if (!initialized) {
      const currentTokenA = tokens.find(token => token.path === router.query.tokenA) || null;
      const currentTokenB = tokens.find(token => token.path === router.query.tokenB) || null;
      setSwapValue(prev => ({
        ...prev,
        tokenA: currentTokenA,
        tokenB: currentTokenB,
      }));
      setInitialized(true);
      return;
    }
  }, [initialized, router, tokenA?.path, tokenB?.path, tokens]);

  useEffect(() => {
    if (exactType === "EXACT_IN") {
      updateTokenBAmountByTokenA(tokenAAmountInput.amount);
    } else {
      updateTokenAAmountByTokenB(tokenBAmountInput.amount);
    }
  }, [selectPool.currentPrice, selectPool.minPrice, selectPool.maxPosition, exactType]);

  useEffect(() => {
    if (!selectPool.feeTier) {
      setCreateOption({
        isCreate: true,
        startPrice: null
      });
      return;
    }
    const fee = SwapFeeTierInfoMap[selectPool.feeTier].fee;
    if (feetierOfLiquidityMap[fee] === undefined) {
      setCreateOption({
        isCreate: true,
        startPrice: null
      });
    } else {
      setCreateOption({
        isCreate: false,
        startPrice: null
      });
    }
  }, [feetierOfLiquidityMap, selectPool.feeTier]);

  useEffect(() => {
    if (pools.length > 0 && tokenA && tokenB && selectPool.compareToken) {
      const tokenPair = [tokenA.wrappedPath, tokenB.wrappedPath].sort();
      const compareToken = selectPool.compareToken;
      const reverse = tokenPair.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) ?
            compareToken.wrappedPath === path :
            compareToken.path === path;
        }
        return false;
      }) === 1;
      const prices = pools.map(pool => pool.price);
      const maxPrice = reverse ? 1 / Math.min(...prices) : Math.max(...prices);
      setDefaultPrice(maxPrice);
    } else {
      setDefaultPrice(null);
    }
  }, [pools, selectPool.compareToken, tokenA, tokenB]);

  return (
    <EarnAddLiquidity
      mode={"POOL"}
      defaultPrice={defaultPrice}
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
      isEarnAdd={false}
      connected={connectedWallet}
      slippage={slippage}
      changeSlippage={changeSlippage}
      openModal={openOneClickModal}
      selectPool={selectPool}
      handleClickOneStaking={() => null}
      changeStartingPrice={changeStartingPrice}
      createOption={{ isCreate: createOption?.isCreate || false, startPrice: createOption?.startPrice || null }}
    />
  );
};

export default EarnAddLiquidityContainer;
