import React, { useMemo } from "react";
import {
  AprDivider,
  PoolPairInfoContentWrapper,
  TooltipContent,
} from "./PoolPairInfoContent.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconStar from "@components/common/icons/IconStar";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { numberToFormat } from "@utils/string-utils";
import { toLowerUnitFormat } from "@utils/number-utils";
import { SHAPE_TYPES, skeletonTokenDetail } from "@constants/skeleton.constant";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
}) => {
  const tokenABalance = useMemo(() => {
    return makeDisplayTokenAmount(pool.tokenA, pool.tokenABalance) || 0;
  }, [pool.tokenA, pool.tokenABalance]);

  const tokenBBalance = useMemo(() => {
    return makeDisplayTokenAmount(pool.tokenB, pool.tokenBBalance) || 0;
  }, [pool.tokenB, pool.tokenBBalance]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = tokenABalance + tokenBBalance;
    if (sumOfBalances === 0) {
      return 0.5;
    }
    return tokenABalance / sumOfBalances;
  }, [tokenABalance, tokenBBalance]);

  const depositRatioStrOfTokenA = useMemo(() => {
    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `${pool.tokenA.symbol} (${depositStr})`;
  }, [depositRatio, pool.tokenA.symbol]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `${pool.tokenB.symbol} (${depositStr})`;
  }, [depositRatio, pool.tokenB.symbol]);

  const liquidityValue = useMemo((): string => {
    return toLowerUnitFormat(pool.tvl, true);
  }, [pool.tvl]);

  const volumeValue = useMemo((): string => {
    return toLowerUnitFormat(pool.volume, true);
  }, [pool.volume]);

  const aprValue = useMemo(() => {
    if (!pool.apr) {
      return "-";
    }
    if (pool.apr >= 100) {
      return <><IconStar />{`${pool.apr}%`}</>;
    }
    return `${pool.apr}%`;
  }, [pool.apr]);

  const liquidityChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.tvlChange, 2)}%`;
  }, [pool.tvlChange]);

  const volumeChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.volumeChange, 2)}%`;
  }, [pool.volumeChange]);

  const feeChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.feeChange, 2)}%`;
  }, [pool.feeChange]);

  const rewardChangedStr = useMemo((): string => {
    return "0.00%";
  }, []);

  return (
    <PoolPairInfoContentWrapper>
      <section>
        <h4>Liquidity</h4>
        <Tooltip
          placement="top"
          FloatingContent={
            !loading ? <TooltipContent>
              <span className="title">Composition</span>
              <div className="list">
                <div className="coin-info">
                  <MissingLogo symbol={pool.tokenA.symbol} url={pool.tokenA.logoURI} className="token-logo" width={20} mobileWidth={20}/>
                  <span className="content">
                    {depositRatioStrOfTokenA}
                  </span>
                </div>
                <span className="content">
                  {numberToFormat(tokenABalance, pool.tokenA.decimals)}
                </span>
              </div>
              <div className="list">
                <div className="coin-info">
                  <MissingLogo symbol={pool.tokenB.symbol} url={pool.tokenB.logoURI} className="token-logo" width={20} mobileWidth={20}/>
                  <span className="content">
                    {depositRatioStrOfTokenB}
                  </span>
                </div>
                <span className="content">
                  {numberToFormat(tokenBBalance, pool.tokenB.decimals)}
                </span>
              </div>
            </TooltipContent> : null
          }
        >
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={skeletonTokenDetail("170px", SHAPE_TYPES.ROUNDED_SQUARE, undefined, undefined, 140)}
            />
            </SkeletonEarnDetailWrapper>}
          {!loading && <strong className="has-tooltip">{liquidityValue}</strong>}
        </Tooltip>
        <div className="section-info">
          <span>24h Change</span>
          {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={skeletonTokenDetail("50px", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
            </SkeletonEarnDetailWrapper>}
          {!loading && pool.tvlChange >= 0 ? (
            <span className="positive">+{liquidityChangedStr}</span>
          ) : (!loading &&
            <span className="negative">-{liquidityChangedStr}</span>
          )}
        </div>
      </section>
      <section>
        <h4>Volume (24h)</h4>
        {!loading &&<strong>{volumeValue}</strong>}
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={skeletonTokenDetail("170px", SHAPE_TYPES.ROUNDED_SQUARE, undefined, undefined, 140)}
            />
            </SkeletonEarnDetailWrapper>}
        <div className="section-info">
          <span>24h Change</span>
          {!loading && pool.volumeChange >= 0 ? (
            <span className="positive">+{volumeChangedStr}</span>
          ) : (!loading &&
            <span className="negative">-{volumeChangedStr}</span>
          )}
          {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={skeletonTokenDetail("50px", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
          </SkeletonEarnDetailWrapper>}
        </div>
      </section>
      <section>
        <h4>APR</h4>
        {!loading && <strong>{aprValue}</strong>}
        {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
        <span
          css={skeletonTokenDetail("170px", SHAPE_TYPES.ROUNDED_SQUARE, undefined, undefined)}
        />
        </SkeletonEarnDetailWrapper>}
        <div className="apr-info">
          <div className="content-wrap">
            <span>Fees</span>
            {!loading && <span className="apr-value">{feeChangedStr}</span>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={skeletonTokenDetail("50px", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
            </SkeletonEarnDetailWrapper>}
          </div>
          <AprDivider />
          <div className="content-wrap">
            <span>Rewards</span>
            {!loading && <span className="apr-value">{rewardChangedStr}</span>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
            <span
              css={skeletonTokenDetail("50px", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
            </SkeletonEarnDetailWrapper>}
          </div>
        </div>
      </section>
    </PoolPairInfoContentWrapper>
  );
};

export default PoolPairInfoContent;
