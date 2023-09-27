import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import React from "react";
import {
  AprDivider,
  PoolPairInfoContentWrapper,
  TooltipContent,
} from "./PoolPairInfoContent.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
interface PoolPairInfoContentProps {
  content: any;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  content,
}) => {
  const { poolInfo, liquidity, volume24h, apr } = content;

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
                    src={poolInfo.tokenPair.tokenA.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <span className="content">
                    {poolInfo.tokenPair.tokenA.symbol} (
                    {poolInfo.tokenPair.tokenA.compositionPercent}%)
                  </span>
                </div>
                <span className="content">
                  {poolInfo.tokenPair.tokenA.composition}
                </span>
              </div>
              <div className="list">
                <div className="coin-info">
                  <img
                    src={poolInfo.tokenPair.tokenB.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <span className="content">
                    {poolInfo.tokenPair.tokenB.symbol} (
                    {poolInfo.tokenPair.tokenB.compositionPercent}%)
                  </span>
                </div>
                <span className="content">
                  {poolInfo.tokenPair.tokenB.composition}
                </span>
              </div>
            </TooltipContent>
          }
        >
          <strong className="has-tooltip">{liquidity.value}</strong>
        </Tooltip>
        <div className="section-info">
          <span>24h Change</span>
          {liquidity.change24h.status === MATH_NEGATIVE_TYPE.POSITIVE ? (
            <span className="positive">{liquidity.change24h.value}</span>
          ) : (
            <span className="negative">{liquidity.change24h.value}</span>
          )}
        </div>
      </section>
      <section>
        <h4>Volume (24h)</h4>
        <strong>{volume24h.value}</strong>
        <div className="section-info">
          <span>24h Change</span>
          {liquidity.status === MATH_NEGATIVE_TYPE.POSITIVE ? (
            <span className="positive">{volume24h.change24h.value}</span>
          ) : (
            <span className="negative">{volume24h.change24h.value}</span>
          )}
        </div>
      </section>
      <section>
        <h4>APR</h4>
        <strong>{apr.value}</strong>
        <div className="apr-info">
          <div className="content-wrap">
            <span>Fees</span>
            <span className="apr-value">{apr.fees}</span>
          </div>
          <AprDivider />
          <div className="content-wrap">
            <span>Rewards</span>
            <span className="apr-value">{apr.rewards}</span>
          </div>
        </div>
      </section>
    </PoolPairInfoContentWrapper>
  );
};

export default PoolPairInfoContent;
