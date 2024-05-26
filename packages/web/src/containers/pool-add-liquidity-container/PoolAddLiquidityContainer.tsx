import React, { useCallback, useEffect, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import {
  AddLiquiditySubmitType,
  DefaultTick,
  PriceRangeType,
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
import { useSelectPool } from "@hooks/pool/use-select-pool";
import BigNumber from "bignumber.js";
import {
  getDepositAmountsByAmountA,
  getDepositAmountsByAmountB,
  makeSwapFeeTier,
  priceToNearTick,
  priceToTick,
  tickToPrice,
} from "@utils/swap-utils";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { encryptId } from "@utils/common";
import { makeQueryString } from "@hooks/common/use-url-param";
import { isNumber } from "@utils/number-utils";
import { isFetchedPools } from "@states/pool";
import { useLoading } from "@hooks/common/use-loading";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";

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
  { type: "Custom" },
];

const EarnAddLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const {
    tokenA = null,
    tokenB = null,
    type = "EXACT_IN",
    isKeepToken = false,
  } = swapValue;
  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [exactType, setExactType] = useState<"EXACT_IN" | "EXACT_OUT">(
    "EXACT_IN",
  );
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>(null);
  const [priceRanges] = useState<AddLiquidityPriceRage[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>(
    null,
  );
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);
  const [priceRangeTypeFromUrl, setPriceRangeTypeFromUrl] =
    useState<PriceRangeType | null>();
  const [ticksFromUrl, setTickFromUrl] = useState<DefaultTick>();

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const {
    connected: connectedWallet,
    account,
    switchNetwork,
    isSwitchNetwork,
  } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const { tokens, updateTokens, updateBalances, updateTokenPrices } =
    useTokenData();
  const [createOption, setCreateOption] = useState<{
    startPrice: number | null;
    isCreate: boolean;
  }>({ isCreate: false, startPrice: null });
  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: swapFeeTier,
    isCreate: createOption?.isCreate,
    startPrice: createOption?.startPrice,
  });
  const { updatePools } = usePoolData();
  const {
    pools,
    feetierOfLiquidityMap,
    createPool,
    addLiquidity,
    isFetchingPools,
    fetching: isFetchingFeetierOfLiquidityMap,
  } = usePool({ tokenA, tokenB, compareToken: selectPool.compareToken });

  const { openAddPositionModal, openAddPositionWithStakingModal } =
    useEarnAddLiquidityConfirmModal({
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
  const { isLoadingCommon } = useLoading();

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    let depositRatio = "-";
    let feeBoost: string | null = null;
    if (selectPool.selectedFullRange) {
      const tokenASymbol =
        tokenA?.symbol === selectPool.compareToken?.symbol
          ? tokenA?.symbol
          : tokenB?.symbol;
      const tokenBSymbol =
        tokenA?.symbol === selectPool.compareToken?.symbol
          ? tokenB?.symbol
          : tokenA?.symbol;
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
      const tokenASymbol =
        tokenA?.symbol === selectPool.compareToken?.symbol
          ? tokenA?.symbol
          : tokenB?.symbol;
      const tokenBSymbol =
        tokenA?.symbol === selectPool.compareToken?.symbol
          ? tokenB?.symbol
          : tokenA?.symbol;
      depositRatio = `${tokenARatioStr}% ${tokenASymbol} / ${tokenBRatioStr}% ${tokenBSymbol}`;
    }
    feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    return {
      depositRatio,
      feeBoost,
      estimatedApr: "-",
    };
  }, [
    selectPool.currentPrice,
    selectPool.maxPrice,
    selectPool.minPrice,
    tokenA?.symbol,
    tokenB?.symbol,
  ]);

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
    if (
      selectPool.minPrice &&
      selectPool.maxPrice &&
      selectPool.minPrice >= selectPool.maxPrice
    ) {
      return "INVALID_RANGE";
    }
    if (
      !Number(tokenAAmountInput.amount) &&
      !Number(tokenBAmountInput.amount)
    ) {
      return "ENTER_AMOUNT";
    }
    if (
      Number(tokenAAmountInput.amount) < 0.000001 &&
      Number(tokenBAmountInput.amount) < 0.000001
    ) {
      return "AMOUNT_TOO_LOW";
    }
    if (
      Number(tokenAAmountInput.amount) >
      Number(parseFloat(tokenAAmountInput.balance.replace(/,/g, "")))
    ) {
      return "INSUFFICIENT_BALANCE";
    }
    if (
      Number(tokenBAmountInput.amount) >
      Number(parseFloat(tokenBAmountInput.balance.replace(/,/g, "")))
    ) {
      return "INSUFFICIENT_BALANCE";
    }
    return "CREATE_POOL";
  }, [
    connectedWallet,
    isSwitchNetwork,
    tokenA,
    tokenB,
    tokenAAmountInput.amount,
    tokenAAmountInput.balance,
    tokenBAmountInput.amount,
    tokenBAmountInput.balance,
    selectPool.minPrice,
    selectPool.maxPrice,
  ]);

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
  }, []);

  const selectSwapFeeTier = useCallback(
    (swapFeeTier: SwapFeeTierType) => {
      setSwapFeeTier(swapFeeTier);
      const existsSwapFeeTiers = pools.map(pool => makeSwapFeeTier(pool.fee));
      const existPool = existsSwapFeeTiers.includes(swapFeeTier);

      setCreateOption(prev => ({
        isCreate: !existPool,
        startPrice: existPool ? null : prev.startPrice,
      }));
    },
    [pools],
  );

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
    if (priceRange.type !== "Custom") {
      selectPool.setIsChangeMinMax(false);
      selectPool.setFullRange(false);
    }
  }, []);

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => ({
        tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
        tokenB:
          prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
        type: type,
      }));
    },
    [type],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => ({
        tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
        tokenA:
          prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
        type: type,
      }));
    },
    [type],
  );

  const changeTokenAAmount = useCallback(
    (amount: string) => {
      tokenAAmountInput.changeAmount(amount);
      setExactType("EXACT_IN");
      updateTokenBAmountByTokenA(amount);
    },
    [tokenAAmountInput],
  );

  const changeTokenBAmount = useCallback(
    (amount: string) => {
      tokenBAmountInput.changeAmount(amount);
      setExactType("EXACT_OUT");
      updateTokenAAmountByTokenB(amount);
    },
    [tokenBAmountInput],
  );

  const updateTokenBAmountByTokenA = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }
      if (!selectPool.currentPrice) {
        return;
      }

      if (/^0\.0(?:0*)$/.test(amount) || amount.toString() === "0") {
        tokenBAmountInput.changeAmount("0");
        return;
      }

      if (!amount || !tokenA || !tokenB) {
        return;
      }

      if (!selectPool.minPrice || !selectPool.maxPrice) {
        return;
      }

      const decimals = tokenB.decimals - tokenA.decimals;
      const amountRaw = makeRawTokenAmount(tokenA, amount) || 0;
      const { amountB } = getDepositAmountsByAmountA(
        BigNumber(selectPool.currentPrice).shiftedBy(decimals).toNumber(),
        BigNumber(selectPool.minPrice).shiftedBy(decimals).toNumber(),
        BigNumber(selectPool.maxPrice).shiftedBy(decimals).toNumber(),
        BigInt(amountRaw),
      );
      const expectedTokenAmount =
        makeDisplayTokenAmount(tokenB, amountB) || "0";
      tokenBAmountInput.changeAmount(expectedTokenAmount.toString());
    },
    [
      selectPool.currentPrice,
      selectPool.compareToken?.symbol,
      selectPool.minPrice,
      selectPool.maxPrice,
      tokenA?.symbol,
    ],
  );

  const updateTokenAAmountByTokenB = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }

      if (!selectPool.currentPrice) {
        return;
      }

      if (!amount || !tokenA || !tokenB) {
        return;
      }

      if (!selectPool.minPrice || !selectPool.maxPrice) {
        return;
      }

      const decimals = tokenB.decimals - tokenA.decimals;
      const amountRaw = makeRawTokenAmount(tokenB, amount) || 0;
      const { amountA } = getDepositAmountsByAmountB(
        BigNumber(selectPool.currentPrice).shiftedBy(decimals).toNumber(),
        BigNumber(selectPool.minPrice).shiftedBy(decimals).toNumber(),
        BigNumber(selectPool.maxPrice).shiftedBy(decimals).toNumber(),
        BigInt(amountRaw),
      );
      const expectedTokenAmount =
        makeDisplayTokenAmount(tokenA, amountA) || "0";
      tokenAAmountInput.changeAmount(expectedTokenAmount.toString());
    },
    [
      selectPool.currentPrice,
      selectPool.compareToken?.symbol,
      selectPool.minPrice,
      selectPool.maxPrice,
      tokenB?.symbol,
    ],
  );

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
    openAddPositionModal();
  }, [
    submitType,
    tokenA,
    tokenB,
    priceRange,
    swapFeeTier,
    openAddPositionModal,
    openConnectWalletModal,
    switchNetwork,
  ]);

  const submitOneClickStaking = useCallback(() => {
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
    openAddPositionWithStakingModal();
  }, [
    submitType,
    tokenA,
    tokenB,
    priceRange,
    swapFeeTier,
    openAddPositionWithStakingModal,
    openConnectWalletModal,
    switchNetwork,
  ]);

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
    if (tokens.length === 0 || Object.keys(router.query).length === 0) {
      return;
    }
    if (!initialized) {
      setInitialized(true);
      const query = router.query;

      const { tickLower, tickUpper, price_range_type } = router.query;
      if (price_range_type) {
        setPriceRangeTypeFromUrl(price_range_type as PriceRangeType);
        setPriceRange(
          PRICE_RANGES.find(
            item => item.type === (price_range_type ?? "Passive"),
          ) ?? null,
        );
      }
      setTickFromUrl({
        tickLower: tickLower ? tickToPrice(Number(tickLower)) : undefined,
        tickUpper: tickUpper ? tickToPrice(Number(tickUpper)) : undefined,
      });

      const convertPath = encryptId(query["pool-path"] as string);
      const splitPath: string[] = convertPath.split(":") || [];
      const currentTokenA =
        tokens.find(token => token.path === splitPath[0]) || null;
      const currentTokenB =
        tokens.find(token => token.path === splitPath[1]) || null;
      const feeTier = makeSwapFeeTier(splitPath[2]);
      setSwapFeeTier(feeTier);
      setSwapValue(prev => ({
        ...prev,
        tokenA: currentTokenA
          ? {
            ...currentTokenA,
          }
          : null,
        tokenB: currentTokenB
          ? {
            ...currentTokenB,
          }
          : null,
      }));
      return;
    }
  }, [initialized, router, tokenA?.path, tokenB?.path, tokens]);

  useEffect(() => {
    if (exactType === "EXACT_IN") {
      updateTokenBAmountByTokenA(tokenAAmountInput.amount);
    } else {
      updateTokenAAmountByTokenB(tokenBAmountInput.amount);
    }
  }, [
    selectPool.currentPrice,
    selectPool.minPrice,
    selectPool.maxPosition,
    exactType,
  ]);

  useEffect(() => {
    if (pools.length > 0 && tokenA && tokenB && selectPool.compareToken) {
      const tokenPair = [tokenA.wrappedPath, tokenB.wrappedPath].sort();
      const compareToken = selectPool.compareToken;
      const reverse =
        tokenPair.findIndex(path => {
          if (compareToken) {
            return isNativeToken(compareToken)
              ? compareToken.wrappedPath === path
              : compareToken.path === path;
          }
          return false;
        }) === 1;
      const priceOfMaxLiquidity =
        pools.sort((p1, p2) => p2.tvl - p1.tvl).at(0)?.price || null;
      if (priceOfMaxLiquidity) {
        const maxPrice = reverse
          ? 1 / priceOfMaxLiquidity
          : priceOfMaxLiquidity;
        setDefaultPrice(maxPrice);
      } else {
        setDefaultPrice(null);
      }
    } else {
      setDefaultPrice(null);
    }
  }, [pools, selectPool.compareToken, tokenA, tokenB]);

  const changeStartingPrice = useCallback(
    (price: string) => {
      if (price === "") {
        setCreateOption({
          ...createOption,
          startPrice: null,
          isCreate: createOption?.isCreate ? true : false,
        });
        return;
      }
      const priceNum = BigNumber(price).toNumber();
      if (BigNumber(Number(priceNum)).isNaN()) {
        setCreateOption({
          ...createOption,
          startPrice: null,
          isCreate: createOption?.isCreate ? true : false,
        });
        return;
      }
      const tick = priceToNearTick(priceNum, selectPool.tickSpacing);
      const nearStartPrice = tickToPrice(tick);
      setCreateOption({
        isCreate: true,
        startPrice: nearStartPrice,
      });
    },
    [createOption, selectPool.tickSpacing],
  );

  const handleSwapValue = useCallback(() => {
    const tempTokenA = swapValue.tokenA;
    const tempTokenB = swapValue.tokenB;
    setSwapValue({
      ...swapValue,
      tokenA: tempTokenB,
      tokenB: tempTokenA,
      isEarnChanged: true,
      isReverted: true,
      isKeepToken: !isKeepToken,
    });
  }, [swapValue, setSwapValue, isKeepToken]);

  useEffect(() => {
    if (selectPool.isChangeMinMax) {
      setPriceRange({ type: "Custom" });
    }
  }, [selectPool.isChangeMinMax]);

  useEffect(() => {
    selectPool.setIsChangeMinMax(priceRange?.type === "Custom");
  }, [priceRange?.type]);

  useEffect(() => {
    if (
      !isFetchedPools ||
      !swapFeeTier ||
      !tokenA ||
      !tokenB ||
      swapFeeTier === "NONE"
    ) {
      return;
    }

    const poolFeeTier = pools.map(pool => makeSwapFeeTier(pool.fee));
    const existPool = poolFeeTier.includes(swapFeeTier);

    if (existPool) {
      if (router.query.price_range_type) {
        setPriceRange(
          priceRanges.find(
            range => range.type === router.query.price_range_type,
          ) || null,
        );
        return;
      }
      setPriceRange(
        priceRanges.find(range => range.type === "Passive") || null,
      );
    } else {
      setPriceRange(priceRanges.find(range => range.type === "Custom") || null);
    }
  }, [
    swapFeeTier,
    pools,
    isFetchedPools,
    priceRanges,
    tokenA,
    tokenB,
    router.query.price_range_type,
  ]);

  useEffect(() => {
    const queryString = makeQueryString({
      price_range_type: priceRange?.type,
      tickLower: isNumber(selectPool.minPosition || "")
        ? priceToTick(selectPool.minPosition || 0)
        : null,
      tickUpper: isNumber(selectPool.maxPosition || "")
        ? priceToTick(selectPool.maxPosition || 0)
        : null,
    });
    if (tokenA?.path && tokenB?.path) {
      router.push(
        `/earn/pool/${router.query["pool-path"]}/add?${queryString}`,
        undefined,
        { shallow: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectPool.minPosition, selectPool.maxPosition, priceRange?.type]);

  const showDim = useMemo(() => {
    return !!(
      tokenA &&
      tokenB &&
      selectPool.isCreate &&
      !createOption.startPrice &&
      isFetchedPools
    );
  }, [selectPool.isCreate, tokenA, tokenB, createOption.startPrice]);

  const isLoadingSelectFeeTier = useMemo(() => {
    return (
      isFetchingFeetierOfLiquidityMap || isFetchingPools || isLoadingCommon
    );
  }, [isFetchingFeetierOfLiquidityMap, isFetchingPools, isLoadingCommon]);

  const isLoadingSelectPriceRange = useMemo(() => {
    return isFetchingPools || isLoadingCommon;
  }, [isFetchingPools, isLoadingCommon]);

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
      pools={pools}
      currentTick={null}
      submitType={submitType}
      submit={submit}
      isEarnAdd={false}
      connected={connectedWallet}
      slippage={slippage}
      changeSlippage={changeSlippage}
      submitOneClickStaking={submitOneClickStaking}
      selectPool={selectPool}
      changeStartingPrice={changeStartingPrice}
      createOption={{
        isCreate: createOption?.isCreate || false,
        startPrice: createOption?.startPrice || null,
      }}
      handleSwapValue={handleSwapValue}
      isKeepToken={isKeepToken}
      setPriceRange={type =>
        setPriceRange(PRICE_RANGES.find(item => item.type === type) ?? null)
      }
      defaultTicks={ticksFromUrl}
      resetPriceRangeTypeTarget={priceRangeTypeFromUrl ?? "Passive"}
      showDim={showDim}
      isLoadingSelectFeeTier={isLoadingSelectFeeTier}
      isLoadingSelectPriceRange={isLoadingSelectPriceRange}
    />
  );
};

export default EarnAddLiquidityContainer;
