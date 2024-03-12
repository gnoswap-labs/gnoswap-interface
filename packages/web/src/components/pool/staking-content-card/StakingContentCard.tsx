import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconCheck from "@components/common/icons/IconCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconLine from "@components/common/icons/IconLine";
import IconLineLong from "@components/common/icons/IconLineLong";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DEVICE_TYPE } from "@styles/media";
import React, { useCallback, useMemo } from "react";
import {
  PriceTooltipContentWrapper,
  StakingContentCardWrapper,
  ToolTipContentWrapper,
  TooltipDivider,
} from "./StakingContentCard.styles";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { STAKING_PERIOD_INFO, StakingPeriodType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { numberToUSD, toUnitFormat } from "@utils/number-utils";
import { calculateRemainTime, timeToDateStr } from "@common/utils/date-util";
import { useTokenData } from "@hooks/token/use-token-data";
import { PositionModel } from "@models/position/position-model";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { formatUsdNumber } from "@utils/stake-position-utils";

interface StakingContentCardProps {
  period: StakingPeriodType;
  checkPoints: StakingPeriodType[];
  positions: PoolPositionModel[];
  rewardTokens: TokenModel[];
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}
const DAY_TIME = 24 * 60 * 60 * 1000;

const PriceTooltipContent = ({ positions, period }: { positions: PoolPositionModel[], period: number }) => {
  const getRemainTime = useCallback((position: PositionModel) => {
    const stakedTime = Number(position.stakedAt) * 1000;
    const passedTime = (new Date().getTime() - stakedTime);
    const remainTime = period * DAY_TIME - passedTime;
    const { day, hours, minutes, seconds } = calculateRemainTime(remainTime);
    return `${day}d ${hours}h ${minutes}m ${seconds}s`;
  }, [period]);

  return (
    <PriceTooltipContentWrapper>
      {positions.map((position, index) => (
        <React.Fragment key={index}>
          <div className="list list-logo">
            <DoubleLogo
              size={18}
              left={position.pool.tokenA.logoURI}
              right={position.pool.tokenB.logoURI}
            />
            <span className="title">ID #{position.lpTokenId}</span>
          </div>
          <div className="list">
            <span className="label">Total Value</span>
            <span className="content">{numberToUSD(Number(position.stakedUsdValue))}</span>
          </div>
          <div className="list">
            <span className="label">Staked Date</span>
            <span className="content">{timeToDateStr(position.stakedAt, 1000)}</span>
          </div>
          <div className="list">
            <span className="label">Next Tier</span>
            <span className="content">in {getRemainTime(position)}</span>
          </div>
          {index < positions.length - 1 && (
            <TooltipDivider />
          )}
        </React.Fragment>
      ))}
    </PriceTooltipContentWrapper>
  );
};

const StakingContentCard: React.FC<StakingContentCardProps> = ({
  period,
  checkPoints,
  positions,
  breakpoint,
  loading,
}) => {
  const { tokenPrices } = useTokenData();
  const hasPosition = positions.length > 0;

  const checkedStep = useMemo(() => {
    return checkPoints.includes(period);
  }, [checkPoints, period]);

  const periodInfo = useMemo(() => {
    return STAKING_PERIOD_INFO[period];
  }, [period]);

  const totalUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const usdValue = positions.reduce((accum, current) => {
      return Number(current.positionUsdValue) + accum;
    }, 0);
    return `${formatUsdNumber(usdValue.toString())}`;
  }, [positions]);

  const positionRewards = useMemo(() => {
    return positions.flatMap(position => position.rewards);
  }, [positions]);
  const totalStakedRewardUSD = useMemo(() => {
    const tempTotalStakedRewardUSD = positionRewards.filter(_ => ["EXTERNAL", "STAKING"].includes(_.rewardType)).reduce((accum, current) => {
      if (current.rewardType !== "STAKING") {
        return accum;
      }
      const tokenUSD = tokenPrices[current.token.priceId]?.usd || 0;
      return (Number(current.totalAmount) * Number(tokenUSD)) + accum;
    }, 0);
    return toUnitFormat(tempTotalStakedRewardUSD, true, true);
  }, [positionRewards, tokenPrices]);

  const aprStr = useMemo(() => {
    return "-";
  }, []);

  return (
    <StakingContentCardWrapper nonTotal={!hasPosition}>
      <div className="left">
        <div className="mobile-wrap">
          <div className={`check-wrap ${!checkedStep ? "check-wrap-not-active" : ""}`}>
            {checkedStep && <IconCheck />}

            {(breakpoint === DEVICE_TYPE.MOBILE || breakpoint === DEVICE_TYPE.TABLET_M) ? (
              <div className="check-line-long">
                {checkedStep ? <IconLineLong /> : <div className="border-not-active" />}
              </div>
            ) : (
              <div className="check-line">
                {checkedStep ? <IconLine /> : <div className="border-not-active" />}
              </div>
            )}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{periodInfo.title}</span>
            <div className="icon-wrap">
              <span className="content-text">{periodInfo.description}</span>
              <Tooltip
                placement="top"
                FloatingContent={<ToolTipContentWrapper>{periodInfo.tooltipContent}</ToolTipContentWrapper>}
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          {loading && <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"400px", tabletWidth: 300, mobileWidth: 100 })}
            />
          </SkeletonEarnDetailWrapper>}
          {!loading && <div className="price">
            <span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <PriceTooltipContent positions={positions} period={periodInfo.period} />
                  </div>
                }
              >
                <span>{totalUSD}</span>
                {positions.length > 0 && checkedStep && "+ "}
                {positions.length > 0 && checkedStep && <span className="price-gd-text">{totalStakedRewardUSD}</span>}
                {positions.length > 0 && <div className="badge">{positions.length} LP</div>}
              </Tooltip>
            </span>
          </div>}
          {loading && <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"200px", tabletWidth: 140, mobileWidth: 50 })}
            />
          </SkeletonEarnDetailWrapper>}
          {!loading && <div className="apr">
            <span className="apr-text">{aprStr}</span>
          </div>}
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

interface SummuryAprProps {
  period: StakingPeriodType;
  checkPoints: StakingPeriodType[];
  positions: PoolPositionModel[];
  rewardTokens: TokenModel[];
  loading: boolean;
  breakpoint: DEVICE_TYPE;
}

export const SummuryApr: React.FC<SummuryAprProps> = ({
  period,
  checkPoints,
  positions,
  loading,
}) => {
  const { tokenPrices } = useTokenData();
  const hasPosition = positions.length > 0;

  const checkedStep = useMemo(() => {
    return checkPoints.includes(period);
  }, [checkPoints, period]);

  const periodInfo = useMemo(() => {
    return STAKING_PERIOD_INFO[period];
  }, [period]);

  const positionRewards = useMemo(() => {
    return positions.flatMap(position => position.rewards);
  }, [positions]);

  const totalUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const usdValue = positions.reduce((accum, current) => {
      return Number(current.positionUsdValue) + accum;
    }, 0);
    return `${formatUsdNumber(usdValue.toString())}`;
  }, [positions]);

  const totalStakedRewardUSD = useMemo(() => {
    const tempTotalStakedRewardUSD = positionRewards.reduce((accum, current) => {
      if (current.rewardType !== "STAKING") {
        return accum;
      }
      const tokenUSD = tokenPrices[current.token.priceId]?.usd || 0;
      return (Number(current.totalAmount) * Number(tokenUSD)) + accum;
    }, 0);
    return toUnitFormat(tempTotalStakedRewardUSD, true, true);

  }, [positionRewards, tokenPrices]);

  const aprStr = useMemo(() => {
    return "-";
  }, []);

  return (
    <StakingContentCardWrapper nonTotal={!hasPosition}>
      <div className="left">
        <div className="mobile-wrap">
          <div className={`check-wrap ${!checkedStep ? "check-wrap-not-active" : ""}`}>
            {checkedStep && <IconCheck />}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">{periodInfo.title}</span>
            <div className="icon-wrap">
              <span className="content-gd-text">{periodInfo.description}</span>
              <Tooltip
                placement="top"
                FloatingContent={<ToolTipContentWrapper>{periodInfo.tooltipContent}</ToolTipContentWrapper>}
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          {loading && <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"400px", tabletWidth:  300, mobileWidth: 100 })}
            />
          </SkeletonEarnDetailWrapper>}
          {!loading && <div className="price">
            <span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <div>
                    <PriceTooltipContent positions={positions} period={periodInfo.period} />
                  </div>
                }
              >
                <span>{totalUSD}</span>
                {checkedStep && positions.length > 0 && "+ "}
                {positions.length > 0 && checkedStep && <span className="price-gd-text">{totalStakedRewardUSD}</span>}
                {positions.length > 0 && <div className="badge">{positions.length} LP</div>}
              </Tooltip>
            </span>
          </div>}
          {loading && <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
            <span
              css={pulseSkeletonStyle({ h: 22, w:"200px", tabletWidth:  140, mobileWidth: 50 })}
            />
          </SkeletonEarnDetailWrapper>}
          {!loading && <div className="apr">
            <span className="apr-gd-text">{aprStr}</span>
          </div>}
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

export default StakingContentCard;
