import React, { useMemo } from "react";
import {
  AprDivider,
  AprSectionWrapper,
  ContentWrapper,
  LoadingChart,
  PoolPairInfoContentWrapper,
  TokenAmountTooltipContentWrapper,
  TvlSectionWrapper,
  VolumeSectionWrapper,
} from "./PoolPairInfoContent.styles";
import IconStar from "@components/common/icons/IconStar";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
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
import Tooltip from "@components/common/tooltip/Tooltip";
import TooltipAPR from "./TooltipAPR";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import IconTriangleArrowDownV2 from "@components/common/icons/IconTriangleArrowDownV2";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import BigNumber from "bignumber.js";
import {
  formatOtherPrice,
  formatPoolPairAmount,
  formatRate,
} from "@utils/new-number-utils";

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
    const depositStr = formatRate(depositRatio * 100, { decimals: 0 });

    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    const depositStr = formatRate((1 - depositRatio) * 100, { decimals: 0 });

    return `(${depositStr})`;
  }, [depositRatio]);

  const liquidityValue = useMemo((): string => {
    return formatOtherPrice(pool.tvl);
  }, [pool.tvl]);

  const volumeValue = useMemo((): string => {
    return formatOtherPrice(pool.volume24h, { isKMB: false });
  }, [pool.volume24h]);

  const volumeChangedValue = useMemo(() => {
    if (!pool.volume24h) return "";

    if (!pool.volumeChange24h) {
      return (
        <div>
          <IconTriangleArrowUpV2 />{" "}
          <span className={"positive"}> {"0.00%"}</span>
        </div>
      );
    }

    const volumeChangedStr = formatRate(Math.abs(pool.volumeChange24h));

    return (
      <div>
        {pool.volumeChange24h >= 0 ? (
          <IconTriangleArrowUpV2 />
        ) : (
          <IconTriangleArrowDownV2 />
        )}{" "}
        <span className={pool.volumeChange24h >= 0 ? "positive" : "negative"}>
          {" "}
          {volumeChangedStr}
        </span>
      </div>
    );
  }, [pool.volume24h, pool.volumeChange24h]);

  const aprValue = useMemo(() => {
    if (!pool.totalApr) return "-";

    const aprStr = formatRate(pool.totalApr);
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

  const liquidityChangedValue = useMemo(() => {
    if (!pool.tvl) return "";

    if (!pool.tvlChange) {
      return (
        <div>
          <IconTriangleArrowUpV2 />
          <span className={pool.tvlChange >= 0 ? "positive" : "negative"}>
            0.00%
          </span>
        </div>
      );
    }

    const liquidityChangedStr = formatRate(Math.abs(pool.tvlChange));

    return (
      <div>
        {pool.tvlChange >= 0 ? (
          <IconTriangleArrowUpV2 />
        ) : (
          <IconTriangleArrowDownV2 />
        )}{" "}
        <span className={pool.tvlChange >= 0 ? "positive" : "negative"}>
          {" "}
          {liquidityChangedStr}
        </span>
      </div>
    );
  }, [pool.tvl, pool.tvlChange]);

  const feeChangedStr = useMemo((): string => {
    if (!pool.feeUsd24h) return "-";

    return formatOtherPrice(pool.feeUsd24h);
  }, [pool.feeUsd24h]);

  const rewardChangedStr = useMemo((): string => {
    if (!pool.rewards24hUsd) return "-";

    return formatOtherPrice(pool.rewards24hUsd);
  }, [pool.rewards24hUsd]);

  const isWrapText = useMemo(() => {
    return (
      pool?.tokenA?.symbol.length === 4 || pool?.tokenB?.symbol.length === 4
    );
  }, [pool?.tokenB?.symbol, pool?.tokenA?.symbol]);

  const currentPriceRatioNumber = useMemo(() => {
    const tokenADecimals = pool.tokenA.decimals || 0;
    const tokenBDecimals = pool.tokenB.decimals || 0;

    return BigNumber(pool.price)
      .shiftedBy(-tokenADecimals + tokenBDecimals)
      .toNumber();
  }, [pool.price, pool.tokenA.decimals, pool.tokenB.decimals]);

  const currentPriceRatio = useMemo(() => {
    return formatTokenExchangeRate(currentPriceRatioNumber, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    });
  }, [currentPriceRatioNumber]);

  const currentPriceReverse = useMemo(() => {
    if (currentPriceRatioNumber === 0) return "-";

    return formatTokenExchangeRate(1 / currentPriceRatioNumber, {
      maxSignificantDigits: 6,
      minLimit: 0.000001,
    });
  }, [currentPriceRatioNumber]);

  const feeLogo = useMemo(() => {
    return [
      { ...pool.tokenA, ...getGnotPath(pool.tokenA) },
      { ...pool.tokenB, ...getGnotPath(pool.tokenB) },
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

  const tvlDisplay = useMemo(() => {
    if (loading) {
      return (
        <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({
              h: 20,
              w: "170px",
              smallTableWidth: 140,
            })}
          />
        </SkeletonEarnDetailWrapper>
      );
    }

    return (
      <div className="wrapper-value">
        <strong>{liquidityValue}</strong>
        {liquidityChangedValue}
      </div>
    );
  }, [liquidityChangedValue, liquidityValue, loading]);

  return (
    <ContentWrapper>
      <PoolPairInfoContentWrapper>
        <TvlSectionWrapper>
          <h4>TVL</h4>
          {tvlDisplay}
          <div className="section-info">
            {!loading && (
              <>
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <TokenAmountTooltipContentWrapper>
                      <MissingLogo
                        symbol={pool?.tokenA?.symbol}
                        url={pool?.tokenA?.logoURI}
                        width={20}
                        className="image-logo"
                      />
                      {formatPoolPairAmount(pool.tokenABalance, {
                        isKMB: false,
                        decimals: pool.tokenA.decimals,
                      })}{" "}
                      <span>{pool?.tokenA?.symbol}</span>{" "}
                    </TokenAmountTooltipContentWrapper>
                  }
                  className={`section-image ${
                    pool.tokenABalance ? "can-hover" : ""
                  }`}
                >
                  <MissingLogo
                    symbol={pool?.tokenA?.symbol}
                    url={pool?.tokenA?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  <span>
                    {formatPoolPairAmount(pool.tokenABalance, {
                      decimals: 2,
                    })}{" "}
                    <span
                      className={`token-symbol ${
                        isWrapText ? "wrap-text" : ""
                      }`}
                    >
                      {pool?.tokenA?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenA}
                    </span>
                  </span>
                </Tooltip>
                <div className="divider"></div>
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <TokenAmountTooltipContentWrapper>
                      <MissingLogo
                        symbol={pool?.tokenB?.symbol}
                        url={pool?.tokenB?.logoURI}
                        width={20}
                        className="image-logo"
                      />
                      {formatPoolPairAmount(pool.tokenBBalance, {
                        isKMB: false,
                        decimals: pool.tokenA.decimals,
                      })}
                      <span>{pool?.tokenB?.symbol}</span>{" "}
                    </TokenAmountTooltipContentWrapper>
                  }
                  className={`section-image ${
                    pool.tokenBBalance ? "can-hover" : ""
                  }`}
                >
                  <MissingLogo
                    symbol={pool?.tokenB?.symbol}
                    url={pool?.tokenB?.logoURI}
                    width={20}
                    className="image-logo"
                  />
                  <span>
                    {formatPoolPairAmount(pool.tokenBBalance, {
                      decimals: 2,
                    })}{" "}
                    <span
                      className={`token-symbol ${
                        isWrapText ? "wrap-text" : ""
                      }`}
                    >
                      {pool?.tokenB?.symbol}
                    </span>{" "}
                    <span className="token-percent">
                      {depositRatioStrOfTokenB}
                    </span>
                  </span>
                </Tooltip>
              </>
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "250px" })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </TvlSectionWrapper>
        <VolumeSectionWrapper>
          <h4>Volume 24h</h4>
          {!loading && (
            <div className="wrapper-value">
              <strong>{volumeValue}</strong>
              {volumeChangedValue}
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
                <span>{formatOtherPrice(pool.allTimeVolumeUsd)}</span>
              </div>
            )}

            {loading && (
              <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </VolumeSectionWrapper>
        <AprSectionWrapper>
          <h4>APR</h4>
          {!loading && (
            <Tooltip
              placement="top"
              FloatingContent={
                <TooltipAPR
                  feeAPR={Number(pool.tvl) < 0.01 ? "0" : pool?.feeApr}
                  stakingAPR={Number(pool.tvl) < 0.01 ? "0" : pool?.stakingApr}
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
              <span
                css={pulseSkeletonStyle({
                  h: 20,
                  w: "170px",
                  smallTableWidth: "130",
                })}
              />
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
        </AprSectionWrapper>
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
                  {currentPriceRatio} {pool?.tokenB?.symbol}
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
                  {currentPriceReverse} {pool?.tokenA?.symbol}
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
