import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION, RewardType } from "@constants/option.constant";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo, useState } from "react";
import {
  CopyTooltip,
  ManageItem,
  MyPositionCardWrapper,
  PositionCardAnchor,
  ToolTipContentWrapper,
} from "./MyPositionCard.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { TokenModel } from "@models/token/token-model";
import { BalanceTooltipContent } from "./MyPositionCardBalanceContent";
import { MyPositionRewardContent } from "./MyPositionCardRewardContent";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { MyPositionAprContent } from "./MyPositionCardAprContent";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { IncreaseState, ThemeState } from "@states/index";
import { useAtomValue, useAtom } from "jotai";
import IconSwap from "@components/common/icons/IconSwap";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { useWindowSize } from "@hooks/common/use-window-size";
import SelectBox from "@components/common/select-box/SelectBox";
import { convertToKMB } from "@utils/stake-position-utils";
import { isEndTickBy, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import { isMaxTick, isMinTick } from "@utils/pool-utils";
import { estimateTick } from "@components/common/my-position-card/MyPositionCard";
import { LoadingChart } from "../pool-pair-info-content/PoolPairInfoContent.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { numberToFormat } from "@utils/string-utils";
import PositionHistory from "./PositionHistory";
import { useRouter } from "next/router";
import IconLinkPage from "@components/common/icons/IconLinkPage";
import { useCopy } from "@hooks/common/use-copy";
import BigNumber from "bignumber.js";
import IconPolygon from "@components/common/icons/IconPolygon";
import Button from "@components/common/button/Button";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";

interface MyPositionCardProps {
  position: PoolPositionModel;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
  address: string;
  isHiddenAddPosition: boolean;
  connected: boolean;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  position,
  breakpoint,
  loading,
  address,
  isHiddenAddPosition,
  connected,
}) => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { tokenPrices } = useTokenData();
  const [isSwap, setIsSwap] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const GRAPH_WIDTH = Math.min(width - (width > 767 ? 224 : 80), 1216);
  const [, setSelectedPosition] = useAtom(IncreaseState.selectedPosition);
  const [copied, setCopy] = useCopy();

  const isClosed = position.closed;

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const bins = useMemo(() => {
    return position.pool.bins || [];
  }, [position.pool.bins]);

  const currentTick = useMemo(() => {
    return position.pool.currentTick || null;
  }, [position.pool.currentTick]);

  const price = useMemo(() => {
    return position.pool.price || 1;
  }, [position.pool.price]);

  const inRange = useMemo(() => {
    const { tickLower, tickUpper, pool } = position;
    const currentTick = pool.currentTick;
    if (currentTick < tickLower || currentTick > tickUpper) {
      return false;
    }
    return true;
  }, [position]);

  const tokenABalanceUSD = useMemo(() => {
    const tokenAUSD = Number(tokenPrices[tokenA.priceID]?.usd || "1");
    const tokenABalance =
      makeDisplayTokenAmount(tokenA, position.token0Balance) || 0;
    return tokenAUSD * tokenABalance;
  }, [position.token0Balance, tokenA, tokenPrices]);

  const tokenBBalanceUSD = useMemo(() => {
    const tokenBUSD = Number(tokenPrices[tokenB.priceID]?.usd || "1");
    const tokenBBalance =
      makeDisplayTokenAmount(tokenB, position.token1Balance) || 0;
    return tokenBUSD * tokenBBalance;
  }, [position.token1Balance, tokenB, tokenPrices]);

  const positionBalanceUSD = useMemo(() => {
    if (isClosed) {
      return "-";
    }
    if (BigNumber(position.positionUsdValue).isLessThan(0.01) && BigNumber(position.positionUsdValue).isGreaterThan(0)) {
      return "<$0.01";
    }
    return `$${numberToFormat(`${position.positionUsdValue}`, 2)}`;
  }, [position.positionUsdValue, isClosed]);

  const balances = useMemo((): {
    token: TokenModel;
    balance: number;
    balanceUSD: number;
    percent: string;
  }[] => {
    const sumOfBalances =
      Number(position.token0Balance) + Number(position.token1Balance);
    const token0Balance = Number(position.token0Balance);
    const token1Balance = Number(position.token1Balance);
    const depositRatio =
      sumOfBalances === 0
        ? 0.5
        : token0Balance /
          (token0Balance + token1Balance / position?.pool?.price);
    return [
      {
        token: tokenA,
        balance: Number(position.token0Balance),
        balanceUSD: tokenABalanceUSD,
        percent: `${Math.round(depositRatio * 100)}%`,
      },
      {
        token: tokenB,
        balance: Number(position.token1Balance),
        balanceUSD: tokenBBalanceUSD,
        percent: `${Math.round((1 - depositRatio) * 100)}%`,
      },
    ];
  }, [
    position.token0Balance,
    position.token1Balance,
    tokenA,
    tokenABalanceUSD,
    tokenB,
    tokenBBalanceUSD,
    position.pool,
  ]);

  const totalRewardInfo = useMemo(():
    | { [key in RewardType]: PositionRewardInfo[] }
    | null => {
    const rewards = position.rewards;
    if (rewards.length === 0) {
      return null;
    }

    const totalRewardInfo = position.rewards.reduce<{
      [key in RewardType]: PositionRewardInfo[];
    }>(
      (accum, current) => {
        if (!accum[current.rewardType]) {
          accum[current.rewardType] = [];
        }
        accum[current.rewardType].push({
          claimableAmount:
            makeDisplayTokenAmount(current.token, current.claimableAmount) || 0,
          token: current.token,
          balance:
            makeDisplayTokenAmount(current.token, current.totalAmount) || 0,
          balanceUSD:
            Number(current.totalAmount) *
            Number(tokenPrices[current.token.priceID]?.usd || 0),
          claimableUSD: Number(current.claimableUsdValue),
          accumulatedRewardOf1d:
            makeDisplayTokenAmount(
              current.token,
              current.accumulatedRewardOf1d || 0,
            ) || 0,
        });
        return accum;
      },
      {
        SWAP_FEE: [],
        STAKING: [],
        EXTERNAL: [],
      },
    );
    return totalRewardInfo;
  }, [position.rewards, tokenPrices]);

  const totalRewardUSD = useMemo(() => {
    if (isClosed) {
      return "-";
    }
    if (!totalRewardInfo) {
      return "$0";
    }

    const usdValue = Object.values(totalRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.claimableUSD;
      }, 0);
    if (BigNumber(usdValue).isLessThan(0.01) && BigNumber(usdValue).isGreaterThan(0)) {
      return "<$0.01";
    }
    return `$${numberToFormat(`${usdValue}`, 2)}`;
  }, [totalRewardInfo, isClosed]);

  const totalDailyEarning = useMemo(() => {
    if (isClosed) {
      return "-";
    }
    if (!totalRewardInfo) {
      return "$0";
    }

    const usdValue = Object.values(totalRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.accumulatedRewardOf1d;
      }, 0);
    if (BigNumber(usdValue).isLessThan(0.01) && BigNumber(usdValue).isGreaterThan(0)) {
      return "<$0.01";
    }
    return `$${numberToFormat(`${usdValue}`, 2)}`;
  }, [totalRewardInfo, isClosed]);

  const aprRewardInfo: { [key in RewardType]: PositionAPRInfo[] } | null =
    useMemo(() => {
      const aprRewardInfo = position.rewards.reduce<{
        [key in RewardType]: PositionAPRInfo[];
      }>(
        (accum, current) => {
          if (!accum[current.rewardType]) {
            accum[current.rewardType] = [];
          }
          accum[current.rewardType].push({
            token: current.token,
            rewardType: current.rewardType,
            tokenAmountOf7d: Number(current.accumulatedRewardOf7d),
            aprOf7d: Number(current.aprOf7d),
          });
          return accum;
        },
        {
          SWAP_FEE: [],
          STAKING: [],
          EXTERNAL: [],
        },
      );
      return aprRewardInfo;
    }, []);

  const stringPrice = useMemo(() => {
    const price = tickToPriceStr(position?.pool?.currentTick, 40);

    if (isSwap) {
      return <>1 {tokenB?.symbol} = <ExchangeRate value={convertToKMB(
        `${Number(Number(1 / position?.pool?.price).toFixed(6))}`,
        6,
      )}/> {tokenA?.symbol}</>;
    }
    return <>1 {tokenA?.symbol} = <ExchangeRate value={price}/> {tokenB?.symbol}</>;
  }, [
    isSwap,
    tokenB?.symbol,
    tokenA?.symbol,
    position?.pool?.price,
    position?.pool?.currentTick,
  ]);

  const tickRange = useMemo(() => {
    const ticks = bins.flatMap(bin => [bin.minTick, bin.maxTick]);
    const min = Math.min(...ticks);
    const max = Math.max(...ticks);
    return [min, max];
  }, [bins]);

  const minTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickLower === currentTick) {
      return 0;
    }
    if (position.tickLower < currentTick) {
      return (
        ((position.tickLower - min) / (currentTick - min)) * (GRAPH_WIDTH / 2)
      );
    }
    return (
      ((position.tickLower - currentTick) / (max - currentTick)) *
        (GRAPH_WIDTH / 2) +
      GRAPH_WIDTH / 2
    );
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickLower, tickRange]);

  const maxTickPosition = useMemo(() => {
    const [min, max] = tickRange;
    const currentTick = position.pool.currentTick;
    if (position.tickUpper === currentTick) {
      return 0;
    }
    if (position.tickUpper < currentTick) {
      return (
        ((position.tickUpper - min) / (currentTick - min)) * (GRAPH_WIDTH / 2)
      );
    }
    return (
      ((position.tickUpper - currentTick) / (max - currentTick)) *
        (GRAPH_WIDTH / 2) +
      GRAPH_WIDTH / 2
    );
  }, [GRAPH_WIDTH, position.pool.currentTick, position.tickUpper, tickRange]);

  const isFullRange = useMemo(() => {
    return (
      estimateTick(minTickPosition, GRAPH_WIDTH) === 0 &&
      estimateTick(maxTickPosition, GRAPH_WIDTH) === GRAPH_WIDTH
    );
  }, [minTickPosition, maxTickPosition]);

  const minPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickLower, position.pool.fee);
    const maxPrice = tickToPrice(position.tickUpper);
    const minPrice = tickToPriceStr(position.tickLower, 40, isEndTick);
    const tokenAPriceStr = isFullRange
      ? "0 "
      : !isSwap
      ? Number(minPrice)
      : convertToKMB(`${Number(1 / Number(maxPrice))}`, 6);
    return `${tokenAPriceStr}`;
  }, [
    position.tickUpper,
    position.tickLower,
    tokenB.path,
    tokenB.symbol,
    tokenPrices,
    tokenA.path,
    tokenA.symbol,
    isFullRange,
    isSwap,
  ]);

  const currentPrice = useMemo(() => {
    return !isSwap
      ? tickToPrice(position?.pool.currentTick)
      : 1 / tickToPrice(position?.pool.currentTick);
  }, [position?.pool.currentTick, isSwap]);

  const minTickRate = useMemo(() => {
    if (isMinTick(position.tickLower)) {
      return 0;
    }
    const minPrice = !isSwap
      ? tickToPrice(position.tickLower)
      : 1 / tickToPrice(position.tickLower);
    return ((currentPrice - minPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickLower, isSwap]);

  const maxTickRate = useMemo(() => {
    if (isMaxTick(position.tickUpper)) {
      return 999;
    }
    const maxPrice = !isSwap
      ? tickToPrice(position.tickUpper)
      : 1 / tickToPrice(position.tickUpper);
    return ((maxPrice - currentPrice) / currentPrice) * 100;
  }, [currentPrice, position.tickUpper, isSwap]);

  const maxPriceStr = useMemo(() => {
    const isEndTick = isEndTickBy(position.tickUpper, position.pool.fee);

    const minPrice = tickToPrice(position.tickLower);

    const maxPrice = tickToPriceStr(position.tickUpper, 40, isEndTick);

    const tokenBPriceStr = isFullRange
      ? "∞ "
      : !isSwap
      ? maxPrice
      : convertToKMB(`${Number(1 / Number(minPrice))}`, 6);
    return `${tokenBPriceStr}`;
  }, [
    position.tickLower,
    position.tickUpper,
    tokenB.path,
    tokenB.symbol,
    tokenPrices,
    tokenA.path,
    tokenA.symbol,
    maxTickRate,
    isFullRange,
    isSwap,
  ]);

  const minTickLabel = useMemo(() => {
    return (!isSwap ? -minTickRate : minTickRate) > 1000
      ? ">999%"
      : `${minTickRate < -1 ? "+" : ""}${
          Math.abs(minTickRate) > 0 && Math.abs(minTickRate) < 1
            ? "<1"
            : Math.round(minTickRate * -1)
        }%`;
  }, [minTickRate, isSwap]);

  const maxTickLabel = useMemo(() => {
    return maxTickRate === 999
      ? `>${maxTickRate}%`
      : maxTickRate >= 1000
      ? ">999%"
      : `${maxTickRate > 1 ? "+" : ""}${
          Math.abs(maxTickRate) < 1 ? "<1" : Math.round(maxTickRate)
        }%`;
  }, [maxTickRate]);

  const startClass = useMemo(() => {
    return (!isSwap ? minTickRate : -maxTickRate) > 0 ? "negative" : "positive";
  }, [minTickRate, isSwap, maxTickRate]);

  const endClass = useMemo(() => {
    return (!isSwap ? maxTickRate : -minTickRate) > 0 ? "positive" : "negative";
  }, [maxTickRate, isSwap, minTickRate]);
  const handleSelect = (text: string) => {
    if (text == "Decrease Liquidity") {
      setSelectedPosition(position);
      router.push("/earn/pool/" + router.query["pool-path"] + "/" + position?.id + "/decrease-liquidity");
    } else if (text === "Increase Liquidity") {
      setSelectedPosition(position);
      router.push("/earn/pool/" + router.query["pool-path"] + "/" + position?.id + "/increase-liquidity");
    } else {
      setSelectedPosition(position);
      router.push("/earn/pool/" + router.query["pool-path"] + "/" + position?.id + "/reposition");
    }
  };
  return (
    <>
      <PositionCardAnchor id={`${position.id}`} />
      <MyPositionCardWrapper
        type={inRange}
        isClosed={isClosed}
      >
        <div className="box-title">
          <div className="box-header">
            <div className="box-left">
              {breakpoint !== DEVICE_TYPE.MOBILE ? (
                <>
                  {loading && (
                    <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
                      <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                    </SkeletonEarnDetailWrapper>
                  )}
                  {!loading && (
                    <div className="coin-info">
                      <MissingLogo
                        symbol={tokenA.symbol}
                        url={tokenA.logoURI}
                        className="token-logo"
                        width={36}
                        mobileWidth={24}
                      />
                      <MissingLogo
                        symbol={tokenB.symbol}
                        url={tokenB.logoURI}
                        className="token-logo"
                        width={36}
                        mobileWidth={24}
                      />
                    </div>
                  )}
                  {!loading && (
                    <div className="link-page">
                      <span className="product-id">ID #{position.id}</span>
                      <div
                        onClick={() =>
                          setCopy(
                            `${
                              window.location.host + window.location.pathname
                            }?addr=${address}#${position.id}`,
                          )
                        }
                      >
                        <IconLinkPage className="icon-link"/>
                        {copied && (
                          <CopyTooltip>
                            <div className={`box ${themeKey}-shadow`}>
                              <span>URL Copied!</span>
                            </div>
                            <IconPolygon className="polygon-icon" />
                          </CopyTooltip>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mobile-container">
                    {loading && (
                      <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
                        <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
                      </SkeletonEarnDetailWrapper>
                    )}
                    {!loading && (
                      <div className="coin-info">
                        <MissingLogo
                          symbol={tokenA.symbol}
                          url={tokenA.logoURI}
                          className="token-logo"
                          width={36}
                          mobileWidth={24}
                        />
                        <MissingLogo
                          symbol={tokenB.symbol}
                          url={tokenB.logoURI}
                          className="token-logo"
                          width={36}
                          mobileWidth={24}
                        />
                      </div>
                    )}
                    {!loading && (
                      <span className="product-id">ID #{position.id}</span>
                    )}
                  </div>
                </>
              )}
              <Badge
                type={BADGE_TYPE.PRIMARY}
                leftIcon={<IconStaking />}
                text={"Staked"}
                className={!position.staked ? "visible-badge" : ""}
              />
            </div>
            <div className="flex-button">
              <Button text="Copy Positioning" className="copy-button" style={{}} onClick={() => router.push(router.asPath + `/add?tickLower=${position.tickLower}&tickUpper=${position.tickUpper}&type=Custom`)}/>
              {!position.staked && !isClosed && !isHiddenAddPosition && connected && (
                <SelectBox
                  current={"Manage"}
                  items={[
                    "Reposition",
                    "Increase Liquidity",
                    "Decrease Liquidity",
                  ]}
                  select={handleSelect}
                  render={period => <ManageItem>{period}</ManageItem>}
                  className={!inRange ? "out-range" : ""}
                />
              )}
            </div>
          </div>
        </div>
        <div className="info-wrap">
          <div className="info-box">
            <span className="symbol-text">Balance</span>
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
            )}
            {!isClosed && !loading ? (
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <BalanceTooltipContent balances={balances} />
                  </div>
                }
              >
                <span className="content-text">{positionBalanceUSD}</span>
              </Tooltip>
            ) : (
              !loading && (
                <span className="content-text disabled">
                  {positionBalanceUSD}
                </span>
              )
            )}
          </div>
          <div className="info-box">
            <span className="symbol-text">Daily Earnings</span>
            {!isClosed && aprRewardInfo && !loading ? (
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <MyPositionAprContent rewardInfo={aprRewardInfo} />
                  </div>
                }
              >
                <span className="content-text">{totalDailyEarning}</span>
              </Tooltip>
            ) : (
              !loading && (
                <span className="content-text disabled">
                  {totalDailyEarning}
                </span>
              )
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
          <div className="info-box">
            <span className="symbol-text">Claimable Rewards</span>
            {!isClosed && !loading && totalRewardInfo ? (
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <MyPositionRewardContent rewardInfo={totalRewardInfo} />
                  </div>
                }
              >
                <span className="content-text">{totalRewardUSD}</span>
              </Tooltip>
            ) : (
              !loading && (
                <span className="content-text disabled">{totalRewardUSD}</span>
              )
            )}
            {loading && (
              <SkeletonEarnDetailWrapper height={39} mobileHeight={25}>
                <span css={pulseSkeletonStyle({ w: "170px", h: 22 })} />
              </SkeletonEarnDetailWrapper>
            )}
          </div>
        </div>
        <div className="position-wrapper-chart">
          <div className="position-header">
            <div>Current Price</div>
            <div className="swap-price">
              {!loading && (
                <MissingLogo
                  symbol={!isSwap ? tokenA?.symbol : tokenB?.symbol}
                  url={!isSwap ? tokenA?.logoURI : tokenB?.logoURI}
                  width={20}
                  className="image-logo"
                />
              )}
              {!loading && stringPrice}
              {!loading && (
                <div
                  className="icon-wrapper"
                  onClick={() => setIsSwap(!isSwap)}
                >
                  <IconSwap />
                </div>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
              {loading && (
                <SkeletonEarnDetailWrapper height={18} mobileHeight={18}>
                  <span css={pulseSkeletonStyle({ h: 20, w: "80px" })} />
                </SkeletonEarnDetailWrapper>
              )}
            </div>
            {!loading && (
              <div className="range-badge">
                <RangeBadge
                  status={
                    position.closed
                      ? RANGE_STATUS_OPTION.NONE
                      : inRange
                      ? RANGE_STATUS_OPTION.IN
                      : RANGE_STATUS_OPTION.OUT
                  }
                />
              </div>
            )}
          </div>
          {!loading && (
            <PoolGraph
              tokenA={tokenA}
              tokenB={tokenB}
              bins={bins}
              currentTick={currentTick}
              width={GRAPH_WIDTH}
              height={150}
              mouseover
              themeKey={themeKey}
              position="top"
              offset={40}
              poolPrice={price}
              isPosition
              minTickPosition={minTickPosition}
              maxTickPosition={maxTickPosition}
              binsMyAmount={position?.bins || []}
              isSwap={isSwap}
            />
          )}
          {loading && (
            <LoadingChart>
              <LoadingSpinner />
            </LoadingChart>
          )}
          {!loading && (
            <div className="convert-price">
              <div>
                1 {(!isSwap ? tokenA : tokenB)?.symbol} = <ExchangeRate value={minPriceStr}/>{" "}
                {(!isSwap ? tokenB : tokenA)?.symbol}&nbsp;(
                <span className={startClass}>
                  {!isSwap ? minTickLabel : maxTickLabel}
                </span>
                )&nbsp;
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>
                      The price at which the position will be converted entirely
                      to&nbsp;
                      {(!isSwap ? tokenA : tokenB)?.symbol}.
                    </ToolTipContentWrapper>
                  }
                >
                  <IconInfo />
                </Tooltip>
                &nbsp;
              </div>
              <div>
                ~ <ExchangeRate value={maxPriceStr}/> {(!isSwap ? tokenB : tokenA)?.symbol}&nbsp;(
                <span className={endClass}>
                  {!isSwap ? maxTickLabel : minTickLabel}
                </span>
                )&nbsp;
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>
                      The price at which the position will be converted entirely
                      to&nbsp;
                      {(!isSwap ? tokenB : tokenA)?.symbol}.
                    </ToolTipContentWrapper>
                  }
                >
                  <IconInfo />
                </Tooltip>
              </div>
            </div>
          )}
        </div>
        <PositionHistory isClosed={isClosed} tokenA={tokenA} tokenB={tokenB}/>
      </MyPositionCardWrapper>
    </>
  );
};

export default MyPositionCard;
