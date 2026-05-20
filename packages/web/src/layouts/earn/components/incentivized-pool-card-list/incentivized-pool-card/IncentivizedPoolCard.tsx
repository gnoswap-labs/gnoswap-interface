import { cx } from "@emotion/css";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";
import { useGetBinsByPath } from "@query/pools";
import { formatRate } from "@utils/new-number-utils";
import { numberToFormat } from "@utils/string-utils";
import { formatDisplayTokenSymbol, getUniqueRewardTokensWithMultipleRewardTypes } from "@utils/token-utils";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import PriceWarning from "@components/common/price-warning/PriceWarning";
import { PoolCardWrapper, PoolCardWrapperWrapperBorder } from "./IncentivizedPoolCard.styles";

export interface IncentivizedPoolCardProps {
  pool: IncentivizePoolCardInfoWithPriceGrade;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
}

const BINS_DATA_DEFAULT_LENGTH = 40;

const IncentivizedPoolCard: React.FC<IncentivizedPoolCardProps> = ({ pool, routeItem, themeKey }) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const { prefetch } = usePrefetchNavigation({
    pageType: "POOL",
    params: {
      [QUERY_PARAMETER.POOL_PATH]: pool.poolId,
    },
    enabled: Boolean(pool.poolId),
  });

  const { data: bins40Result, isLoading: isLoadingBins40 } = useGetBinsByPath(
    pool.poolPath || "",
    BINS_DATA_DEFAULT_LENGTH,
    null,
    null,
    null,
    {
      enabled: !!pool.poolPath,
    },
  );
  const bins40 = bins40Result?.bins;

  const staked = pool.hasStakedPosition;

  const pairName = useMemo(() => {
    return `${formatDisplayTokenSymbol(pool.tokenA.symbol)}/${formatDisplayTokenSymbol(pool.tokenB.symbol)}`;
  }, [pool.tokenA.symbol, pool.tokenB.symbol]);

  const rewardTokenLogos = useMemo(() => {
    if (!pool.incentivized) return null;

    const tokenData = getUniqueRewardTokensWithMultipleRewardTypes(pool.rewardTokens, getGnotPath);
    return <OverlapTokenLogo tokens={tokenData} size={16} showRewardType={true} />;
  }, [getGnotPath, pool.rewardTokens, pool.incentivized]);

  const isHideBar = useMemo(() => {
    const isAllReserveZeroBin40 = bins40?.every(
      item => Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );

    return isAllReserveZeroBin40;
  }, [bins40]);

  const aprStr = useMemo(() => {
    if (!pool.apr) return "-";

    return (
      <>
        {Number(pool.apr) > 100 && <IconStar size={20} />}
        {formatRate(pool.apr)}
      </>
    );
  }, [pool.apr]);

  const { priceStyle: tokenAPriceStyle, shouldShowPriceWarning: tokenAShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: pool.tokenAPriceGrade,
  });
  const { priceStyle: tokenBPriceStyle, shouldShowPriceWarning: tokenBShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: pool.tokenBPriceGrade,
  });

  const shouldShowPriceWarning = tokenAShouldShowPriceWarning || tokenBShouldShowPriceWarning;

  const handleMouseEnter = useCallback(() => {
    prefetch();
  }, [prefetch]);

  const handleClick = useCallback(() => {
    routeItem(pool.poolId);
  }, [routeItem, pool.poolId]);

  return (
    <PoolCardWrapperWrapperBorder className={`${staked ? "special-card" : ""}`}>
      <div className="base-border">
        <PoolCardWrapper onClick={handleClick} onMouseEnter={handleMouseEnter}>
          <div className="pool-container">
            <div className="title-container">
              <div className="box-header">
                <DoubleLogo
                  left={pool.tokenA.logoURI}
                  right={pool.tokenB.logoURI}
                  leftSymbol={pool.tokenA.symbol}
                  rightSymbol={pool.tokenB.symbol}
                  size={32}
                />
                <span>{pairName}</span>
                <div className="box-group">
                  <Badge type={BADGE_TYPE.DARK_DEFAULT} text={`${SwapFeeTierInfoMap[pool.feeTier].rateStr}`} />
                  {pool.incentivized && <Badge type={BADGE_TYPE.DARK_DEFAULT} text={rewardTokenLogos} />}
                </div>
              </div>
            </div>
            <div className="list-wrapper">
              <div className="list-header">
                <span className="label-text">TVL</span>
                <span className="label-text">APR</span>
              </div>
              <div className="list-content">
                <span className={cx("value-text", tokenAPriceStyle.className, tokenBPriceStyle.className)}>
                  {pool.liquidity}
                  {shouldShowPriceWarning && <PriceWarning type="TVL" />}
                </span>
                <span className="value-text apr-value">{aprStr}</span>
              </div>
            </div>
          </div>
          <div className="volume-container">
            <div className="volume-header">
              <div className="volume-title">
                <span className="label-text">{t("Earn:incentiPools.card.col.volume")}</span>
                <span className="label-text">{t("Earn:incentiPools.card.col.fees")}</span>
              </div>
              <div className="volume-content">
                <span className="value-text">{pool.volume24h}</span>
                <span className="value-text">{pool.fees24h}</span>
              </div>
            </div>
            <div className="pool-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
              {isLoadingBins40 ? (
                <div className="bins-loading-wrapper">
                  <LoadingSpinner size="MEDIUM" />
                </div>
              ) : (
                <PoolGraph
                  tokenA={pool.tokenA}
                  tokenB={pool.tokenB}
                  bins={bins40 ?? []}
                  currentTick={pool.currentTick}
                  width={258}
                  height={80}
                  mouseover
                  themeKey={themeKey}
                  position="top"
                  offset={40}
                  poolPrice={pool?.price || 1}
                  disabled={isHideBar}
                />
              )}
              <div className="price-section">
                <span className="label-text">{t("Earn:incentiPools.card.current.price")}</span>
                <span className="label-text">{`1 ${formatDisplayTokenSymbol(pool.tokenA.symbol)} = ${numberToFormat(
                  pool.price,
                  {
                    decimals: 2,
                  },
                )} ${formatDisplayTokenSymbol(pool.tokenB.symbol)}`}</span>
              </div>
            </div>
          </div>
        </PoolCardWrapper>
      </div>
    </PoolCardWrapperWrapperBorder>
  );
};

export default IncentivizedPoolCard;
