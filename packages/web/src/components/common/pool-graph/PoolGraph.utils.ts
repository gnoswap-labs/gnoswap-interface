import BigNumber from "bignumber.js";
import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenModel } from "@models/token/token-model";
import { derivePoolLiquidityTokenAmounts } from "@utils/pool-liquidity-utils";
import { makeDisplayPrice } from "@utils/pool-utils";
import { checkGnotPath } from "@utils/common";
import { convertToKMBWithPrefix, formatTokenExchangeRate } from "@utils/stake-position-utils";
import { rawBySqrtX96, tickToPrice } from "@utils/swap-utils";

import { ReservedBin } from "./PoolGraph.types";

interface CreatePoolGraphBinsOptions {
  liquiditySegments: PoolLiquiditySegmentModel[];
  boundsHeight: number;
  tokenA: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
  tokenB: Pick<TokenModel, "path" | "decimals" | "symbol" | "displaySymbol">;
  currentTick?: number | null;
  currentSqrtPriceX96?: bigint | null;
  currentPrice?: number | null;
  isReversed?: boolean;
  positionLiquidity?: string | number | null;
  positionTickLower?: number | null;
  positionTickUpper?: number | null;
}

const toFiniteNumber = (value: string | number | undefined): number => {
  if (value === undefined) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toFiniteBigNumber = (value: string | number | undefined): BigNumber => {
  if (value === undefined) {
    return BigNumber(0);
  }

  const parsed = BigNumber(value);
  return parsed.isFinite() ? parsed : BigNumber(0);
};

const hasRawAmount = (amount?: { rawAmount: string }): boolean => {
  if (!amount) {
    return false;
  }

  return BigInt(amount.rawAmount) > 0n;
};

const resolveDisplayAmount = (
  tokenAAmount: string | null | undefined,
  tokenBAmount: string | null | undefined,
  useInvertedDisplay: boolean,
): [string | null, string | null] => {
  if (useInvertedDisplay) {
    return [tokenBAmount ?? null, tokenAAmount ?? null];
  }

  return [tokenAAmount ?? null, tokenBAmount ?? null];
};

const resolveDisplayVisibility = (
  tokenAVisible: boolean,
  tokenBVisible: boolean,
  useInvertedDisplay: boolean,
): [boolean, boolean] => {
  if (useInvertedDisplay) {
    return [tokenBVisible, tokenAVisible];
  }

  return [tokenAVisible, tokenBVisible];
};

export const getPoolGraphTooltipTick = (bin: Pick<ReservedBin, "sourceMinTick" | "sourceMaxTick">): number => {
  return bin.sourceMinTick;
};

const formatLiquiditySharePercent = (
  positionLiquidity: string | number | null | undefined,
  poolLiquidity: string,
): string => {
  if (!positionLiquidity) {
    return "0%";
  }

  const positionLiquidityValue = BigInt(positionLiquidity.toString());
  const poolLiquidityValue = BigInt(poolLiquidity);

  if (positionLiquidityValue <= 0n || poolLiquidityValue <= 0n) {
    return "0%";
  }

  const scaledPercent = (positionLiquidityValue * 10_000n + poolLiquidityValue / 2n) / poolLiquidityValue;
  const integerPart = scaledPercent / 100n;
  const fractionalPart = scaledPercent % 100n;

  if (fractionalPart === 0n) {
    return `${integerPart.toString()}%`;
  }

  const fractionalText = fractionalPart.toString().padStart(2, "0").replace(/0+$/, "");
  return `${integerPart.toString()}.${fractionalText}%`;
};

export const formatPoolGraphTooltipPrice = (tick: number, baseToken: TokenModel, quoteToken: TokenModel): string => {
  const displayPrice = makeDisplayPrice(tickToPrice(tick), baseToken, quoteToken);

  return formatTokenExchangeRate(displayPrice.toString(), {
    maxSignificantDigits: 5,
    isIgnoreKMBFormat: true,
  });
};

export const formatPoolGraphTokenUsd = (
  amount: string | number | null | undefined,
  token: Pick<TokenModel, "path" | "priceID">,
  tokenPrices: Record<string, TokenPriceModel | undefined>,
): string => {
  const amountValue = BigNumber(amount ?? 0);
  if (!amountValue.isFinite()) {
    return "-";
  }

  const tokenPrice = tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd;
  if (!tokenPrice) {
    return "-";
  }

  return convertToKMBWithPrefix(amountValue.multipliedBy(tokenPrice).toString(), { usd: true });
};

const getPositionOverlapBounds = (
  segment: Pick<PoolLiquiditySegmentModel, "minTick" | "maxTick">,
  positionTickLower?: number | null,
  positionTickUpper?: number | null,
): Pick<PoolLiquiditySegmentModel, "minTick" | "maxTick"> | null => {
  if (positionTickLower == null || positionTickUpper == null || positionTickLower >= positionTickUpper) {
    return null;
  }

  const minTick = Math.max(segment.minTick, positionTickLower);
  const maxTick = Math.min(segment.maxTick, positionTickUpper);

  if (minTick >= maxTick) {
    return null;
  }

  return { minTick, maxTick };
};

const getCurrentTokenBPerTokenA = (
  currentTick: number | null | undefined,
  currentSqrtPriceX96: bigint | null | undefined,
  currentPrice: number | null | undefined,
  tokenA: Pick<TokenModel, "decimals">,
  tokenB: Pick<TokenModel, "decimals">,
): BigNumber => {
  const rawPrice = (() => {
    if (currentPrice != null && Number.isFinite(currentPrice) && currentPrice > 0) {
      return currentPrice;
    }

    if (currentSqrtPriceX96 != null && currentSqrtPriceX96 > 0n) {
      return rawBySqrtX96(currentSqrtPriceX96);
    }

    return currentTick == null ? 0 : tickToPrice(currentTick);
  })();

  if (rawPrice <= 0) {
    return BigNumber(0);
  }

  const price = BigNumber(rawPrice).shiftedBy(tokenA.decimals - tokenB.decimals);
  return price.isFinite() && price.isGreaterThan(0) ? price : BigNumber(0);
};

const getDisplayHeight = (
  segment: Pick<PoolLiquiditySegmentModel, "tokenAAmount" | "tokenBAmount" | "graphHeightRatio">,
  tokenBPerTokenA: BigNumber,
) => {
  const tokenAAmount = toFiniteBigNumber(segment.tokenAAmount?.displayAmount);
  const tokenBAmount = toFiniteBigNumber(segment.tokenBAmount?.displayAmount);

  if (tokenAAmount.isGreaterThan(0) || tokenBAmount.isGreaterThan(0)) {
    if (tokenBPerTokenA.isGreaterThan(0)) {
      return tokenAAmount.plus(tokenBAmount.dividedBy(tokenBPerTokenA));
    }

    return BigNumber.max(tokenAAmount, tokenBAmount);
  }

  return toFiniteBigNumber(segment.graphHeightRatio);
};

export const createPoolGraphBins = ({
  liquiditySegments,
  boundsHeight,
  tokenA,
  tokenB,
  currentTick,
  currentSqrtPriceX96,
  currentPrice,
  isReversed = false,
  positionLiquidity,
  positionTickLower,
  positionTickUpper,
}: CreatePoolGraphBinsOptions): ReservedBin[] => {
  const tokenBPerTokenA = getCurrentTokenBPerTokenA(currentTick, currentSqrtPriceX96, currentPrice, tokenA, tokenB);
  const displayHeights = liquiditySegments.map(segment => getDisplayHeight(segment, tokenBPerTokenA));
  const maxPoolDisplayHeight = displayHeights.reduce(
    (currentMax, displayHeight) => BigNumber.max(currentMax, displayHeight),
    BigNumber(0),
  );

  return liquiditySegments.map((segment, index) => {
    const useInvertedDisplay = isReversed || segment.isDisplayInverted;
    const displayMinTick = useInvertedDisplay ? -segment.maxTick : segment.minTick;
    const displayMaxTick = useInvertedDisplay ? -segment.minTick : segment.maxTick;
    const normalizedMinTick = Math.min(displayMinTick, displayMaxTick);
    const normalizedMaxTick = Math.max(displayMinTick, displayMaxTick);
    const amountBounds = { minTick: segment.amountMinTick, maxTick: segment.amountMaxTick };
    const amountOverlapBounds = getPositionOverlapBounds(amountBounds, positionTickLower, positionTickUpper);
    const visualOverlapBounds = getPositionOverlapBounds(segment, positionTickLower, positionTickUpper);
    const isPositionActive = amountOverlapBounds !== null;
    const isPositionVisualActive = visualOverlapBounds !== null;
    const positionAmounts =
      amountOverlapBounds && positionLiquidity
        ? derivePoolLiquidityTokenAmounts({
            liquidity: positionLiquidity.toString(),
            minTick: amountOverlapBounds.minTick,
            maxTick: amountOverlapBounds.maxTick,
            currentTick: currentTick ?? amountOverlapBounds.minTick,
            currentSqrtPriceX96: currentSqrtPriceX96 ?? undefined,
            currentPrice: currentPrice ?? undefined,
            tokenA,
            tokenB,
          })
        : null;
    const positionVisualAmounts =
      visualOverlapBounds && positionLiquidity
        ? derivePoolLiquidityTokenAmounts({
            liquidity: positionLiquidity.toString(),
            minTick: visualOverlapBounds.minTick,
            maxTick: visualOverlapBounds.maxTick,
            currentTick: currentTick ?? visualOverlapBounds.minTick,
            currentSqrtPriceX96: currentSqrtPriceX96 ?? undefined,
            currentPrice: currentPrice ?? undefined,
            tokenA,
            tokenB,
          })
        : null;
    const [reserveTokenAVisible, reserveTokenBVisible] = resolveDisplayVisibility(
      hasRawAmount(segment.tokenAAmount),
      hasRawAmount(segment.tokenBAmount),
      useInvertedDisplay,
    );
    const [positionReserveTokenAVisible, positionReserveTokenBVisible] = resolveDisplayVisibility(
      hasRawAmount(positionAmounts?.tokenAAmount),
      hasRawAmount(positionAmounts?.tokenBAmount),
      useInvertedDisplay,
    );
    const [reserveTokenA, reserveTokenB] = resolveDisplayAmount(
      segment.tokenAAmount?.displayAmount,
      segment.tokenBAmount?.displayAmount,
      useInvertedDisplay,
    );
    const [reserveTokenAMyAmount, reserveTokenBMyAmount] = resolveDisplayAmount(
      positionAmounts?.tokenAAmount.displayAmount,
      positionAmounts?.tokenBAmount.displayAmount,
      useInvertedDisplay,
    );
    const positionHeight = positionVisualAmounts
      ? getDisplayHeight(
          {
            graphHeightRatio: "0",
            tokenAAmount: positionVisualAmounts.tokenAAmount,
            tokenBAmount: positionVisualAmounts.tokenBAmount,
          },
          tokenBPerTokenA,
        )
      : BigNumber(0);
    const positionHeightRatio = maxPoolDisplayHeight.isGreaterThan(0)
      ? BigNumber.min(positionHeight.dividedBy(maxPoolDisplayHeight), 1).toNumber()
      : 0;
    const positionLiquidityShare = isPositionActive
      ? formatLiquiditySharePercent(positionLiquidity, segment.liquidity)
      : "0%";

    return {
      minTick: normalizedMinTick,
      maxTick: normalizedMaxTick,
      sourceMinTick: segment.minTick,
      sourceMaxTick: segment.maxTick,
      reserveTokenMap: toFiniteNumber(segment.graphHeightRatio) * boundsHeight,
      positionReserveTokenMap: positionHeightRatio * boundsHeight,
      reserveTokenAMyAmount,
      reserveTokenBMyAmount,
      reserveTokenAVisible,
      reserveTokenBVisible,
      positionReserveTokenAVisible,
      positionReserveTokenBVisible,
      positionLiquidityShare,
      reserveTokenAMap: toFiniteNumber(displayHeights[index].toString()),
      index,
      liquidity: segment.liquidity,
      reserveTokenA,
      reserveTokenB,
      isPositionActive,
      isPositionVisualActive,
    };
  });
};
