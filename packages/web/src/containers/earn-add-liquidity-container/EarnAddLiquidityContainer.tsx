import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useSelectPool } from "@hooks/pool/use-select-pool";
import BigNumber from "bignumber.js";
import {
  makeSwapFeeTier,
  priceToNearTick,
  priceToTick,
  tickToPrice,
} from "@utils/swap-utils";
import { useRouter } from "next/router";
import { PoolModel } from "@models/pool/pool-model";
import { useLoading } from "@hooks/common/use-loading";
import { makeQueryString } from "@hooks/common/use-url-param";
import { isNumber } from "@utils/number-utils";

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

  const [, setIsEarnAdd] = useAtom(EarnState.isEarnAdd);
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const {
    tokenA = null,
    tokenB = null,
    type = "EXACT_IN",
    isReverted,
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
  const [initialized, setInitialized] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);
  const initializedFeeTier = useRef<string>();
  const initializedPriceRange = useRef<AddLiquidityPriceRage>();

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const {
    connected: connectedWallet,
    account,
    switchNetwork,
    isSwitchNetwork,
  } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const {
    updateBalances,
    updateTokenPrices,
    tokens,
    loading: isLoadingTokens,
  } = useTokenData();
  const [createOption, setCreateOption] = useState<{
    startPrice: number | null;
    isCreate: boolean;
  }>({ isCreate: false, startPrice: null });
  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: swapFeeTier,
    isCreate: createOption.isCreate,
    startPrice: createOption.startPrice,
  });
  const {
    fetching: isFetchingFeetierOfLiquidityMap,
    pools,
    feetierOfLiquidityMap,
    createPool,
    addLiquidity,
    isFetchedPools,
    isFetchingPools,
  } = usePool({
    tokenA,
    tokenB,
    compareToken: selectPool.compareToken,
    isReverted,
  });
  const {
    openAddPositionModal,
    openAddPositionWithStakingModal,
  } = useEarnAddLiquidityConfirmModal({
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
    selectPool.compareToken?.symbol,
    selectPool.depositRatio,
    selectPool.feeBoost,
    selectPool.selectedFullRange,
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
      Number(parseFloat(tokenAAmountInput.balance.replace(/,/g, ""))) /
        Math.pow(10, tokenA.decimals)
    ) {
      return "INSUFFICIENT_BALANCE";
    }
    if (
      Number(tokenBAmountInput.amount) >
      Number(parseFloat(tokenBAmountInput.balance.replace(/,/g, ""))) /
        Math.pow(10, tokenB.decimals)
    ) {
      return "INSUFFICIENT_BALANCE";
    }
    const ordered = selectPool.compareToken?.path === tokenA?.path;
    const checkTokenA = ordered
      ? selectPool.depositRatio !== 0
      : selectPool.depositRatio !== 100;
    const checkTokenB = ordered
      ? selectPool.depositRatio !== 100
      : selectPool.depositRatio !== 0;
    if (checkTokenA && !BigNumber(tokenAAmountInput.amount).isGreaterThan(0)) {
      return "ENTER_AMOUNT";
    }
    if (checkTokenB && !BigNumber(tokenBAmountInput.amount).isGreaterThan(0)) {
      return "ENTER_AMOUNT";
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
    selectPool.compareToken?.path,
    selectPool.depositRatio,
  ]);

  const selectSwapFeeTier = useCallback(
    (feeTier: SwapFeeTierType) => {
      setSwapFeeTier(feeTier);
      const poolFeeTier = pools.map(pool => makeSwapFeeTier(pool.fee));
      const existPool = poolFeeTier.includes(feeTier);

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

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => {
        if (token.wrappedPath === prev.tokenB?.wrappedPath) {
          return {
            tokenA: token,
            tokenB: null,
            type: type,
          };
        }
        const nextTokenA =
          prev.tokenB?.symbol === token.symbol ? prev.tokenB : token;
        const nextTokenB =
          prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB;
        selectPool.setCompareToken(token);
        if (!nextTokenA || !nextTokenB) {
          selectSwapFeeTier("NONE");
        }
        return {
          tokenA: nextTokenA,
          tokenB: nextTokenB,
          type: type,
          isReverted: false,
          isKeepToken: !isKeepToken,
        };
      });
    },
    [type, isKeepToken],
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      setSwapValue(prev => {
        if (token.wrappedPath === prev.tokenA?.wrappedPath) {
          return {
            tokenA: null,
            tokenB: token,
            type: type,
          };
        }
        const nextTokenA =
          prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA;
        const nextTokenB =
          prev.tokenA?.symbol === token.symbol ? prev.tokenA : token;
        if (!nextTokenA || !nextTokenB) {
          selectSwapFeeTier("NONE");
        }
        return {
          tokenB: nextTokenB,
          tokenA: nextTokenA,
          type: type,
          isReverted: false,
        };
      });
    },
    [type],
  );

  const changeStartingPrice = useCallback(
    (price: string) => {
      if (price === "") {
        setCreateOption(prev => ({
          ...prev,
          startPrice: null,
        }));
        return;
      }
      const priceNum = BigNumber(price).toNumber();
      if (BigNumber(Number(priceNum)).isNaN()) {
        setCreateOption(prev => ({
          ...prev,
          startPrice: null,
        }));
        return;
      }
      const tick = priceToNearTick(priceNum, selectPool.tickSpacing);
      const nearStartPrice = tickToPrice(tick);
      setCreateOption(prev => ({
        ...prev,
        startPrice: nearStartPrice,
      }));
    },
    [selectPool.tickSpacing],
  );

  const updateTokenBAmountByTokenA = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }
      if (selectPool.currentPrice === null) {
        return;
      }
      if (/^0\.0(?:0*)$/.test(amount) || amount.toString() === "0") {
        tokenBAmountInput.changeAmount("0");
        return;
      }
      const ordered = tokenA?.symbol === selectPool.compareToken?.symbol;
      const currentPrice = ordered
        ? selectPool.currentPrice
        : 1 / selectPool.currentPrice;
      const depositRatioA = selectPool.depositRatio;
      if (
        selectPool.minPrice === null ||
        selectPool.maxPrice === null ||
        depositRatioA === null
      ) {
        tokenBAmountInput.changeAmount(
          BigNumber(amount).multipliedBy(currentPrice).toFixed(0),
        );
      } else {
        const isZero = ordered ? depositRatioA === 100 : depositRatioA === 0;
        if (isZero) {
          tokenBAmountInput.changeAmount("0");
          return;
        }

        const depositRatioB = 100 - depositRatioA;
        const ratio = ordered
          ? depositRatioB / depositRatioA
          : depositRatioA / depositRatioB;
        const changedAmount = BigNumber(amount).multipliedBy(
          currentPrice * ratio,
        );
        tokenBAmountInput.changeAmount(
          changedAmount.toFixed(tokenB?.decimals || 0, BigNumber.ROUND_FLOOR),
        );
      }
    },
    [
      selectPool.compareToken?.symbol,
      selectPool.currentPrice,
      tokenA?.symbol,
      tokenBAmountInput,
      selectPool.depositRatio,
    ],
  );

  const updateTokenAAmountByTokenB = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }
      if (selectPool.currentPrice === null) {
        return;
      }
      if (/^0\.0(?:0*)$/.test(amount) || amount.toString() === "0") {
        tokenAAmountInput.changeAmount("0");
        return;
      }
      const ordered = tokenB?.symbol === selectPool.compareToken?.symbol;
      const currentPrice = ordered
        ? selectPool.currentPrice
        : 1 / selectPool.currentPrice;
      const depositRatioA = selectPool.depositRatio;

      if (
        !selectPool.minPrice ||
        !selectPool.maxPrice ||
        depositRatioA === null
      ) {
        tokenAAmountInput.changeAmount(
          BigNumber(amount).multipliedBy(currentPrice).toFixed(0),
        );
      } else {
        const isZero = ordered ? depositRatioA === 100 : depositRatioA === 0;
        if (isZero) {
          tokenAAmountInput.changeAmount("0");
          return;
        }
        const depositRatioB = 100 - depositRatioA;
        const ratio = ordered
          ? depositRatioB / depositRatioA
          : depositRatioA / depositRatioB;
        const changedAmount = BigNumber(amount).multipliedBy(
          currentPrice * ratio,
        );
        tokenAAmountInput.changeAmount(
          changedAmount.toFixed(tokenA?.decimals || 0, BigNumber.ROUND_FLOOR),
        );
      }
    },
    [
      selectPool.compareToken?.symbol,
      selectPool.currentPrice,
      tokenAAmountInput,
      tokenB?.symbol,
      selectPool.depositRatio,
    ],
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
    if (exactType === "EXACT_IN") {
      updateTokenBAmountByTokenA(tokenAAmountInput.amount);
    } else {
      updateTokenAAmountByTokenB(tokenBAmountInput.amount);
    }
  }, [selectPool.currentPrice, selectPool.minPrice, selectPool.maxPosition]);

  useEffect(() => {
    updateTokenPrices();

    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });
    // selectSwapFeeTier("NONE");
    setIsEarnAdd(false);

    return () => {
      setSwapValue({
        tokenA: null,
        tokenB: null,
        type: "EXACT_IN",
      });
    };
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
      const currentTokenA =
        tokens.find(token => token.path === query.tokenA) || null;
      const currentTokenB =
        tokens.find(token => token.path === query.tokenB) || null;

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

  // Set price range at initialization
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
        pools
          .sort((pool1: PoolModel, pool2: PoolModel) => pool2.tvl - pool1.tvl)
          .at(0)?.price || null;
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

  useEffect(() => {
    if (!!tokenA && !!tokenB && isFetchedPools) {
      if (router.query?.fee_tier) {
        selectSwapFeeTier(`FEE_${router.query?.fee_tier}` as SwapFeeTierType);
      } else {
        selectSwapFeeTier("FEE_3000");
      }
      setSwapValue(prev => ({
        ...prev,
        tokenA,
        tokenB,
        type: "EXACT_IN",
      }));
    }
  }, [tokenA, tokenB, isFetchedPools, router.query?.fee_tier]);

  useEffect(() => {
    if (!initializedFeeTier.current) {
      initializedFeeTier.current = swapFeeTier as string;
    }
  }, [swapFeeTier]);

  useEffect(() => {
    if (!initializedPriceRange.current) {
      initializedPriceRange.current = priceRange ?? undefined;
    }
  }, [priceRange]);

  const handleSwapValue = useCallback(() => {
    setSwapValue(prev => {
      return {
        ...prev,
        tokenA: prev.tokenB,
        tokenB: prev.tokenA,
        isEarnChanged: true,
        isReverted: true,
        isKeepToken: !prev.isKeepToken,
      };
    });
  }, [setSwapValue]);

  useEffect(() => {
    const nextTickLower =
      isNumber(selectPool.minPosition || "") ||
      isFinite(selectPool.minPosition || 0)
        ? priceToTick(selectPool.minPosition || 0)
        : null;
    const nextTickUpper =
      isNumber(selectPool.maxPosition || "") ||
      isFinite(selectPool.maxPosition || 0)
        ? priceToTick(selectPool.maxPosition || 0)
        : null;

    const computedFeeTier = (() => {
      if (!initializedFeeTier.current) {
        return router.query.fee_tier;
      }

      return swapFeeTier === "NONE" ? "" : (swapFeeTier || "").slice(4);
    })()?.toString();

    const computedPriceRange = (() => {
      if (!initializedPriceRange.current) {
        return router.query.price_range_type;
      }

      return priceRange?.type;
    })()?.toString();

    if (tokenA?.path && tokenB?.path && router.isReady) {
      const queryString = makeQueryString({
        tokenA: tokenA?.path,
        tokenB: tokenB?.path,
        fee_tier: computedFeeTier,
        price_range_type: computedPriceRange,
        tickLower: nextTickLower,
        tickUpper: nextTickUpper,
      });
      router.push(
        `/earn/add${queryString ? "?" + queryString : ""}`,
        undefined,
        { shallow: true },
      );
    }
  }, [
    swapFeeTier,
    tokenA,
    tokenB,
    selectPool.minPosition,
    selectPool.maxPosition,
    priceRange?.type,
    router.query.fee_tier,
    router.isReady,
  ]);

  const showDim = useMemo(() => {
    return (
      isFetchedPools &&
      !!(tokenA && tokenB && selectPool.isCreate && !createOption.startPrice)
    );
  }, [
    isFetchedPools,
    tokenA,
    tokenB,
    selectPool.isCreate,
    createOption.startPrice,
  ]);

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
      isLoadingTokens={isLoadingTokens}
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
      selectFeeTier={fee => {
        selectSwapFeeTier(fee);
      }}
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
      submitOneClickStaking={submitOneClickStaking}
      selectPool={selectPool}
      changeStartingPrice={changeStartingPrice}
      createOption={createOption}
      handleSwapValue={handleSwapValue}
      isKeepToken={isKeepToken}
      /// Update with provided price range, if receive undefine set to default price range
      setPriceRange={type => {
        setPriceRange(
          PRICE_RANGES.find(item => item.type === (type || "Passive")) ?? null,
        );
      }}
      resetPriceRangeTypeTarget={"Passive"}
      showDim={showDim}
      isLoadingSelectFeeTier={isLoadingSelectFeeTier}
      isLoadingSelectPriceRange={isLoadingSelectPriceRange}
    />
  );
};

export default EarnAddLiquidityContainer;
