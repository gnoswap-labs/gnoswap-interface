import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  MyLiquidityContentWrapper,
} from "./MyLiquidityContent.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useTokenData } from "@hooks/token/use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { toLowerUnitFormat } from "@utils/number-utils";
import { BalanceTooltipContent } from "../my-position-card/MyPositionCardBalanceContent";
import { RewardType } from "@constants/option.constant";
import { MyPositionRewardContent } from "../my-position-card/MyPositionCardRewardContent";
import { PositionClaimInfo } from "@models/position/info/position-claim-info";
import { MyPositionClaimContent } from "../my-position-card/MyPositionCardClaimContent";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import { PositionRewardInfo } from "@models/position/info/position-reward-info";
import { TokenPriceModel } from "@models/token/token-price-model";

interface MyLiquidityContentProps {
  connected: boolean;
  positions: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  claimAll: () => void;
}

const MyLiquidityContent: React.FC<MyLiquidityContentProps> = ({
  connected,
  positions,
  breakpoint,
  claimAll,
}) => {
  const { tokenPrices } = useTokenData();

  const activated = connected && positions.length > 0;

  const allBalances = useMemo(() => {
    if (!activated) {
      return null;
    }
    return positions.reduce<{ [key in string]: PositionBalanceInfo }>((balanceMap, position) => {
      const tokenABalance = makeDisplayTokenAmount(position.pool.tokenA, position.token0Balance) || 0;
      const tokenBBalance = makeDisplayTokenAmount(position.pool.tokenB, position.token1Balance) || 0;
      const tokenABalanceInfo = {
        token: position.pool.tokenA,
        balanceUSD: tokenABalance * Number(tokenPrices[position.pool.tokenA.priceId]?.usd || 1),
      };
      const tokenBBalanceInfo = {
        token: position.pool.tokenB,
        balanceUSD: tokenBBalance * Number(tokenPrices[position.pool.tokenB.priceId]?.usd || 1),
      };
      if (!balanceMap[tokenABalanceInfo.token.priceId]) {
        balanceMap[tokenABalanceInfo.token.priceId] = {
          ...tokenABalanceInfo,
          balance: 0,
          balanceUSD: 0,
        };
      }
      if (!balanceMap[tokenBBalanceInfo.token.priceId]) {
        balanceMap[tokenBBalanceInfo.token.priceId] = {
          ...tokenBBalanceInfo,
          balance: 0,
          balanceUSD: 0,
        };
      }
      const changedTokenABalanceUSD = balanceMap[tokenABalanceInfo.token.priceId].balanceUSD + tokenABalanceInfo.balanceUSD;
      const changedTokenABalance = balanceMap[tokenABalanceInfo.token.priceId].balance + Number(position.token0Balance);
      balanceMap[tokenABalanceInfo.token.priceId] = {
        ...tokenABalanceInfo,
        balance: changedTokenABalance,
        balanceUSD: changedTokenABalanceUSD,
      };
      const changedTokenBBalanceUSD = balanceMap[tokenBBalanceInfo.token.priceId].balanceUSD + tokenBBalanceInfo.balanceUSD;
      const changedTokenBBalance = balanceMap[tokenBBalanceInfo.token.priceId].balance + Number(position.token1Balance);
      balanceMap[tokenBBalanceInfo.token.priceId] = {
        ...tokenBBalanceInfo,
        balance: changedTokenBBalance,
        balanceUSD: changedTokenBBalanceUSD,
      };
      return balanceMap;
    }, {});
  }, [activated, positions, tokenPrices]);

  const totalBalance = useMemo(() => {
    if (!allBalances) {
      return "$0";
    }
    const balance = Object.values(allBalances).reduce((acc, current) => acc += current.balanceUSD, 0);
    return toLowerUnitFormat(balance, true);
  }, [allBalances]);

  const dailyEarningRewardInfo = useMemo((): { [key in RewardType]: PositionRewardInfo[] } | null => {
    if (!activated) {
      return null;
    }
    // TODO: Not implements API
    return {
      SWAP_FEE: makeUniqueClaimableRewards(positions, tokenPrices),
      STAKING: [],
      EXTERNAL: []
    };
  }, [activated, positions, tokenPrices]);

  const dailyEarning = useMemo(() => {
    if (!dailyEarningRewardInfo) {
      return "$0";
    }
    const usdValue = Object.values(dailyEarningRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.balanceUSD;
      }, 0);
    return toLowerUnitFormat(usdValue, true);
  }, [dailyEarningRewardInfo]);

  const claimableRewardInfo = useMemo((): { [key in RewardType]: PositionClaimInfo[] } | null => {
    if (!activated) {
      return null;
    }
    return {
      SWAP_FEE: makeUniqueClaimableRewards(positions, tokenPrices),
      STAKING: [],
      EXTERNAL: [],
    };
  }, [activated, positions, tokenPrices]);

  const unclaimedRewardInfo = useMemo((): PositionClaimInfo[] | null => {
    if (!activated) {
      return [];
    }
    return makeUniqueClaimableRewards(positions, tokenPrices);
  }, [activated, positions, tokenPrices]);

  const claimableUSD = useMemo(() => {
    const claimableUsdValue = claimableRewardInfo ? Object.values(claimableRewardInfo)
      .flatMap(item => item)
      .reduce((accum, current) => {
        return accum + current.balanceUSD;
      }, 0) : 0;
    return toLowerUnitFormat(claimableUsdValue, true);
  }, [claimableRewardInfo]);

  const claimable = useMemo(() => {
    if (!activated || unclaimedRewardInfo === null) {
      return false;
    }
    return unclaimedRewardInfo.reduce((accum, current) => {
      return accum + current.balance;
    }, 0) > 0;
  }, [activated, unclaimedRewardInfo]);

  return (
    <MyLiquidityContentWrapper>
      <section>
        <h4>Total Balance</h4>
        {allBalances ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <BalanceTooltipContent balances={Object.values(allBalances)} />
              </div>
            }>
            <span className="content-value">{totalBalance}</span>
          </Tooltip>
        ) : (
          <span className="content-value disabled">{totalBalance}</span>
        )}
      </section>
      <section>
        <h4>Daily Earnings</h4>
        {dailyEarningRewardInfo ? (
          <Tooltip
            placement="top"
            FloatingContent={
              <div>
                <MyPositionRewardContent rewardInfo={dailyEarningRewardInfo} />
              </div>
            }
          >
            <span className="content-value">{dailyEarning}</span>
          </Tooltip>
        ) : (
          <span className="content-value disabled">{dailyEarning}</span>
        )}
      </section>
      <section>
        {breakpoint === DEVICE_TYPE.MOBILE ? (
          <div className="mobile-wrap">
            <div className="column-wrap">
              <h4>Claimable Rewards</h4>
              <div className="claim-wrap">
                {claimableRewardInfo || unclaimedRewardInfo ? (
                  <Tooltip
                    placement="top"
                    FloatingContent={<MyPositionClaimContent rewardInfo={claimableRewardInfo} unclaimedRewardInfo={unclaimedRewardInfo} />}
                  >
                    <span className="content-value has-tooltip">
                      {claimableUSD}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="content-value has-tooltip disabled">
                    {claimableUSD}
                  </span>
                )}
              </div>
            </div>
            <Button
              disabled={!claimable}
              text="Claim All"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                width: 86,
                height: 36,
                padding: "10px 16px",
                fontType: "p1",
              }}
              onClick={claimAll}
            />
          </div>
        ) : (
          <>
            <h4>Claimable Rewards</h4>
            <div className="claim-wrap">
              {claimableRewardInfo || unclaimedRewardInfo ? (
                <Tooltip
                  placement="top"
                  FloatingContent={<MyPositionClaimContent rewardInfo={claimableRewardInfo} unclaimedRewardInfo={unclaimedRewardInfo} />}
                >
                  <span className="content-value has-tooltip">
                    {claimableUSD}
                  </span>
                </Tooltip>
              ) : (
                <span className="content-value has-tooltip disabled">
                  {claimableUSD}
                </span>
              )}
              <Button
                disabled={!claimable}
                text="Claim All"
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  height: 36,
                  padding: "0px 16px",
                  fontType: "p1",
                }}
                onClick={claimAll}
              />
            </div>
          </>
        )}
      </section>
    </MyLiquidityContentWrapper>
  );
};

export default MyLiquidityContent;

function makeUniqueClaimableRewards(positions: PoolPositionModel[], tokenPrices: { [key in string]: TokenPriceModel | null }): PositionClaimInfo[] {
  const infoMap: { [key in string]: PositionClaimInfo } = {};
  positions.flatMap(position => {
    const tokenA = position.pool.tokenA;
    const tokenB = position.pool.tokenB;
    const tokenAUnclaimedBalance = makeDisplayTokenAmount(tokenA, position.unclaimedFee0Amount + position.tokensOwed0Amount) || 0;
    const tokenBUnclaimedBalance = makeDisplayTokenAmount(tokenB, position.unclaimedFee1Amount + position.tokensOwed1Amount) || 0;
    return [{
      balance: tokenAUnclaimedBalance,
      balanceUSD: tokenAUnclaimedBalance * Number(tokenPrices[tokenA.priceId]?.usd || 0),
      token: tokenA
    }, {
      balance: tokenBUnclaimedBalance,
      balanceUSD: tokenBUnclaimedBalance * Number(tokenPrices[tokenB.priceId]?.usd || 0),
      token: tokenB
    }];
  }).forEach(claimInfo => {
    const currentInfo = infoMap[claimInfo.token.priceId];
    if (currentInfo) {
      infoMap[claimInfo.token.priceId] = {
        ...claimInfo,
        balance: currentInfo.balance + claimInfo.balance,
        balanceUSD: currentInfo.balanceUSD + claimInfo.balanceUSD,
      };
    } else {
      infoMap[claimInfo.token.priceId] = claimInfo;
    }
  });
  return Object.values(infoMap);
}