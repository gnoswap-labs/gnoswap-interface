import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddLiquiditySubmitType, PriceRangeMeta, SwapFeeTierType } from "@constants/option.constant";
import { PAGE_PATH } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useRouterBack } from "@hooks/common/use-router-back";
import { useSlippage } from "@hooks/common/use-slippage";
import { useSelectPool } from "@hooks/pool/data/use-select-pool";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { SwapState } from "@states/index";
import { formatRate } from "@utils/new-number-utils";
import { makeRouteUrl, replaceRouteUrlWithoutNavigation } from "@utils/page.utils";
import { invertSqrtPriceX96, makeDisplayPrice, makeRawPrice } from "@utils/pool-utils";
import { sortTokenPaths } from "@utils/sort-utils";
import {
  getDepositAmountsByAmountA,
  getDepositAmountsByAmountB,
  makeSwapFeeTier,
  priceToNearTick,
  priceToSqrtX96,
  priceToTick,
  tickToPrice,
} from "@utils/swap-utils";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";

import { useReferral } from "@hooks/common/use-referral";
import { usePool } from "@hooks/pool/data/use-pool";
import { usePoolAddLiquidityConfirmModal } from "@hooks/pool/ui/use-pool-add-liquidity-confirm-modal";
import { isSameToken } from "@utils/common";
import PoolAddLiquidity, { PriceRangeSummary } from "../../components/pool-add-liquidity/PoolAddLiquidity";

export const SWAP_FEE_TIERS: SwapFeeTierType[] = ["FEE_100", "FEE_500", "FEE_3000", "FEE_10000"];

const PRICE_RANGES: PriceRangeMeta[] = [
  { type: "Active", text: "[-10% / +10%]" },
  { type: "Passive", text: "[-50% / +100%]" },
  { type: "Custom" },
];

const EarnAddLiquidityContainer: React.FC = () => {
  const { i18n } = useTranslation();
  const router = useCustomRouter();
  useRouterBack();

  const { getCurrentReferralAddress } = useReferral();
  const referralFromUrl = router.getReferrerParameter();
  const hasUrlReferralParameter = useMemo(() => referralFromUrl != null, [referralFromUrl]);

  const [swapValue, setSwapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN", isReverted, isKeepToken = false } = swapValue;

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [exactType, setExactType] = useState<"EXACT_IN" | "EXACT_OUT">("EXACT_IN");
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>(null);
  const [priceRanges] = useState<PriceRangeMeta[]>(PRICE_RANGES);
  const [priceRange, setPriceRange] = useState<PriceRangeMeta | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState<number | null>(null);
  const initializedFeeTier = useRef<string>();
  const initializedPriceRange = useRef<PriceRangeMeta>();

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  const { connected: connectedWallet, account, switchNetwork, isSwitchNetwork } = useWallet();
  const { slippage, changeSlippage } = useSlippage();
  const { refetchGrc20Balances, updateBalances, updateTokenPrices, tokens, loading: isLoadingTokens } = useTokenData();
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

  const { openAddPositionModal } = usePoolAddLiquidityConfirmModal({
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

  const sqrtPriceX96 = useMemo(() => {
    if (selectPool?.isOrderedPrice === undefined || selectPool?.isOrderedPrice === null) {
      return null;
    }

    const sqrtPriceX96 = selectPool?.sqrtPriceX96 ?? 0n;
    if (!selectPool.isOrderedPrice) {
      return invertSqrtPriceX96(sqrtPriceX96);
    }

    return sqrtPriceX96;
  }, [selectPool]);

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    let depositRatio = "-";
    let feeBoost: string = "-";
    let estimatedApr: string = formatRate(selectPool.estimatedAPR) ?? "-";

    if (selectPool.selectedFullRange) {
      const tokenASymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenA?.symbol : tokenB?.symbol;
      const tokenBSymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenB?.symbol : tokenA?.symbol;
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
      const tokenASymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenA?.symbol : tokenB?.symbol;
      const tokenBSymbol = tokenA?.symbol === selectPool.compareToken?.symbol ? tokenB?.symbol : tokenA?.symbol;
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
    if (selectPool.minPrice && selectPool.maxPrice && selectPool.minPrice >= selectPool.maxPrice) {
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

  const changePriceRange = useCallback(
    (priceRange: PriceRangeMeta) => {
      setPriceRange(priceRange);

      if (priceRange.type !== "Custom") {
        selectPool.setIsChangeMinMax(false);
        selectPool.setFullRange(false);
      }

      // If you've already set a starting price, update it to apply tick spacing.
      if (createOption.isCreate && createOption.startPrice) {
        changeStartingPrice(createOption.startPrice.toString());
      }
    },
    [createOption],
  );

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
        if (isSameToken(token.path, prev.tokenB?.path || "")) {
          return {
            tokenA: token,
            tokenB: null,
            type: type,
          };
        }
        const nextTokenA = prev.tokenB?.path === token.path ? prev.tokenB : token;
        const nextTokenB = prev.tokenB?.path === token.path ? prev.tokenA : prev.tokenB;
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
        if (isSameToken(token.path, prev.tokenA?.path || "")) {
          return {
            tokenA: null,
            tokenB: token,
            type: type,
          };
        }
        const nextTokenA = prev.tokenA?.path === token.path ? prev.tokenB : prev.tokenA;
        const nextTokenB = prev.tokenA?.path === token.path ? prev.tokenA : token;
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
      if (price === "" || !swapFeeTier || !tokenA || !tokenB) {
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

      const rawPrice = makeRawPrice(priceNum, tokenA, tokenB);
      const tick = priceToNearTick(rawPrice, selectPool.tickSpacing);
      const nearStartPrice = tickToPrice(tick);

      setCreateOption(prev => ({
        ...prev,
        startPrice: nearStartPrice,
      }));
    },
    [selectPool.tickSpacing, swapFeeTier, tokenA, tokenB],
  );

  const updateTokenBAmountByTokenA = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }

      if (!selectPool.currentPrice && !sqrtPriceX96) {
        return;
      }

      if (!amount || !tokenA || !tokenB) {
        return;
      }

      if (!selectPool.minPrice || !selectPool.maxPrice) {
        return;
      }

      const currentSqrtPriceX96 = selectPool.isCreate ? priceToSqrtX96(selectPool.currentPrice) : sqrtPriceX96;
      if (!currentSqrtPriceX96) {
        return null;
      }

      const amountRaw = makeRawTokenAmount(tokenA, amount) || 0;
      const { amountB } = getDepositAmountsByAmountA(
        selectPool.currentPrice,
        currentSqrtPriceX96,
        selectPool.minPrice,
        selectPool.maxPrice,
        BigInt(amountRaw),
      );
      const expectedTokenAmount = makeDisplayTokenAmount(tokenB, amountB) || "0";
      tokenBAmountInput.changeAmount(expectedTokenAmount.toString());
    },
    [
      selectPool.isCreate,
      selectPool.currentPrice,
      sqrtPriceX96,
      selectPool.compareToken?.symbol,
      selectPool.minPrice,
      selectPool.maxPrice,
      tokenA,
      tokenB,
    ],
  );

  const updateTokenAAmountByTokenB = useCallback(
    (amount: string) => {
      if (BigNumber(amount).isNaN() || !BigNumber(amount).isFinite()) {
        return;
      }

      if (!selectPool.currentPrice && !sqrtPriceX96) {
        return;
      }

      if (!amount || !tokenA || !tokenB) {
        return;
      }

      if (!selectPool.minPrice || !selectPool.maxPrice) {
        return;
      }

      const currentSqrtPriceX96 = selectPool.isCreate ? priceToSqrtX96(selectPool.currentPrice) : sqrtPriceX96;
      if (!currentSqrtPriceX96) {
        return null;
      }

      const amountRaw = makeRawTokenAmount(tokenB, amount) || 0;
      const { amountA } = getDepositAmountsByAmountB(
        selectPool.currentPrice,
        currentSqrtPriceX96,
        selectPool.minPrice,
        selectPool.maxPrice,
        BigInt(amountRaw),
      );
      const expectedTokenAmount = makeDisplayTokenAmount(tokenA, amountA) || "0";
      tokenAAmountInput.changeAmount(expectedTokenAmount.toString());
    },
    [
      selectPool.isCreate,
      selectPool.currentPrice,
      sqrtPriceX96,
      selectPool.minPrice,
      selectPool.maxPrice,
      tokenA,
      tokenB,
      tokenAAmountInput,
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
    updateTokenBAmountByTokenA,
    tokenAAmountInput.amount,
    updateTokenAAmountByTokenB,
    tokenBAmountInput.amount,
  ]);

  useEffect(() => {
    updateTokenPrices();

    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });

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
      refetchGrc20Balances();
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

  // Set price range at initialization
  useEffect(() => {
    if (!isFetchedPools || !swapFeeTier || !tokenA || !tokenB || swapFeeTier === "NONE") {
      return;
    }

    const poolFeeTier = pools.map(pool => makeSwapFeeTier(pool.fee));
    const existPool = poolFeeTier.includes(swapFeeTier);

    if (existPool) {
      if (router.query.price_range_type) {
        setPriceRange(priceRanges.find(range => range.type === router.query.price_range_type) || null);
        return;
      }
      setPriceRange(priceRanges.find(range => range.type === "Passive") || null);
    } else {
      setPriceRange(priceRanges.find(range => range.type === "Custom") || null);
    }
  }, [swapFeeTier, pools, isFetchedPools, priceRanges, tokenA, tokenB, router.query.price_range_type]);

  useEffect(() => {
    if (pools.length > 0 && tokenA && tokenB && selectPool.compareToken) {
      const tokenPair = [tokenA.wrappedPath || tokenA.path, tokenB.wrappedPath || tokenB.path].sort(sortTokenPaths);
      const compareToken = selectPool.compareToken;
      const reverse =
        tokenPair.findIndex(path => {
          if (compareToken) {
            return isNativeToken(compareToken) ? compareToken.wrappedPath === path : compareToken.path === path;
          }
          return false;
        }) === 1;
      const priceOfMaxLiquidity =
        pools.sort((pool1: PoolModel, pool2: PoolModel) => Number(pool2.liquidity) - Number(pool1.liquidity)).at(0)
          ?.price || null;
      if (priceOfMaxLiquidity) {
        const maxPrice = reverse ? 1 / priceOfMaxLiquidity : priceOfMaxLiquidity;
        setDefaultPrice(makeDisplayPrice(maxPrice, tokenA, tokenB));
      } else {
        setDefaultPrice(null);
      }
    } else {
      setDefaultPrice(null);
    }
  }, [pools, selectPool.compareToken, tokenA, tokenB]);

  const lastPoolPathRef = useRef<string>();

  useEffect(() => {
    const pair = [tokenA?.path, tokenB?.path]
      .filter(item => item !== undefined)
      .sort(sortTokenPaths)
      .join(":");

    const isDifferentPair = pair !== lastPoolPathRef.current;

    if (!!tokenA && !!tokenB && isFetchedPools) {
      if (isDifferentPair) {
        if (router.query?.fee_tier) {
          selectSwapFeeTier(`FEE_${router.query?.fee_tier}` as SwapFeeTierType);
        } else {
          selectSwapFeeTier("FEE_3000");
        }
        lastPoolPathRef.current = pair;
      }
      setSwapValue(prev => ({
        ...prev,
        tokenA,
        tokenB,
        type: "EXACT_IN",
      }));
    }
  }, [tokenA, tokenB, isFetchedPools, router.query?.fee_tier, setSwapValue, selectSwapFeeTier]);

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

  const nextTickLower = useMemo(() => {
    if (selectPool.minPosition !== null) {
      return priceToTick(selectPool.minPosition);
    }
    return null;
  }, [selectPool.minPosition]);

  const nextTickUpper = useMemo(() => {
    if (selectPool.maxPosition !== null) {
      return priceToTick(selectPool.maxPosition);
    }
    return null;
  }, [selectPool.maxPosition]);

  const computedFeeTier = useMemo(() => {
    if (!initializedFeeTier.current) {
      return router.query.fee_tier;
    }

    return swapFeeTier === "NONE" ? "" : (swapFeeTier || "").slice(4).toString();
  }, [initializedFeeTier.current, router.query.fee_tier, swapFeeTier]);

  const computedPriceRange = useMemo(() => {
    if (!initializedPriceRange.current) {
      return router.query.price_range_type;
    }
    return priceRange?.type.toString();
  }, [initializedPriceRange.current, router.query.price_range_type, priceRange]);

  const currentReferralAddress = getCurrentReferralAddress();

  useEffect(() => {
    if (swapFeeTier && router.isReady) {
      const query = {
        tokenA: tokenA?.path,
        tokenB: tokenB?.path,
        fee_tier: typeof computedFeeTier === "string" ? computedFeeTier : undefined,
        price_range_type: typeof computedPriceRange === "string" ? computedPriceRange : undefined,
        tickLower: nextTickLower,
        tickUpper: nextTickUpper,
        ...(hasUrlReferralParameter ? { referrer: currentReferralAddress } : {}),
      };
      replaceRouteUrlWithoutNavigation(PAGE_PATH.EARN_ADD, makeRouteUrl(PAGE_PATH.EARN_ADD, query));
    }
  }, [
    swapFeeTier,
    tokenA?.path,
    tokenB?.path,
    nextTickLower,
    nextTickUpper,
    currentReferralAddress,
    i18n.language,
    hasUrlReferralParameter,
  ]);

  const showDim = useMemo(() => {
    return isFetchedPools && !!(tokenA && tokenB && selectPool.isCreate && !createOption.startPrice);
  }, [isFetchedPools, tokenA, tokenB, selectPool.isCreate, createOption.startPrice]);

  const isLoadingSelectFeeTier = useMemo(() => {
    return isFetchingFeetierOfLiquidityMap || isFetchingPools || isLoadingCommon;
  }, [isFetchingFeetierOfLiquidityMap, isFetchingPools, isLoadingCommon]);

  const isLoadingSelectPriceRange = useMemo(() => {
    return isFetchingPools || isLoadingCommon;
  }, [isFetchingPools, isLoadingCommon]);

  return (
    <PoolAddLiquidity
      isLoadingTokens={isLoadingTokens}
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
      isEarnAdd={true}
      connected={connectedWallet}
      slippage={slippage}
      changeSlippage={changeSlippage}
      selectPool={selectPool}
      changeStartingPrice={changeStartingPrice}
      createOption={createOption}
      handleSwapValue={handleSwapValue}
      isKeepToken={isKeepToken}
      /// Update with provided price range, if receive undefine set to default price range
      setPriceRange={type => {
        setPriceRange(PRICE_RANGES.find(item => item.type === (type || "Passive")) ?? null);
      }}
      resetPriceRangeTypeTarget={"Passive"}
      showDim={showDim}
      isLoadingSelectFeeTier={isLoadingSelectFeeTier}
      isLoadingSelectPriceRange={isLoadingSelectPriceRange}
    />
  );
};

export default EarnAddLiquidityContainer;
