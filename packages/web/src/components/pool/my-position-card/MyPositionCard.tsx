import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconStaking from "@components/common/icons/IconStaking";
import IconStar from "@components/common/icons/IconStar";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION, RewardType } from "@constants/option.constant";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";
import { tickToPriceStr } from "@utils/swap-utils";
import React, { useMemo } from "react";
import { MyPositionCardWrapper } from "./MyPositionCard.styles";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { TokenModel } from "@models/token/token-model";
import { toUnitFormat } from "@utils/number-utils";
import { BalanceTooltipContent } from "./MyPositionCardBalanceContent";
import { MyPositionRewardContent } from "./MyPositionCardRewardContent";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { MyPositionAprContent } from "./MyPositionCardAprContent";
import { PositionAPRInfo } from "@models/position/info/position-apr-info";

interface MyPositionCardProps {
  position: PoolPositionModel;
  breakpoint: DEVICE_TYPE;
}

const MyPositionCard: React.FC<MyPositionCardProps> = ({
  position,
  breakpoint,
}) => {
  const { tokenPrices } = useTokenData();

  const tokenA = useMemo(() => {
    return position.pool.tokenA;
  }, [position.pool.tokenA]);

  const tokenB = useMemo(() => {
    return position.pool.tokenB;
  }, [position.pool.tokenB]);

  const inRange = useMemo(() => {
    const { tickLower, tickUpper, pool } = position;
    const currentTick = pool.currentTick;
    if (currentTick < tickLower || currentTick > tickUpper) {
      return false;
    }
    return true;
  }, [position]);

  const minTickLabel = useMemo(() => {
    const minPrice = tickToPriceStr(position.tickLower, 2);
    return `${minPrice} ${tokenB.symbol} per ${tokenA.symbol}`;
  }, [position.tickLower, tokenA.symbol, tokenB.symbol]);

  const maxTickLabel = useMemo(() => {
    const maxPrice = tickToPriceStr(position.tickUpper, 2);
    return `${maxPrice} ${tokenB.symbol} per ${tokenA.symbol}`;
  }, [position.tickUpper, tokenA.symbol, tokenB.symbol]);

  const tokenABalanceUSD = useMemo(() => {
    const tokenAUSD = Number(tokenPrices[tokenA.priceId]?.usd || "1");
    const tokenABalance = makeDisplayTokenAmount(tokenA, position.token0Balance) || 0;
    return tokenAUSD * tokenABalance;
  }, [position.token0Balance, tokenA, tokenPrices]);

  const tokenBBalanceUSD = useMemo(() => {
    const tokenBUSD = Number(tokenPrices[tokenB.priceId]?.usd || "1");
    const tokenBBalance = makeDisplayTokenAmount(tokenB, position.token1Balance) || 0;
    return tokenBUSD * tokenBBalance;
  }, [position.token1Balance, tokenB, tokenPrices]);

  const positionBalanceUSD = useMemo(() => {
    return toUnitFormat(tokenABalanceUSD + tokenBBalanceUSD, true);
  }, [tokenABalanceUSD, tokenBBalanceUSD]);

  const balances = useMemo((): { token: TokenModel; balance: number; balanceUSD: number }[] => {
    return [{
      token: tokenA,
      balance: Number(position.token0Balance),
      balanceUSD: tokenABalanceUSD,
    }, {
      token: tokenB,
      balance: Number(position.token1Balance),
      balanceUSD: tokenBBalanceUSD,
    }];
  }, [position.token0Balance, position.token1Balance, tokenA, tokenABalanceUSD, tokenB, tokenBBalanceUSD]);

  const totalRewardInfo = useMemo((): { [key in RewardType]: PositionRewardInfo[] } | null => {
    const rewards = position.rewards;
    if (rewards.length === 0) {
      // TODO: Not implements API
      const tokenA = position.pool.tokenA;
      const tokenB = position.pool.tokenB;
      const tokenAUnclaimedBalance = makeDisplayTokenAmount(tokenA, position.unclaimedFee0Amount + position.tokensOwed0Amount) || 0;
      const tokenBUnclaimedBalance = makeDisplayTokenAmount(tokenB, position.unclaimedFee1Amount + position.tokensOwed1Amount) || 0;
      const swapFees = [{
        balance: tokenAUnclaimedBalance,
        balanceUSD: tokenAUnclaimedBalance * Number(tokenPrices[tokenA.priceId]?.usd || 0),
        token: tokenA
      }, {
        balance: tokenBUnclaimedBalance,
        balanceUSD: tokenBUnclaimedBalance * Number(tokenPrices[tokenB.priceId]?.usd || 0),
        token: tokenB
      }];
      return {
        SWAP_FEE: swapFees,
        STAKING: [],
        EXTERNAL: []
      };
    }

    const totalRewardInfo = position.rewards.reduce<{ [key in RewardType]: PositionRewardInfo[] }>((accum, current) => {
      if (!accum[current.rewardType]) {
        accum[current.rewardType] = [];
      }
      accum[current.rewardType].push({
        token: current.token,
        balance: Number(current.totalAmount),
        balanceUSD: Number(current.totalAmount) * Number(tokenPrices[current.token.priceId].usd || 1)
      });
      return accum;
    }, {
      SWAP_FEE: [],
      STAKING: [],
      EXTERNAL: []
    });
    return totalRewardInfo;
  }, [position.pool.tokenA, position.pool.tokenB, position.rewards, position.tokensOwed0Amount, position.tokensOwed1Amount, position.unclaimedFee0Amount, position.unclaimedFee1Amount, tokenPrices]);

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

  const aprRewardInfo: { [key in RewardType]: PositionAPRInfo[] } = useMemo(() => {
    const tokenA = position.pool.tokenA;
    const tokenB = position.pool.tokenB;
    const swapFees = [{
      token: tokenA,
      tokenAmountOf7d: 0,
      aprOf7d: 0,
    }, {
      token: tokenB,
      tokenAmountOf7d: 0,
      aprOf7d: 0,
    }];
    return {
      SWAP_FEE: swapFees,
      STAKING: [],
      EXTERNAL: []
    };
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
  }, [position.rewards]);


  return (
    <MyPositionCardWrapper type={inRange}>
      <div className="box-title">
        <div className="box-header">
          <div className="box-left">
            {breakpoint !== DEVICE_TYPE.MOBILE ? (
              <>
                <div className="coin-info">
                  <img
                    src={tokenA.logoURI}
                    className="token-logo"
                    alt="token logo"
                  />
                  <img
                    src={tokenB.logoURI}
                    className="token-logo"
                    alt="token logo"
                  />
                </div>
                <span className="product-id">ID #{position.id}</span>
              </>
            ) : (
              <>
                <div className="mobile-container">
                  <div className="coin-info">
                    <img
                      src={tokenA.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <img
                      src={tokenB.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                  </div>
                  <span className="product-id">ID {position.id}</span>
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
          <div className="mobile-wrap">
            <RangeBadge
              status={
                inRange
                  ? RANGE_STATUS_OPTION.IN
                  : RANGE_STATUS_OPTION.OUT
              }
            />
          </div>
        </div>
        <div className="min-max">
          {breakpoint !== DEVICE_TYPE.MOBILE ? (
            <>
              <span className="symbol-text">Min</span>
              <span className="token-text">
                {minTickLabel}
              </span>
              <span className="symbol-text">{"<->"}</span>
              <span className="symbol-text">Max</span>
              <span className="token-text">
                {maxTickLabel}
              </span>
            </>
          ) : (
            <>
              <div className="min-mobile">
                <span className="symbol-text">Min</span>
                <span className="token-text">
                  {minTickLabel} {"<->"}
                </span>
              </div>
              <div className="max-mobile">
                <span className="symbol-text">Max</span>
                <span className="token-text">
                  {maxTickLabel}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="info-wrap">
        <div className="info-box">
          <span className="symbol-text">Balance</span>
          <Tooltip placement="top" FloatingContent={<div><BalanceTooltipContent balances={balances} /></div>}>
            <span className="content-text">{positionBalanceUSD}</span>
          </Tooltip>
        </div>
        <div className="info-box">
          <span className="symbol-text">Total Rewards</span>
          {totalRewardInfo ? (
            <Tooltip placement="top" FloatingContent={
              <div>
                <MyPositionRewardContent rewardInfo={totalRewardInfo} />
              </div>}
            >
              <span className="content-text">
                {totalRewardUSD}
              </span>
            </Tooltip>
          ) : (
            <span className="content-text disabled">
              {totalRewardUSD}
            </span>
          )}
        </div>
        <div className="info-box">
          <span className="symbol-text">Estimated APR</span>
          <Tooltip placement="top" FloatingContent={
            <div><MyPositionAprContent rewardInfo={aprRewardInfo} /></div>
          }>
            <span className="content-text">
              {Number(position.apr) >= 100 && <IconStar />}{position.apr}%
            </span>
          </Tooltip>
        </div>
      </div>
    </MyPositionCardWrapper>
  );
};

export default MyPositionCard;
