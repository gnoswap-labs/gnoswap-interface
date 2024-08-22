import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  AddLiquiditySubmitType,
  DefaultTick,
  PriceRangeMeta,
  PriceRangeType,
  SwapFeeTierType
} from "@constants/option.constant";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useRouterBack } from "@hooks/common/use-router-back";
import { useSlippage } from "@hooks/common/use-slippage";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { SwapState } from "@states/index";
import { formatRate } from "@utils/new-number-utils";
import { makeRouteUrl } from "@utils/page.utils";
import { checkPoolStakingRewards } from "@utils/pool-utils";
import {
  getDepositAmountsByAmountA,
  getDepositAmountsByAmountB,
  makeSwapFeeTier,
  priceToNearTick,
  priceToTick,
  tickToPrice,
} from "@utils/swap-utils";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";

import PoolAddLiquidity, {
  PriceRangeSummary,
} from "../../components/pool-add-liquidity/PoolAddLiquidity";
import { usePool } from "../../hooks/use-pool";
import { usePoolAddLiquidityConfirmModal } from "../../hooks/use-pool-add-liquidity-confirm-modal";

export const SWAP_FEE_TIERS: SwapFeeTierType[] = [
  "FEE_100",
  "FEE_500",
  "FEE_3000",
  "FEE_10000",
];

const PRICE_RANGES: PriceRangeMeta[] = [
  { type: "Active", text: "[-10% / +10%]" },
  { type: "Passive", text: "[-50% / +100%]" },
  { type: "Custom" },
];

const PoolAddLiquidityContainer: React.FC = () => {
  const router = useCustomRouter();
  useRouterBack();
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
  const [priceRanges] = useState<PriceRangeMeta[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<PriceRangeMeta | null>(
    null,
  );
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);
  const [priceRangeTypeFromUrl, setPriceRangeTypeFromUrl] =
    useState<PriceRangeType | null>();
  const [ticksFromUrl, setTickFromUrl] = useState<DefaultTick>();
  const { getGnotPath } = useGnotToGnot();

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
    usePoolAddLiquidityConfirmModal({
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
  const { isLoading: isLoadingCommon } = useLoading();

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    let depositRatio = "-";
    let feeBoost: string = "-";
    let estimatedApr: string = formatRate(selectPool.estimatedAPR) ?? "-";

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
        estimatedApr,
      };
    }

    const tokenAdepositRatio = selectPool.depositRatio;
    if (tokenAdepositRatio !== null) {
      const tokenARatioStr = BigNumber(tokenAdepositRatio).toFixed(1);
      const tokenBRatioStr = BigNumber(100 - tokenAdepositRatio).toFixed(1);
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
    if (tokenAdepositRatio === 0 || tokenAdepositRatio === 100) {
      estimatedApr = "-";
    } else {
      feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;
    }

    return {
      depositRatio,
      feeBoost,
      estimatedApr,
    };
  }, [
    selectPool.compareToken?.symbol,
    selectPool.depositRatio,
    selectPool.feeBoost,
    selectPool.selectedFullRange,
    tokenA?.symbol,
    tokenB?.symbol,
    selectPool.estimatedAPR,
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

  const changePriceRange = useCallback((priceRange: PriceRangeMeta) => {
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

    return () =>
      setSwapValue({
        tokenA: null,
        tokenB: null,
        type: "EXACT_IN",
        tokenBAmount: "",
        tokenAAmount: "",
        isEarnChanged: false,
        isReverted: false,
        isKeepToken: false,
      });
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

      const poolPath = router.getPoolPath() || "";
      const splitPath: string[] = poolPath.split(":") || [];
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
              path: getGnotPath(currentTokenA).path,
              name: getGnotPath(currentTokenA).name,
              symbol: getGnotPath(currentTokenA).symbol,
              logoURI: getGnotPath(currentTokenA).logoURI,
            }
          : null,
        tokenB: currentTokenB
          ? {
              ...currentTokenB,
              path: getGnotPath(currentTokenB).path,
              name: getGnotPath(currentTokenB).name,
              symbol: getGnotPath(currentTokenB).symbol,
              logoURI: getGnotPath(currentTokenB).logoURI,
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
        pools.sort((p1, p2) => Number(p2.tvl) - Number(p1.tvl)).at(0)?.price ||
        null;
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
    priceRanges,
    tokenA,
    tokenB,
    router.query.price_range_type,
  ]);

  useEffect(() => {
    const query = {
      [QUERY_PARAMETER.POOL_PATH]: router.getPoolPath(),
      price_range_type: priceRange?.type,
      tickLower:
        selectPool.minPosition !== null
          ? priceToTick(selectPool.minPosition)
          : null,
      tickUpper:
        selectPool.maxPosition !== null
          ? priceToTick(selectPool.maxPosition)
          : null,
    };
    if (tokenA?.path && tokenB?.path) {
      window.history.pushState(
        null,
        "",
        makeRouteUrl(PAGE_PATH.POOL_ADD, query),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectPool.minPosition, selectPool.maxPosition, priceRange?.type]);

  const showDim = useMemo(() => {
    return !!(
      tokenA &&
      tokenB &&
      selectPool.isCreate &&
      !createOption.startPrice
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

  const showOneClickStaking = useMemo(
    () => checkPoolStakingRewards(selectPool.poolInfo?.dbData?.incentiveType),
    [selectPool.poolInfo?.dbData?.incentiveType],
  );

  return (
    <PoolAddLiquidity
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
      showOneClickStaking={showOneClickStaking}
    />
  );
};

export default PoolAddLiquidityContainer;
