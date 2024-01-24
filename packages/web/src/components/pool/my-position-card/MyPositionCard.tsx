import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import IconStar from "@components/common/icons/IconStar";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION, RewardType } from "@constants/option.constant";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo, useState } from "react";
import {
  ManageItem,
  MyPositionCardWrapper,
  ToolTipContentWrapper,
} from "./MyPositionCard.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { TokenModel } from "@models/token/token-model";
import { toUnitFormat } from "@utils/number-utils";
import { BalanceTooltipContent } from "./MyPositionCardBalanceContent";
import { MyPositionRewardContent } from "./MyPositionCardRewardContent";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { MyPositionAprContent } from "./MyPositionCardAprContent";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import PoolGraph from "@components/common/pool-graph/PoolGraph";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import IconSwap from "@components/common/icons/IconSwap";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { useWindowSize } from "@hooks/common/use-window-size";
import { numberToFormat } from "@utils/string-utils";
import SelectBox from "@components/common/select-box/SelectBox";

interface MyPositionCardProps {
  position: PoolPositionModel;
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  position,
  breakpoint,
  loading,
}) => {
  const { width } = useWindowSize();
  const { tokenPrices } = useTokenData();
  const [isSwap, setIsSwap] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);

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
    const tokenAUSD = Number(tokenPrices[tokenA.priceId]?.usd || "1");
    const tokenABalance =
      makeDisplayTokenAmount(tokenA, position.token0Balance) || 0;
    return tokenAUSD * tokenABalance;
  }, [position.token0Balance, tokenA, tokenPrices]);

  const tokenBBalanceUSD = useMemo(() => {
    const tokenBUSD = Number(tokenPrices[tokenB.priceId]?.usd || "1");
    const tokenBBalance =
      makeDisplayTokenAmount(tokenB, position.token1Balance) || 0;
    return tokenBUSD * tokenBBalance;
  }, [position.token1Balance, tokenB, tokenPrices]);

  const positionBalanceUSD = useMemo(() => {
    return toUnitFormat(position.positionUsdValue, true);
  }, [position.positionUsdValue]);

  const balances = useMemo((): {
    token: TokenModel;
    balance: number;
    balanceUSD: number;
  }[] => {
    return [
      {
        token: tokenA,
        balance: Number(position.token0Balance),
        balanceUSD: tokenABalanceUSD,
      },
      {
        token: tokenB,
        balance: Number(position.token1Balance),
        balanceUSD: tokenBBalanceUSD,
      },
    ];
  }, [
    position.token0Balance,
    position.token1Balance,
    tokenA,
    tokenABalanceUSD,
    tokenB,
    tokenBBalanceUSD,
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
          token: current.token,
          balance: Number(current.totalAmount),
          balanceUSD:
            Number(current.totalAmount) *
            Number(tokenPrices[current.token.priceId]?.usd || 0),
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
    if (!totalRewardInfo) {
      return "$0";
    }
    const usdValue = Object.values(totalRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.balanceUSD;
      }, 0);
    return toUnitFormat(usdValue, true);
  }, [totalRewardInfo]);

  const aprRewardInfo: { [key in RewardType]: PositionAPRInfo[] } | null =
    useMemo(() => {
      return null;
      /** TODO: Not implements API
       * const aprRewardInfo = position.rewards.reduce<{ [key in RewardType]: PositionAPRInfo[] }>((accum, current) => {
       *   if (!accum[current.rewardType]) {
       *     accum[current.rewardType] = [];
       *   }
       *   accum[current.rewardType].push({
       *     token: current.token,
       *     tokenAmountOf7d: Number(current.accumulatedRewardOf7d),
       *     aprOf7d: Number(current.aprOf7d),
       *   });
       *   return accum;
       * }, {
       *   SWAP_FEE: [],
       *   STAKING: [],
       *   EXTERNAL: []
       * });
       * return aprRewardInfo;
       */
    }, []);

  const stringPrice = useMemo(() => {
    if (isSwap) {
      return `1 ${tokenB?.symbol} = ${numberToFormat(1 / position?.pool?.price, 6)} ${tokenA?.symbol}`;
    }
    return `1 ${tokenA?.symbol} = ${numberToFormat(position?.pool?.price, 6)} ${tokenB?.symbol}`;
  }, [isSwap, tokenB?.symbol, tokenA?.symbol, position?.pool?.price]);

  return (
    <MyPositionCardWrapper type={inRange}>
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
                  <span className="product-id">ID #{position.id}</span>
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
          <SelectBox
            current={"Manage"}
            items={["Manage", "Reposition", "Increase Liquidity", "Decrease Liquidity"]}
            select={() => {}}
            render={(period) => <ManageItem>{period}</ManageItem>}
            className={!inRange ? "out-range" : ""}
          />
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
          {!loading && (
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
          )}
        </div>
        <div className="info-box">
          <span className="symbol-text">Daily Earnings</span>
          {aprRewardInfo && !loading ? (
            <Tooltip
              placement="top"
              FloatingContent={
                <div>
                  <MyPositionAprContent rewardInfo={aprRewardInfo} />
                </div>
              }
            >
              <span className="content-text">
                {Number(position.apr) >= 100 && <IconStar />}
                {position.apr !== "" ? `${position.apr}%` : "-"}
              </span>
            </Tooltip>
          ) : (
            !loading && (
              <span className="content-text">
                {Number(position.apr) >= 100 && <IconStar />}
                {position.apr !== "" ? `${position.apr}%` : "-"}
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
          {!loading && totalRewardInfo ? (
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
            <MissingLogo
              symbol={!isSwap ? tokenA?.symbol : tokenB?.symbol}
              url={!isSwap ? tokenA?.logoURI : tokenB?.logoURI}
              width={20}
              className="image-logo"
            />
            {stringPrice}
            <div onClick={() => setIsSwap(!isSwap)}>
              <IconSwap />
            </div>
          </div>
          <div className="range-badge">
            <RangeBadge
              status={
                inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
        </div>
        <PoolGraph
          tokenA={tokenA}
          tokenB={tokenB}
          bins={bins}
          currentTick={currentTick}
          width={Math.min(width - (width > 767 ? 224 : 80), 1216)}
          height={150}
          mouseover
          themeKey={themeKey}
          position="top"
          offset={40}
          poolPrice={price}
          isPosition
        />
        <div className="convert-price">
          <div>
            1 {tokenA?.symbol} = 0.956937(<span className="negative">-20%</span>)&nbsp;
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The price at which the position will be converted entirely to&nbsp;
                  {tokenA?.symbol}.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
            &nbsp;
          </div>
          <div>
            ~ 1.097929(<span className="positive">+14%</span>)&nbsp;
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The price at which the position will be converted entirely to&nbsp;
                  {tokenB?.symbol}.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
            &nbsp;{tokenB?.symbol}
          </div>
        </div>
      </div>
    </MyPositionCardWrapper>
  );
};

export default MyPositionCard;
