import React, { useMemo } from "react";
import {
  AprDivider,
  ContentWrapper,
  LoadingChart,
  PoolPairInfoContentWrapper,
} from "./PoolPairInfoContent.styles";
import IconStar from "@components/common/icons/IconStar";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { numberToFormat, numberToRate } from "@utils/string-utils";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import IconTriangleArrowUpV2 from "@components/common/icons/IconTriangleArrowUpV2";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { useWindowSize } from "@hooks/common/use-window-size";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { tickToPriceStr } from "@utils/swap-utils";
import Tooltip from "@components/common/tooltip/Tooltip";
import TooltipAPR from "./TooltipAPR";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { toUnitFormat } from "@utils/number-utils";
import IconTriangleArrowDownV2 from "@components/common/icons/IconTriangleArrowDownV2";
import { PoolBinModel } from "@models/pool/pool-bin-model";
interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
  loadingBins: boolean;
  poolBins: PoolBinModel[];
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
  loadingBins,
  poolBins,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { width } = useWindowSize();
  const GRAPWIDTH = Math.min(width - (width > 767 ? 224 : 80), 1216);

  const tokenABalance = useMemo(() => {
    return pool.tokenABalance || 0;
  }, [pool.tokenABalance]);

  const tokenBBalance = useMemo(() => {
    return pool.tokenBBalance || 0;
  }, [pool.tokenBBalance]);

  const depositRatio = useMemo(() => {
    const sumOfBalances = Number(tokenABalance) + Number(tokenBBalance);
    if (sumOfBalances === 0) {
      return 0.5;
    }
    return (
      Number(tokenABalance) /
      (Number(tokenABalance) + Number(tokenBBalance) / pool.price)
    );
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
    if (!pool.tvl) return "-";

    return toUnitFormat(pool.tvl, true, true);
  }, [pool.tvl]);

  const volumeValue = useMemo((): string => {
    if (!pool.volume24h) return "-";

    return toUnitFormat(pool.volume24h, true, true);
  }, [pool.volume24h]);

  const aprValue = useMemo(() => {
    if (!pool.totalApr) return "-";

    const aprStr = numberToRate(pool.totalApr, { isRounding: false });
    const totalAPR = pool.totalApr || 0;
    if (Number(pool.tvl) < 0.01) {
      return "0%";
    }

    if (Number(totalAPR) >= 100) {
      return (
        <>
          <IconStar />
          {aprStr}
        </>
      );
    }
    return aprStr;
  }, [pool.totalApr, pool.tvl]);

  const liquidityChangedStr = useMemo((): string => {
    return `${numberToFormat(Math.abs(pool.tvlChange), {
      decimals: 2,
      forceDecimals: true,
    })}%`;
  }, [pool.tvlChange]);

  const volumeChangedStr = useMemo((): string => {
    return `${numberToFormat(Math.abs(pool.volumeChange24h), {
      decimals: 2,
      forceDecimals: true,
    })}%`;
  }, [pool.volumeChange24h]);

  const feeChangedStr = useMemo((): string => {
    if (!pool.feeUsd24h) return "-";

    return toUnitFormat(pool.feeUsd24h, true, true);
  }, [pool.feeUsd24h]);

  const rewardChangedStr = useMemo((): string => {
    if (!pool.rewards24hUsd) return "-";

    return toUnitFormat(pool.rewards24hUsd, true, true);
  }, [pool.rewards24hUsd]);

  const isWrapText = useMemo(() => {
    return (
      pool?.tokenA?.symbol.length === 4 || pool?.tokenB?.symbol.length === 4
    );
  }, [pool?.tokenB?.symbol, pool?.tokenA?.symbol]);

  const currentPrice = useMemo(() => {
    const price = tickToPriceStr(pool.currentTick, { decimals: 40, isFormat: false });

    return formatTokenExchangeRate(
      price, {
      maxSignificantDigits: 6,
      fixedDecimalDigits: 6,
      minLimit: 0.000001,
    });
  }, [pool?.currentTick]);

  const feeLogo = useMemo(() => {
    return [
      { ...pool.tokenA, ...getGnotPath(pool.tokenA) },
      { ...pool.tokenB, ...getGnotPath(pool.tokenB) }
    ];
  }, [getGnotPath, pool.tokenA, pool.tokenB]);

  const stakeLogo = useMemo(() => {
    return pool?.rewardTokens?.map(item => ({
      ...item,
      ...getGnotPath(item),
    }));
  }, [getGnotPath, pool?.rewardTokens]);

  const isHideBar = useMemo(() => {
    const isAllReserveZeroPoolBin = poolBins?.every(
      item =>
        Number(item.reserveTokenA) === 0 && Number(item.reserveTokenB) === 0,
    );

    return isAllReserveZeroPoolBin;
  }, [poolBins]);

  return (
    <ContentWrapper>
      <PoolPairInfoContentWrapper>
        <section>
          <h4>TVL</h4>
          {loading && (
            <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({
                  h: 20,
                  w: "170px",
                  smallTableWidth: 140,
                })}
              />
            </SkeletonEarnDetailWrapper>
          )}
          {!loading && (
            <div className="wrapper-value">
              <strong>{liquidityValue}</strong>
              {pool.tvlChange ? <div>
                {pool.tvlChange >= 0 ? (
                  <IconTriangleArrowUpV2 />
                ) : (
                  <IconTriangleArrowDownV2 />
                )}{" "}
                <span className={pool.tvlChange >= 0 ? "positive" : "negative"}>
                  {" "}
                  {liquidityChangedStr}
                </span>
              </div> : "-"}
            </div>
          )}
          <div className="section-info">
            {!loading && (
              <>
                <div className="section-image">
                  <MissingLogo
                    symbol={pool?.tokenA?.symbol}
                    url={pool?.tokenA?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  <span>
                    {formatTokenExchangeRate(tokenABalance, {
                      minLimit: 0.000001,
                      maxSignificantDigits: 6,
                      fixedDecimalDigits: 6,
                    })}{" "}
                    <span
                      className={`token-symbol ${isWrapText ? "wrap-text" : ""
                        }`}
                    >
                      {pool?.tokenA?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenA}
                    </span>
                  </span>
                </div>
                <div className="divider"></div>
                <div className="section-image">
                  <MissingLogo
                    symbol={pool?.tokenB?.symbol}
                    url={pool?.tokenB?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  <span>
                    {formatTokenExchangeRate(`${tokenBBalance}`, {
                      minLimit: 0.000001,
                      maxSignificantDigits: 6,
                      fixedDecimalDigits: 6,
                    })}{" "}
                    <span
                      className={`token-symbol ${isWrapText ? "wrap-text" : ""
                        }`}
                    >
                      {pool?.tokenB?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenB}
                    </span>
                  </span>
                </div>
              </>
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "250px" })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </section>
        <section>
          <h4>Volume 24h</h4>
          {!loading && (
            <div className="wrapper-value">
              <strong>{volumeValue}</strong>
              {pool.volumeChange24h ? <div>
                {pool.volumeChange24h >= 0 ? <IconTriangleArrowUpV2 /> : <IconTriangleArrowDownV2 />}{" "}
                <span className={pool.volumeChange24h >= 0 ? "positive" : "negative"}> {volumeChangedStr}</span>
              </div> : "-"}
            </div>
          )}
          {loading && (
            <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({
                  h: 20,
                  w: "170px",
                  smallTableWidth: 140,
                })}
              />
            </SkeletonEarnDetailWrapper>
          )}
          <div className="section-info flex-row">
            <span>All-Time Volume</span>
            {!loading && (
              <div className="section-image">
                <span>
                  {pool.allTimeVolumeUsd ? toUnitFormat(pool.allTimeVolumeUsd, true, true) : "-"}
                </span>
              </div>
            )}

            {loading && (
              <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </section>
        <section>
          <h4>APR</h4>
          {!loading && (
            <Tooltip
              placement="top"
              FloatingContent={
                <TooltipAPR
                  feeAPR={pool?.feeApr}
                  stakingAPR={pool?.stakingApr}
                  feeLogo={feeLogo}
                  stakeLogo={stakeLogo}
                />
              }
            >
              <strong className="apr-content">{aprValue}</strong>
            </Tooltip>
          )}
          {loading && (
            <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
              <span css={pulseSkeletonStyle({ h: 20, w: "170px" })} />
            </SkeletonEarnDetailWrapper>
          )}
          <div className="apr-info">
            <div className="content-wrap">
              <span>Fees 24h</span>
              {!loading && <span className="apr-value">{feeChangedStr}</span>}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
                </SkeletonEarnDetailWrapper>
              )}
            </div>
            <AprDivider />
            <div className="content-wrap content-reward">
              <span>Rewards 24h</span>
              {!loading && (
                <span className="apr-value">{rewardChangedStr}</span>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
                </SkeletonEarnDetailWrapper>
              )}
            </div>
          </div>
        </section>
      </PoolPairInfoContentWrapper>
      <section className="chart-chart-container">
        <div className="position-wrapper-chart">
          <div className="position-header">
            <div>Current Price</div>
            <div className="swap-price">
              {!loading && (
                <div className="left">
                  <MissingLogo
                    symbol={pool?.tokenA?.symbol}
                    url={pool?.tokenA?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  {width >= 768 && `1 ${pool?.tokenA?.symbol}`} ={" "}
                  {currentPrice} {pool?.tokenB?.symbol}
                </div>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
              <AprDivider className="divider" />
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
              {!loading && (
                <div className="right">
                  <MissingLogo
                    symbol={pool?.tokenB?.symbol}
                    url={pool?.tokenB?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  {width >= 768 && `1 ${pool?.tokenB?.symbol}`} ={" "}
                  {formatTokenExchangeRate(Number(1 / pool.price).toFixed(width > 400 ? 6 : 2))}{" "}
                  {pool?.tokenA?.symbol}
                </div>
              )}
            </div>
          </div>
          {!loadingBins && (
            <PoolGraph
              tokenA={pool?.tokenA}
              tokenB={pool?.tokenB}
              bins={poolBins ?? []}
              currentTick={pool?.currentTick}
              width={GRAPWIDTH}
              height={150}
              mouseover
              themeKey={themeKey}
              position="top"
              offset={40}
              poolPrice={pool?.price || 1}
              showBar={!isHideBar}
            />
          )}
          {loadingBins && (
            <LoadingChart>
              <LoadingSpinner />
            </LoadingChart>
          )}
        </div>
      </section>
    </ContentWrapper>
  );
};

export default PoolPairInfoContent;
