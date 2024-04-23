import React, { useCallback, useEffect, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import {
  AddLiquiditySubmitType,
  PriceRangeType,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { TokenModel, isNativeToken } from "@models/token/token-model";
import { useWallet } from "@hooks/wallet/use-wallet";
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
import { makeSwapFeeTier, priceToNearTick, tickToPrice } from "@utils/swap-utils";
// import { makeSwapFeeTier, priceToNearTick, priceToTick, tickToPrice } from "@utils/swap-utils";
import { useRouter } from "next/router";
import { PoolModel } from "@models/pool/pool-model";
// import { makeQueryString } from "@hooks/common/use-url-param";
// import { isNumber } from "@utils/number-utils";

export interface AddLiquidityPriceRage {
  type: PriceRangeType;
  apr?: string;
  text?: string;
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
  { type: "Active", text: "[-10% / +10%]" },
  { type: "Passive", text: "[-50% / +100%]" },
  { type: "Custom" }
];

const EarnAddLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const [isEarnAdd, setIsEarnAdd] = useAtom(EarnState.isOneClick); // Not used any more
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN", isReverted, isKeepToken = false } = swapValue;

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [exactType, setExactType] = useState<"EXACT_IN" | "EXACT_OUT">("EXACT_IN");
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>("FEE_3000");
  const [priceRanges] = useState<AddLiquidityPriceRage[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const {
    connected: connectedWallet,
    account,
    switchNetwork,
    isSwitchNetwork,
  } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const { updateBalances, updateTokenPrices, tokens } = useTokenData();
  const [createOption, setCreateOption] = useState<{ startPrice: number | null, isCreate: boolean }>({ isCreate: false, startPrice: null });
  const selectPool = useSelectPool({ 
    tokenA, 
    tokenB, 
    feeTier: swapFeeTier, 
    isCreate: createOption.isCreate, 
    startPrice: createOption.startPrice,
  });
  const { fetching, pools, feetierOfLiquidityMap, createPool, addLiquidity } = usePool({ tokenA, tokenB, compareToken: selectPool.compareToken, isReverted });
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
  }, [connectedWallet, isSwitchNetwork, tokenA, tokenB, tokenAAmountInput.amount, tokenAAmountInput.balance, tokenBAmountInput.amount, tokenBAmountInput.balance, selectPool.minPrice, selectPool.maxPrice, selectPool.compareToken?.path, selectPool.depositRatio]);

  const selectSwapFeeTier = useCallback((feeTier: SwapFeeTierType) => {
    setSwapFeeTier(feeTier);
    const poolFeeTier = pools.map(pool => makeSwapFeeTier(pool.fee));
    const existPool = poolFeeTier.includes(feeTier);

    setCreateOption((prev) => ({
      isCreate: !existPool,
      startPrice: existPool ? null : prev.startPrice
    }));

    if (existPool) {
      setPriceRange(priceRanges.find(range => range.type === "Passive") || null);
    } else {
      setPriceRange(priceRanges.find(range => range.type === "Custom") || null);
    }
  }, [pools, priceRanges]);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
    if (priceRange.type !== "Custom") {
      selectPool.setIsChangeMinMax(false);
    }
  }, []);

  useEffect(() => {
    if (selectPool.isChangeMinMax) {
      setPriceRange({ type: "Custom" });
    }
  }, [selectPool.isChangeMinMax]);

  useEffect(() => {
    if (priceRange?.type !== "Custom") {
      selectPool.setIsChangeMinMax(false);
    } else {
      selectPool.setIsChangeMinMax(true);
    }
  }, [priceRange?.type]);

  const changeTokenA = useCallback((token: TokenModel) => {
    setSwapValue((prev) => {
      if (token.wrappedPath === prev.tokenB?.wrappedPath) {
        return {
          tokenA: token,
          tokenB: null,
          type: type,
        };
      }
      selectPool.setCompareToken(token);
      return {
        tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
        tokenB: prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
        type: type,
        isReverted: false,
        isKeepToken: !isKeepToken,
      };
    });
    selectSwapFeeTier("NONE");
  }, [type, isKeepToken]);

  const changeTokenB = useCallback((token: TokenModel) => {
    setSwapValue((prev) => {
      if (token.wrappedPath === prev.tokenA?.wrappedPath) {
        return {
          tokenA: null,
          tokenB: token,
          type: type,
        };
      }
      return {
        tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
        tokenA: prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
        type: type,
        isReverted: false,
      };
    });
    selectSwapFeeTier("NONE");
  }, [type]);

  const changeStartingPrice = useCallback((price: string) => {
    if (price === "") {
      setCreateOption((prev) => ({
        ...prev,
        startPrice: null
      }));
      return;
    }
    const priceNum = BigNumber(price).toNumber();
    if (BigNumber(Number(priceNum)).isNaN()) {
      setCreateOption((prev) => ({
        ...prev,
        startPrice: null
      }));
      return;
    }
    const tick = priceToNearTick(priceNum, selectPool.tickSpacing);
    const nearStartPrice = tickToPrice(tick);
    setCreateOption((prev) => ({
      ...prev,
      startPrice: nearStartPrice
    }));
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
    updateTokenPrices();
  }, []);

  useEffect(() => {
    if (account?.address) {
      updateBalances();
    }
  }, [account?.address]);
  useEffect(() => {
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });
    selectSwapFeeTier("NONE");
    setIsEarnAdd(false);
  }, []);
  useEffect(() => {
    if (tokens.length === 0 || Object.keys(router.query).length === 0) {
      return;
    }
    if (!initialized) {
      setInitialized(true);
      const query = router.query;
      const currentTokenA = tokens.find(token => token.path === query.tokenA) || null;
      const currentTokenB = tokens.find(token => token.path === query.tokenB) || null;
      setSwapValue({
        tokenA: currentTokenA,
        tokenB: currentTokenB,
        type: "EXACT_IN",
      });
      return;
    }
  }, [initialized, router, tokens]);

  useEffect(() => {
    const isEarnAdd = swapValue.tokenA !== null && swapValue.tokenB !== null;
    setIsEarnAdd(isEarnAdd);
  }, [setIsEarnAdd, swapValue]);

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
      const priceOfMaxLiquidity = pools.sort((pool1: PoolModel, pool2: PoolModel) => pool2.tvl - pool1.tvl).at(0)?.price || null;
      if (priceOfMaxLiquidity) {
        const maxPrice = reverse ? 1 / priceOfMaxLiquidity : priceOfMaxLiquidity;
        setDefaultPrice(maxPrice);
      } else {
        setDefaultPrice(null);
      }
    } else {
      setDefaultPrice(null);
    }
  }, [pools, selectPool.compareToken, tokenA, tokenB]);

  useEffect(() => {
    if (fetching && !swapValue?.isEarnChanged) {
      if (router.query?.fee_tier) {
        selectSwapFeeTier(`FEE_${router.query?.fee_tier}` as SwapFeeTierType);
      } else {
        selectSwapFeeTier("FEE_3000");
      }
      setSwapValue({
        tokenA,
        tokenB,
        type: "EXACT_IN",
      });
    }
  }, [fetching, swapValue?.isEarnChanged, pools, priceRanges]);

  const handleSwapValue = useCallback(() => {
    const tempTokenA = swapValue.tokenA;
    const tempTokenB = swapValue.tokenB;
    setSwapValue({
      ...swapValue,
      tokenA: tempTokenB,
      tokenB: tempTokenA,
      isEarnChanged: true,
      isReverted: true,
      isKeepToken: !isKeepToken
    });
  }, [swapValue, setSwapValue, isKeepToken]);

  // useEffect(() => {
  //   const queryString = makeQueryString({
  //     tokenA: tokenA?.path,
  //     tokenB: tokenB?.path,
  //     fee_tier: swapFeeTier === "NONE" ? "" : (swapFeeTier || "").slice(4),
  //     price_range_type: priceRange?.type,
  //     ...((priceRange?.type === "Custom") && {
  //       customTickLower: isNumber(selectPool.minPosition || "") ? priceToTick(selectPool.minPosition || 0) : null,
  //       customTickUpper: isNumber(selectPool.maxPosition || "") ? priceToTick(selectPool.maxPosition || 0) : null,
  //     }),
  //   });
  //   if (tokenA?.path && tokenB?.path) {
  //     router.push(`/earn/add${queryString ? "?" + queryString : ""}`, undefined, { shallow: true });
  //   }
  // }, [swapFeeTier, tokenA, tokenB, selectPool.minPosition, selectPool.maxPosition, priceRange?.type]);

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
      isEarnAdd={true}
      connected={connectedWallet}
      slippage={slippage}
      changeSlippage={changeSlippage}
      handleClickOneStaking={handleClickOneStaking}
      openModal={openOneClickModal}
      selectPool={selectPool}
      changeStartingPrice={changeStartingPrice}
      createOption={createOption}
      fetching={fetching}
      handleSwapValue={handleSwapValue}
      isKeepToken={isKeepToken}
      /// Update with provided price range, if receive undefine set to default price range
      setPriceRange={(type) => {
        setPriceRange(PRICE_RANGES.find(item => item.type === (type || "Passive")) ?? null);
      }}
      defaultPriceRangeType={"Passive"}
    />
  );
};

export default EarnAddLiquidityContainer;
