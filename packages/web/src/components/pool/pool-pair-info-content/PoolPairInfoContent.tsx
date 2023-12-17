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
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
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
    if (pool.apr === null) {
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
            <TooltipContent>
              <span className="title">Composition</span>
              <div className="list">
                <div className="coin-info">
                  <img
                    src={pool.tokenA.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
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
                  <img
                    src={pool.tokenB.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <span className="content">
                    {depositRatioStrOfTokenB}
                  </span>
                </div>
                <span className="content">
                  {numberToFormat(tokenBBalance, pool.tokenB.decimals)}
                </span>
              </div>
            </TooltipContent>
          }
        >
          <strong className="has-tooltip">{liquidityValue}</strong>
        </Tooltip>
        <div className="section-info">
          <span>24h Change</span>
          {pool.tvlChange >= 0 ? (
            <span className="positive">{liquidityChangedStr}</span>
          ) : (
            <span className="negative">{liquidityChangedStr}</span>
          )}
        </div>
      </section>
      <section>
        <h4>Volume (24h)</h4>
        <strong>{volumeValue}</strong>
        <div className="section-info">
          <span>24h Change</span>
          {pool.volumeChange >= 0 ? (
            <span className="positive">{volumeChangedStr}</span>
          ) : (
            <span className="negative">{volumeChangedStr}</span>
          )}
        </div>
      </section>
      <section>
        <h4>APR</h4>
        <strong>{aprValue}</strong>
        <div className="apr-info">
          <div className="content-wrap">
            <span>Fees</span>
            <span className="apr-value">{feeChangedStr}</span>
          </div>
          <AprDivider />
          <div className="content-wrap">
            <span>Rewards</span>
            <span className="apr-value">{rewardChangedStr}</span>
          </div>
        </div>
      </section>
    </PoolPairInfoContentWrapper>
  );
};

export default PoolPairInfoContent;
