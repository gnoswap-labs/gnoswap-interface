import React, { useMemo } from "react";
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
import { convertToKMB } from "@utils/stake-position-utils";
import IconTriangleArrowUpV2 from "@components/common/icons/IconTriangleArrowUpV2";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useWindowSize } from "@hooks/common/use-window-size";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { tickToPriceStr } from "@utils/swap-utils";
import Tooltip from "@components/common/tooltip/Tooltip";
import TooltipAPR from "./TooltipAPR";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { toUnitFormat } from "@utils/number-utils";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
  positions: PoolPositionModel[];
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { width } = useWindowSize();
  const GRAPWIDTH = Math.min(width - (width > 767 ? 224 : 80), 1216);

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
    return tokenABalance / (tokenABalance + tokenBBalance / pool.price);
  }, [tokenABalance, tokenBBalance, pool.price]);

  const depositRatioStrOfTokenA = useMemo(() => {
    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const liquidityValue = useMemo((): string => {
    return toUnitFormat(pool.tvl, true, true);
  }, [pool.tvl]);

  const volumeValue = useMemo((): string => {
    return toUnitFormat(pool.volume24h, true, true);
  }, [pool.volume24h]);

  const aprValue = useMemo(() => {
    if (!pool.totalApr) {
      return "-";
    }
    if (Number(pool.totalApr) >= 100) {
      return <><IconStar />{`${pool.totalApr}%`}</>;
    }
    return `${pool.totalApr}%`;
  }, [pool.totalApr]);

  const liquidityChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.tvlChange, 2)}%`;
  }, [pool.tvlChange]);

  const volumeChangedStr = useMemo((): string => {
    return `${numberToFormat(pool.volumeChange, 2)}%`;
  }, [pool.volumeChange]);

  const feeChangedStr = useMemo((): string => {
    return toUnitFormat(pool.feeChange, true, true);
  }, [pool.feeChange]);

  const rewardChangedStr = useMemo((): string => {
    return "$0";
  }, []);

  const isWrapText = useMemo(() => {
    return pool?.tokenA?.symbol.length === 4 || pool?.tokenB?.symbol.length === 4;
  }, [pool?.tokenB?.symbol, pool?.tokenA?.symbol]);

  const currentPrice = useMemo(() => {
    return tickToPriceStr(pool.currentTick, 40);
  }, [pool?.currentTick]);

  const feeLogo = useMemo(() => {
    return [pool?.tokenA?.logoURI, pool?.tokenB?.logoURI];
  }, [pool]);

  const stakeLogo = useMemo(() => {
    return pool?.rewardTokens?.map((item) => getGnotPath(item)?.logoURI);
  }, [pool?.rewardTokens]);

  return (
    <ContentWrapper>
      <PoolPairInfoContentWrapper>
        <section>
          <h4>TVL</h4>
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({ h: 20, w: "170px", smallTableWidth: 140 })}
            />
          </SkeletonEarnDetailWrapper>}
          {!loading && <div className="wrapper-value">
            <strong>{liquidityValue}</strong>
            <div>
              {pool.tvlChange >= 0 ? <IconTriangleArrowUpV2 /> : ""}  <span className={pool.tvlChange >= 0 ? "positive" : "negative"}> {liquidityChangedStr}</span>
            </div>
          </div>}
          <div className="section-info">
            {!loading && <>
              <div className="section-image">
                <MissingLogo
                  symbol={pool?.tokenA?.symbol}
                  url={pool?.tokenA?.logoURI}
                  width={20}
                  className="image-logo"
                />
                <span>{convertToKMB(`${tokenABalance}`)} <span className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}>{pool?.tokenA?.symbol}</span> <span className="token-percent">{depositRatioStrOfTokenA}</span></span>
              </div>
              <div className="divider"></div>
              <div className="section-image">
                <MissingLogo
                  symbol={pool?.tokenB?.symbol}
                  url={pool?.tokenB?.logoURI}
                  width={20}
                  className="image-logo"
                />
                <span>{convertToKMB(`${tokenBBalance}`)} <span className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}>{pool?.tokenB?.symbol}</span> <span className="token-percent">{depositRatioStrOfTokenB}</span></span>
              </div>
            </>}
            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w: "250px" })}
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
              css={pulseSkeletonStyle({ h: 20, w: "170px", smallTableWidth: 140 })}
            />
          </SkeletonEarnDetailWrapper>}
          <div className="section-info flex-row">
            <span>All-Time Volume</span>
            {!loading && <div className="section-image">
              <span>{toUnitFormat(pool.totalVolume, true, true)}</span>
            </div>}

            {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
              <span
                css={pulseSkeletonStyle({ h: 20, w: "50px" })}
              />
            </SkeletonEarnDetailWrapper>}
          </div>
        </section>
        <section>
          <h4>APR</h4>
          {!loading &&
            <Tooltip
              placement="top"
              FloatingContent={<TooltipAPR feeAPR={pool?.feeApr} stakingAPR={pool?.stakingApr} feeLogo={feeLogo} stakeLogo={stakeLogo} />}
            >
              <strong>{aprValue}</strong>
            </Tooltip>}
          {loading && <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
            <span
              css={pulseSkeletonStyle({ h: 20, w: "170px" })}
            />
          </SkeletonEarnDetailWrapper>}
          <div className="apr-info">
            <div className="content-wrap">
              <span>Fees 24h</span>
              {!loading && <span className="apr-value">{feeChangedStr}</span>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span
                  css={pulseSkeletonStyle({ h: 20, w: "50px" })}
                />
              </SkeletonEarnDetailWrapper>}
            </div>
            <AprDivider />
            <div className="content-wrap content-reward">
              <span>Rewards 24h</span>
              {!loading && <span className="apr-value">{rewardChangedStr}</span>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span
                  css={pulseSkeletonStyle({ h: 20, w: "50px" })}
                />
              </SkeletonEarnDetailWrapper>}
            </div>
          </div>
        </section>
      </PoolPairInfoContentWrapper>
      <section className="chart-chart-container">
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
                {width >= 768 && `1 ${pool?.tokenA?.symbol}`} = <ExchangeRate value={currentPrice} /> {pool?.tokenB?.symbol}
              </div>}
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span
                  css={pulseSkeletonStyle({ h: 20, w: "80px" })}
                />
              </SkeletonEarnDetailWrapper>}
              <AprDivider className="divider" />
              {loading && <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span
                  css={pulseSkeletonStyle({ h: 20, w: "80px" })}
                />
              </SkeletonEarnDetailWrapper>}
              {!loading && <div className="right">
                <MissingLogo
                  symbol={pool?.tokenB?.symbol}
                  url={pool?.tokenB?.logoURI}
                  width={20}
                  className="image-logo"
                />
                {width >= 768 && `1 ${pool?.tokenB?.symbol}`} = <ExchangeRate value={convertToKMB(`${Number((Number(1 / pool.price)).toFixed(width > 400 ? 6 : 2))}`, { maximumFractionDigits: 6 })} /> {pool?.tokenA?.symbol}
              </div>}
            </div>
          </div>
          {!loading && <PoolGraph
            tokenA={pool?.tokenA}
            tokenB={pool?.tokenB}
            bins={pool?.bins}
            currentTick={pool?.currentTick}
            width={GRAPWIDTH}
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
