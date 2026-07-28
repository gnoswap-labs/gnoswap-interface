import React, { useMemo } from "react";
import BigNumber from "bignumber.js";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { POOL_INFO, POOL_INFO_MOBILE, POOL_INFO_SMALL_TABLET, POOL_INFO_TABLET } from "@constants/skeleton.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { DEVICE_TYPE } from "@styles/media";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { getUniqueRewardTokensWithMultipleRewardTypes } from "@utils/token-utils";

import PoolInfoLazyChart from "./pool-info-lazy-chart/PoolInfoLazyChart";

import { PoolInfoWrapper, TableColumn } from "./PoolInfo.styles";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import { cx } from "@emotion/css";
import PriceWarning from "@components/common/price-warning/PriceWarning";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { useGetAllTokenPrices } from "@query/token";
import { isArray } from "@common/utils/data-check-util";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
import { QUERY_PARAMETER } from "@constants/page.constant";

interface PoolInfoProps {
  pool: PoolListInfo;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
  breakpoint: DEVICE_TYPE;
}

const PoolInfo: React.FC<PoolInfoProps> = ({ pool, routeItem, breakpoint }) => {
  const { data: tokenPrices = {} } = useGetAllTokenPrices();

  const {
    poolId,
    tokenA,
    tokenB,
    feeTier,
    apr,
    volume24h,
    fees24h,
    rewardTokens,
    tvl,
    incentivized,
    tokenAPriceGrade,
    tokenBPriceGrade,
  } = pool;

  const { prefetch } = usePrefetchNavigation({
    pageType: "POOL",
    params: {
      [QUERY_PARAMETER.POOL_PATH]: poolId,
    },
    enabled: Boolean(poolId),
  });

  const hasIncentiveReward = React.useMemo(() => {
    const safeArray = isArray(rewardTokens) ? rewardTokens : [];
    return safeArray.length > 0;
  }, [rewardTokens]);

  const { getGnotPath } = useGnotToGnot();

  const { priceStyle: tokenAPriceStyle, shouldShowPriceWarning: tokenAShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: tokenAPriceGrade,
  });
  const { priceStyle: tokenBPriceStyle, shouldShowPriceWarning: tokenBShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: tokenBPriceGrade,
  });

  const shouldShowPriceWarning = tokenAShouldShowPriceWarning || tokenBShouldShowPriceWarning;

  const hasPriceInformational = React.useMemo(() => {
    if (tvl === "-" || tvl === "$0" || !Boolean(tvl)) return false;
    return true;
  }, [tvl]);

  const getColumnClassName = () => {
    if (!hasPriceInformational) return "";

    return cx({
      [tokenAPriceStyle.className || ""]: tokenAShouldShowPriceWarning,
      [tokenBPriceStyle.className || ""]: tokenBShouldShowPriceWarning,
    });
  };

  const columnClassName = getColumnClassName();

  const rewardTokenLogos = useMemo(() => {
    if (!incentivized || !hasIncentiveReward) return null;

    const tokenData = getUniqueRewardTokensWithMultipleRewardTypes(rewardTokens, getGnotPath);

    return <OverlapTokenLogo tokens={tokenData} size={20} showRewardType={true} />;
  }, [getGnotPath, rewardTokens, incentivized, hasIncentiveReward]);

  const cellWidths =
    breakpoint === DEVICE_TYPE.MOBILE
      ? POOL_INFO_MOBILE
      : breakpoint === DEVICE_TYPE.TABLET_M
      ? POOL_INFO_SMALL_TABLET
      : breakpoint === DEVICE_TYPE.TABLET
      ? POOL_INFO_TABLET
      : POOL_INFO;

  /**
   * Checks if either token has missing price information
   */
  const anyEmptyPrice = React.useCallback(
    (tokenA: TokenModel, tokenB: TokenModel) =>
      !tokenPrices?.[checkGnotPath(tokenA.priceID)]?.usd || !tokenPrices?.[checkGnotPath(tokenB.priceID)]?.usd,
    [tokenPrices],
  );

  /**
   * Format pool value with proper formatting or fallback to "-" when price data is missing
   */
  const formatPoolValue = React.useCallback(
    (value: string | number | undefined, tokenA: TokenModel, tokenB: TokenModel, decimals?: number) => {
      if (anyEmptyPrice(tokenA, tokenB)) return "-";

      return formatOtherPrice(value || 0, {
        isKMB: false,
        decimals: decimals ?? 0,
      });
    },
    [anyEmptyPrice],
  );

  const tvlDisplay = useMemo(() => {
    const tvlBN = BigNumber(tvl || "0");
    const safeTvl = tvlBN.isFinite() ? tvlBN : BigNumber(0);
    const decimals = safeTvl.isLessThan(1) ? 2 : 0;
    return formatPoolValue(safeTvl.toString(), tokenA, tokenB, decimals);
  }, [tvl, tokenA, tokenB]);

  const volume24hDisplay = useMemo(() => {
    return formatPoolValue(volume24h, tokenA, tokenB);
  }, [volume24h, tokenA, tokenB]);

  const fees24hDisplay = useMemo(() => {
    return formatPoolValue(fees24h, tokenA, tokenB);
  }, [fees24h, tokenA, tokenB]);

  const aprDisplay = useMemo(() => {
    if (tvl === "<$0.01" && apr) return "0%";
    return (
      <>
        {Number(apr) > 100 && <IconStar size={20} />}
        {formatRate(apr)}
      </>
    );
  }, [apr, tvl]);

  const handleMouseEnter = React.useCallback(() => {
    prefetch();
  }, [prefetch]);

  const handleClick = React.useCallback(() => {
    routeItem(poolId);
  }, [routeItem, poolId]);

  return (
    <PoolInfoWrapper onClick={handleClick} onMouseEnter={handleMouseEnter}>
      <TableColumn className="left" tdWidth={cellWidths.list[0].width}>
        <DoubleLogo
          left={tokenA.logoURI}
          right={tokenB.logoURI}
          size={24}
          leftSymbol={tokenA.symbol}
          rightSymbol={tokenB.symbol}
        />
        <span className="symbol-pair">{`${tokenA.displaySymbol}/${tokenB.displaySymbol}`}</span>
        <span className="feeRate">{SwapFeeTierInfoMap[feeTier].rateStr}</span>
      </TableColumn>
      {/* TVL */}
      <TableColumn tdWidth={cellWidths.list[1].width} className={columnClassName}>
        <span className="liquidity">{tvlDisplay}</span>
        {shouldShowPriceWarning && hasPriceInformational && <PriceWarning type="TVL" />}
      </TableColumn>
      {/* Volume (24h) */}
      <TableColumn tdWidth={cellWidths.list[2].width} className={columnClassName}>
        <span className="volume">{volume24hDisplay}</span>
      </TableColumn>
      {/* Fee (24h) */}
      <TableColumn tdWidth={cellWidths.list[3].width} className={columnClassName}>
        <span className="fees">{fees24hDisplay}</span>
      </TableColumn>
      {/* APR */}
      <TableColumn tdWidth={cellWidths.list[4].width} className={columnClassName}>
        <span className="apr">{aprDisplay}</span>
      </TableColumn>
      <TableColumn tdWidth={cellWidths.list[5].width}>{rewardTokenLogos}</TableColumn>
      <TableColumn tdWidth={cellWidths.list[6].width} onClick={e => e.stopPropagation()}>
        <div className="chart-wrapper">
          <PoolInfoLazyChart pool={pool} width={cellWidths.list[6].skeletonWidth} />
        </div>
      </TableColumn>
    </PoolInfoWrapper>
  );
};

export default PoolInfo;
