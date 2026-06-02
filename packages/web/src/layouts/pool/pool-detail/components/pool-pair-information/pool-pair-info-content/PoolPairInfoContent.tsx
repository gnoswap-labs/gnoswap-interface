import { useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "@emotion/css";

import { STATIC_TEXT, DEFAULT_TOKEN_PRICE_RATIO } from "@common/values";
import IconStar from "@components/common/icons/IconStar";
import IconAdd from "@components/common/icons/IconAdd";
import IconRemove from "@components/common/icons/IconRemove";
import IconTriangleArrowDownV2 from "@components/common/icons/IconTriangleArrowDownV2";
import IconTriangleArrowUpV2 from "@components/common/icons/IconTriangleArrowUpV2";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolLiquiditySegmentModel } from "@models/pool/pool-liquidity-model";
import { TokenModel } from "@models/token/token-model";
import { ThemeState } from "@states/index";
import { formatOtherPrice, formatPoolPairAmount, formatRate } from "@utils/new-number-utils";
import { makeDisplayPrice } from "@utils/pool-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import {
  AprDivider,
  AprSectionWrapper,
  ContentWrapper,
  LoadingChart,
  PoolPairInfoContentWrapper,
  TokenAmountTooltipContentWrapper,
  ToolTipContentWrapper,
  TvlSectionWrapper,
  VolumeSectionWrapper,
} from "./PoolPairInfoContent.styles";
import TooltipAPR from "./TooltipAPR";
import IconInfo from "@components/common/icons/IconInfo";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import PriceWarning from "@components/common/price-warning/PriceWarning";

interface PoolPairInfoContentProps {
  pool: PoolDetailModel;
  loading: boolean;
  loadingBins: boolean;
  liquiditySegments: PoolLiquiditySegmentModel[];
  currentSqrtPriceX96?: bigint | null;
  availInfo: {
    availZoomIn: boolean;
    availZoomOut: boolean;
  };
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  pool,
  loading,
  loadingBins,
  liquiditySegments,
  currentSqrtPriceX96,
  availInfo,
  onZoomIn,
  onZoomOut,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const { priceStyle: tokenAPriceStyle, shouldShowPriceWarning: tokenAShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: pool.tokenAPriceGrade,
  });
  const { priceStyle: tokenBPriceStyle, shouldShowPriceWarning: tokenBShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: pool.tokenBPriceGrade,
  });
  const shouldShowPriceWarning = tokenAShouldShowPriceWarning || tokenBShouldShowPriceWarning;

  const themeKey = useAtomValue(ThemeState.themeKey);
  const { width, isMobile } = useWindowSize();
  const GRAPWIDTH = Math.min(width - (width > 767 ? 224 : 80), 1216);

  const tokenABalance = useMemo(() => {
    return pool.tokenABalance || 0;
  }, [pool.tokenABalance]);

  const tokenBBalance = useMemo(() => {
    return pool.tokenBBalance || 0;
  }, [pool.tokenBBalance]);

  const depositRatio = useMemo(() => {
    const tokenABalanceNum = Number(tokenABalance);
    const tokenBBalanceNum = Number(tokenBBalance);
    const sumOfBalances = tokenABalanceNum + tokenBBalanceNum;

    if (sumOfBalances === 0) {
      return 0.5;
    }

    const priceRatio = pool.price || DEFAULT_TOKEN_PRICE_RATIO;

    return tokenABalanceNum / (tokenABalanceNum + tokenBBalanceNum / priceRatio);
  }, [tokenABalance, tokenBBalance, pool.price]);

  const depositRatioStrOfTokenA = useMemo(() => {
    if (Number.isNaN(depositRatio)) return "(0%)";

    const depositStr = `${Math.round(depositRatio * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const depositRatioStrOfTokenB = useMemo(() => {
    if (Number.isNaN(depositRatio)) return "(0%)";

    const depositStr = `${Math.round((1 - depositRatio) * 100)}%`;
    return `(${depositStr})`;
  }, [depositRatio]);

  const liquidityValue = useMemo((): string => {
    return formatOtherPrice(pool.tvl);
  }, [pool.tvl]);

  const volumeValue = useMemo(() => formatOtherPrice(pool.volume24h), [pool.volume24h]);

  const volumeChangedValue = useMemo(() => {
    if (!pool.volume24h) return "";

    if (!pool.volumeChange24h) {
      return (
        <div>
          <IconTriangleArrowUpV2 className="arrow-icon" /> <span className={"positive"}> {"0.00%"}</span>
        </div>
      );
    }

    const volumeChangedStr = formatRate(Math.abs(pool.volumeChange24h));

    return (
      <div>
        {pool.volumeChange24h >= 0 ? (
          <IconTriangleArrowUpV2 className="arrow-icon" />
        ) : (
          <IconTriangleArrowDownV2 className="arrow-icon" />
        )}{" "}
        <span className={pool.volumeChange24h >= 0 ? "positive" : "negative"}> {volumeChangedStr}</span>
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
          <IconTriangleArrowUpV2 className="arrow-icon" />
          <span className={pool.tvlChange >= 0 ? "positive" : "negative"}>0.00%</span>
        </div>
      );
    }

    const liquidityChangedStr = formatRate(Math.abs(pool.tvlChange));

    return (
      <div>
        {pool.tvlChange >= 0 ? (
          <IconTriangleArrowUpV2 className="arrow-icon" />
        ) : (
          <IconTriangleArrowDownV2 className="arrow-icon" />
        )}{" "}
        <span className={pool.tvlChange >= 0 ? "positive" : "negative"}> {liquidityChangedStr}</span>
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
    return pool?.tokenA?.displaySymbol.length === 4 || pool?.tokenB?.displaySymbol.length === 4;
  }, [pool?.tokenB?.displaySymbol, pool?.tokenA?.displaySymbol]);

  const currentPriceRatioNumber = useMemo(() => {
    return makeDisplayPrice(pool.price, pool.tokenA, pool.tokenB);
  }, [pool.price, pool.tokenA, pool.tokenB]);

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
    return pool?.rewardTokens
      ?.reduce((accum: TokenModel[], current: TokenModel) => {
        const index = accum.findIndex(inserted => getGnotPath(inserted).path === getGnotPath(current).path);
        if (index === -1) {
          accum.push(current);
        }
        return accum;
      }, [])
      .map(item => ({
        ...item,
        ...getGnotPath(item),
      }));
  }, [getGnotPath, pool?.rewardTokens]);

  const isHideBar = useMemo(() => {
    return liquiditySegments.length === 0;
  }, [liquiditySegments.length]);

  const tvlDisplay = useMemo(() => {
    if (loading) {
      return (
        <PulseSkeletonWrapper height={39} mobileHeight={25}>
          <span
            css={pulseSkeletonStyle({
              h: 20,
              w: "170px",
              smallTableWidth: 140,
            })}
          />
        </PulseSkeletonWrapper>
      );
    }

    const iconSize = isMobile ? 15 : 19;

    return (
      <div className="wrapper-value">
        <span className={cx("tvl-info", tokenAPriceStyle.className, tokenBPriceStyle.className)}>
          <strong>{liquidityValue}</strong>
          {shouldShowPriceWarning && <PriceWarning type="TVL" size={iconSize} />}
        </span>

        {liquidityChangedValue}
      </div>
    );
  }, [liquidityChangedValue, liquidityValue, loading, shouldShowPriceWarning, isMobile]);

  return (
    <ContentWrapper>
      <PoolPairInfoContentWrapper>
        <TvlSectionWrapper>
          <h4>{STATIC_TEXT.TVL}</h4>
          <div className={cx("tvl-info", tokenAPriceStyle.className, tokenBPriceStyle.className)}>{tvlDisplay}</div>
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
                      <span>{pool?.tokenA?.displaySymbol || ""}</span>{" "}
                    </TokenAmountTooltipContentWrapper>
                  }
                  className={`section-image ${pool.tokenABalance ? "can-hover" : ""}`}
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
                    <span className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}>
                      {pool?.tokenA?.displaySymbol || ""}
                    </span>{" "}
                    <span className="token-percent">{depositRatioStrOfTokenA}</span>
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
                      <span>{pool?.tokenB?.displaySymbol || ""}</span>{" "}
                    </TokenAmountTooltipContentWrapper>
                  }
                  className={`section-image ${pool.tokenBBalance ? "can-hover" : ""}`}
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
                    <span className={`token-symbol ${isWrapText ? "wrap-text" : ""}`}>
                      {pool?.tokenB?.displaySymbol || ""}
                    </span>{" "}
                    <span className="token-percent">{depositRatioStrOfTokenB}</span>
                  </span>
                </Tooltip>
              </>
            )}
            {loading && (
              <PulseSkeletonWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "250px" })} />
              </PulseSkeletonWrapper>
            )}
          </div>
        </TvlSectionWrapper>
        <VolumeSectionWrapper>
          <h4>{t("Pool:poolInfo.section.volume.title")}</h4>
          {!loading && (
            <div className="wrapper-value">
              <strong>{volumeValue}</strong>
              {volumeChangedValue}
            </div>
          )}
          {loading && (
            <PulseSkeletonWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({
                  h: 20,
                  w: "170px",
                  smallTableWidth: 140,
                })}
              />
            </PulseSkeletonWrapper>
          )}
          <div className="section-info flex-row">
            <span>{t("Pool:poolInfo.section.volume.allTimeVol")}</span>
            {!loading && (
              <div className="section-image">
                <span>{formatOtherPrice(pool.allTimeVolumeUsd)}</span>
              </div>
            )}

            {loading && (
              <PulseSkeletonWrapper height={18} mobileHeight={18}>
                <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
              </PulseSkeletonWrapper>
            )}
          </div>
        </VolumeSectionWrapper>
        <AprSectionWrapper>
          <div className="title-wrapper">
            <h4>{STATIC_TEXT.APR}</h4>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>{t("business:positionPriceRangeInfo.feeApr.desc")}</ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
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
            <PulseSkeletonWrapper height={39} mobileHeight={25}>
              <span
                css={pulseSkeletonStyle({
                  h: 20,
                  w: "170px",
                  smallTableWidth: "130",
                })}
              />
            </PulseSkeletonWrapper>
          )}
          <div className="apr-info">
            <div className="content-wrap">
              <span>{t("Pool:poolInfo.section.apr.fee")}</span>
              {!loading && <span className="apr-value">{feeChangedStr}</span>}
              {loading && (
                <PulseSkeletonWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
                </PulseSkeletonWrapper>
              )}
            </div>
            <AprDivider />
            <div className="content-wrap content-reward">
              <span>{t("Pool:poolInfo.section.apr.reward")}</span>
              {!loading && <span className="apr-value">{rewardChangedStr}</span>}
              {loading && (
                <PulseSkeletonWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "50px" })} />
                </PulseSkeletonWrapper>
              )}
            </div>
          </div>
        </AprSectionWrapper>
      </PoolPairInfoContentWrapper>
      <section className="chart-chart-container">
        <div className="position-wrapper-chart">
          <div className="position-header">
            <div aria-hidden="true" className="spacer"></div>
            <div className="position-header-wrapper">
              <div>{t("business:currentPrice")}</div>
              <div className="swap-price">
                {!loading && (
                  <div className="left">
                    <MissingLogo
                      symbol={pool?.tokenA?.symbol}
                      url={pool?.tokenA?.logoURI}
                      width={20}
                      className="image-logo"
                    />
                    {width >= 768 && `1 ${pool?.tokenA?.displaySymbol || ""}`} = {currentPriceRatio}{" "}
                    {pool?.tokenB?.displaySymbol || ""}
                  </div>
                )}
                {loading && (
                  <PulseSkeletonWrapper height={18} mobileHeight={18}>
                    <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                  </PulseSkeletonWrapper>
                )}
                <AprDivider className="divider" />
                {loading && (
                  <PulseSkeletonWrapper height={18} mobileHeight={18}>
                    <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                  </PulseSkeletonWrapper>
                )}
                {!loading && (
                  <div className="right">
                    <MissingLogo
                      symbol={pool?.tokenB?.symbol}
                      url={pool?.tokenB?.logoURI}
                      width={20}
                      className="image-logo"
                    />
                    {width >= 768 && `1 ${pool?.tokenB?.displaySymbol || ""}`} = {currentPriceReverse}{" "}
                    {pool?.tokenA?.displaySymbol || ""}
                  </div>
                )}
              </div>
            </div>
            {!loadingBins && (
              <div className="zoom-controller">
                <button className={cx({ disabled: !availInfo.availZoomOut })} onClick={onZoomOut}>
                  <IconRemove />
                </button>
                <button className={cx({ disabled: !availInfo.availZoomIn })} onClick={onZoomIn}>
                  <IconAdd />
                </button>
              </div>
            )}
          </div>
          {!loadingBins && (
            <PoolGraph
              tokenA={pool?.tokenA}
              tokenB={pool?.tokenB}
              liquiditySegments={liquiditySegments}
              currentTick={pool?.currentTick}
              currentSqrtPriceX96={currentSqrtPriceX96}
              currentPrice={pool?.price}
              width={GRAPWIDTH}
              height={150}
              mouseover
              themeKey={themeKey}
              position="top"
              offset={40}
              disabled={isHideBar}
              disableBlackBars={true}
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
