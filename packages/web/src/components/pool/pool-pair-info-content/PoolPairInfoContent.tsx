import React, { useMemo, useState } from "react";
import {
  AprDivider,
  ContentWrapper,
  LoadingChart,
  PoolPairInfoContentWrapper,
} from "./PoolPairInfoContent.styles";
import IconStar from "@components/common/icons/IconStar";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { numberToFormat } from "@utils/string-utils";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { convertToKMB, formatUsdNumber } from "@utils/stake-position-utils";
import IconTriangleArrowUpV2 from "@components/common/icons/IconTriangleArrowUpV2";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useWindowSize } from "@hooks/common/use-window-size";
import IconSwap from "@components/common/icons/IconSwap";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { makeDisplayTokenAmount } from "@utils/token-utils";
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
}) => {
  const [isSwap, setIsSwap] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { width } = useWindowSize();

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
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const liquidityValue = useMemo((): string => {
    return formatUsdNumber(Number(pool.tvl).toString(), undefined, true);
  }, [pool.tvl]);
  
  const volumeValue = useMemo((): string => {
    return formatUsdNumber(Number(pool.volume).toString(), undefined, true);
  }, [pool.volume]);

  const aprValue = useMemo(() => {
    if (!pool.apr) {
      return "-";
    }
    if (Number(pool.apr) >= 100) {
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
    return `$${convertToKMB(`${Number(pool.feeChange)}`, 2)}`;
  }, [pool.feeChange]);

  const rewardChangedStr = useMemo((): string => {
    return "$1.23K";
  }, []);

  const stringPrice = useMemo(() => {
    if (isSwap) {
      return `1 ${pool?.tokenB?.symbol} = ${numberToFormat(1 / pool?.price, 6)} ${pool?.tokenA?.symbol}`;
    }
    return `1 ${pool?.tokenA?.symbol} = ${numberToFormat(pool?.price, 6)} ${pool?.tokenB?.symbol}`;
  }, [isSwap, pool?.tokenB?.symbol, pool?.tokenA?.symbol, pool?.price]);
  return (
    <ContentWrapper>
      <PoolPairInfoContentWrapper>
        <section>
          <h4>TVL</h4>
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({ h: 20, w:"170px" ,smallTableWidth : 140} )}
            />
            </SkeletonEarnDetailWrapper>}
          {!loading && <div className="wrapper-value">
            <strong>{liquidityValue}</strong>
            <div>
              {pool.tvlChange >=0 ? <IconTriangleArrowUpV2 /> : ""}  <span className={pool.tvlChange >= 0 ? "positive" : "negative"}> {liquidityChangedStr}</span>
            </div>
          </div>}
          <div className="section-info">
            {!loading &&<>
              <div className="section-image">
                <MissingLogo
                  symbol={pool?.tokenA?.symbol}
                  url={pool?.tokenA?.logoURI}
                  width={20}
                  className="image-logo"
                />
                <span>{convertToKMB(`${tokenABalance}`)} <span className="token-symbol">{pool?.tokenA?.symbol}</span> <span className="token-percent">{depositRatioStrOfTokenA}</span></span>
              </div>
              <div className="divider"></div>
              <div className="section-image">
                <MissingLogo
                  symbol={pool?.tokenB?.symbol}
                  url={pool?.tokenB?.logoURI}
                  width={20}
                  className="image-logo"
                />
                <span>{convertToKMB(`${tokenBBalance}`)} <span className="token-symbol">{pool?.tokenB?.symbol}</span> <span className="token-percent">{depositRatioStrOfTokenB}</span></span>
              </div>
            </>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"250px"})}
              />
              </SkeletonEarnDetailWrapper>}
          </div>
        </section>
        <section>
          <h4>Volume 24h</h4>
          {!loading && <div className="wrapper-value">
            <strong>{volumeValue}</strong>
            <div>
              <IconTriangleArrowUpV2 />  <span className="positive"> {volumeChangedStr}</span>
            </div>
          </div>}
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"170px" ,smallTableWidth : 140})}
              />
              </SkeletonEarnDetailWrapper>}
          <div className="section-info flex-row">
            <span>All-Time Volume</span>
            {!loading && <div className="section-image">
              <span>12.34M</span>
            </div>}

            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"50px"})}
              />
            </SkeletonEarnDetailWrapper>}
          </div>
        </section>
        <section>
          <h4>APR</h4>
          {!loading && <strong>{aprValue}</strong>}
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({ h: 20, w:"170px"})}
          />
          </SkeletonEarnDetailWrapper>}
          <div className="apr-info">
            <div className="content-wrap">
              <span>Fees 24h</span>
              {!loading && <span className="apr-value">{feeChangedStr}</span>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"50px"})}
              />
              </SkeletonEarnDetailWrapper>}
            </div>
            <AprDivider />
            <div className="content-wrap content-reward">
              <span>Rewards 24h</span>
              {!loading && <span className="apr-value">{rewardChangedStr}</span>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"50px"})}
              />
              </SkeletonEarnDetailWrapper>}
            </div>
          </div>
        </section>
      </PoolPairInfoContentWrapper>
      <section>
        <div className="position-wrapper-chart">
          <div className="position-header">
            <div>Current Price</div>
            <div className="swap-price">
              {!loading && <div className="left">
                <MissingLogo
                  symbol={pool?.tokenA?.symbol}
                  url={pool?.tokenA?.logoURI}
                  width={20}
                  className="image-logo"
                />
                1 {pool?.tokenA?.symbol} = {convertToKMB(`${pool.price}`, 6)} {pool?.tokenB?.symbol}
              </div>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"80px"})}
              />
            </SkeletonEarnDetailWrapper>}
              <AprDivider className="divider"/>
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w:"80px"})}
              />
            </SkeletonEarnDetailWrapper>}
              {!loading && <div className="right">
                <MissingLogo
                  symbol={pool?.tokenB?.symbol}
                  url={pool?.tokenB?.logoURI}
                  width={20}
                  className="image-logo"
                />
                1 {pool?.tokenB?.symbol} = {convertToKMB(`${(1 / pool.price).toFixed(6)}`, 6)} {pool?.tokenA?.symbol}
              </div>}
            </div>
            <div className="swap-price-mobile">
              <MissingLogo
                symbol={pool?.tokenA?.symbol}
                url={pool?.tokenA?.logoURI}
                width={20}
                className="image-logo"
              />
              {stringPrice}
              <div onClick={() => setIsSwap(!isSwap)}>
                <IconSwap />
              </div>
            </div>
          </div>
          {!loading && <PoolGraph
            tokenA={pool?.tokenA}
            tokenB={pool?.tokenB}
            bins={pool?.bins}
            currentTick={pool?.currentTick}
            width={Math.min(width - (width > 767 ? 224 : 102), 1216)}
            height={150}
            mouseover
            themeKey={themeKey}
            position="top"
            offset={40}
            poolPrice={pool?.price || 1}
          />}
          {loading && <LoadingChart>
            <LoadingSpinner />
          </LoadingChart>}
        </div>
      </section>
    </ContentWrapper>
  );
};

export default PoolPairInfoContent;
