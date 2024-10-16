import BigNumber from "bignumber.js";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { calculateRemainTime, timeToDateStr } from "@common/utils/date-util";
import IconCheck from "@components/common/icons/IconCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconLine from "@components/common/icons/IconLine";
import IconLineLong from "@components/common/icons/IconLineLong";
import IconStar from "@components/common/icons/IconStar";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  StakingPeriodType,
  STAKING_PERIOD_INFO,
} from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import { useGetAllTokenPrices } from "@query/token";
import { DEVICE_TYPE } from "@styles/media";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { toUnitFormat } from "@utils/number-utils";

import {
  PriceTooltipContentWrapper,
  StakingContentCardWrapper,
  ToolTipContentWrapper,
  TooltipDivider,
} from "./StakingContentCard.styles";

interface StakingContentCardProps {
  period: StakingPeriodType;
  stakingApr?: string;
  checkPoints: StakingPeriodType[];
  positions: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  loading: boolean;
}
const DAY_TIME = 24 * 60 * 60 * 1000;

const PriceTooltipContent = ({
  positions,
  period,
}: {
  positions: PoolPositionModel[];
  period: number;
}) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  const { data: tokenPrices = {} } = useGetAllTokenPrices();

  const isAnyPriceEmpty = useCallback(
    (position: PoolPositionModel) => {
      const tokenAEmpty =
        !tokenPrices[checkGnotPath(position.pool.tokenA.priceID)].usd;
      const tokenBEmpty =
        !tokenPrices[checkGnotPath(position.pool.tokenB.priceID)].usd;

      return tokenAEmpty || tokenBEmpty;
    },
    [tokenPrices],
  );

  const getRemainTime = useCallback(
    (position: PositionModel) => {
      const stakedTime = new Date(position.stakedAt).getTime();
      const passedTime = new Date().getTime() - stakedTime;
      const remainTime = period * DAY_TIME - passedTime;
      const { day, hours, minutes, seconds } = calculateRemainTime(remainTime);
      return `${day}d ${hours}h ${minutes}m ${seconds}s`;
    },
    [period],
  );

  return (
    <PriceTooltipContentWrapper>
      {positions.map((position, index) => {
        return (
          <React.Fragment key={index}>
            <div className="list list-logo">
              <OverlapTokenLogo
                tokens={[
                  {
                    ...position.pool.tokenA,
                    ...getGnotPath(position.pool.tokenA),
                  },
                  {
                    ...position.pool.tokenB,
                    ...getGnotPath(position.pool.tokenB),
                  },
                ]}
                size={18}
              />
              <span className="title">ID #{position.lpTokenId}</span>
            </div>
            <div className="list">
              <span className="label">
                {t("Pool:staking.period.stakedTooltip.totalValue")}
              </span>
              <span className="content">
                {!isAnyPriceEmpty(position)
                  ? formatOtherPrice(position.usdValue, { hasMinLimit: false })
                  : "-"}
              </span>
            </div>
            <div className="list">
              <span className="label">
                {t("Pool:staking.period.stakedTooltip.stakedDate")}
              </span>
              <span className="content">
                {timeToDateStr(new Date(position.stakedAt).getTime())}
              </span>
            </div>
            <div className="list">
              <span className="label">
                {t("Pool:staking.period.stakedTooltip.nextTier")}
              </span>
              <span className="content">
                {period === -1 ? "-" : `in ${getRemainTime(position)}`}
              </span>
            </div>
            {index < positions.length - 1 && <TooltipDivider />}
          </React.Fragment>
        );
      })}
    </PriceTooltipContentWrapper>
  );
};

const StakingContentCard: React.FC<StakingContentCardProps> = ({
  period,
  checkPoints,
  positions,
  stakingApr,
  breakpoint,
  loading,
}) => {
  const { t } = useTranslation();
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
    let anyEmptyValue = false;

    const usdValue = positions.reduce((accum, current) => {
      if (!current.positionUsdValue) {
        anyEmptyValue = true;
      }

      return Number(current.positionUsdValue) + accum;
    }, 0);

    if (anyEmptyValue) return "-";

    return formatOtherPrice(usdValue);
  }, [positions]);

  const positionRewards = useMemo(() => {
    return positions.flatMap(position => position.reward);
  }, [positions]);

  const totalStakedRewardUSD = useMemo(() => {
    const tempTotalStakedRewardUSD = positionRewards
      .filter(_ => ["EXTERNAL", "INTERNAL"].includes(_.rewardType))
      .reduce((accum, current) => {
        if (current.rewardType !== "INTERNAL") {
          return accum;
        }
        const tokenUSD = tokenPrices[current.rewardToken.priceID]?.usd || 0;
        return Number(current.totalAmount) * Number(tokenUSD) + accum;
      }, 0);
    return toUnitFormat(tempTotalStakedRewardUSD / 10 ** 6, true, true);
  }, [positionRewards, tokenPrices]);

  const aprNumber = useMemo(
    () =>
      stakingApr
        ? BigNumber(stakingApr).multipliedBy(STAKING_PERIOD_INFO[period].rate)
        : null,
    [period, stakingApr],
  );

  const aprStr = useMemo(() => {
    const periodStakingApr = formatRate(aprNumber, { decimals: 0 });

    if (periodStakingApr === "-") return "-";

    return `${periodStakingApr} APR`;
  }, [aprNumber]);

  return (
    <StakingContentCardWrapper nonTotal={!hasPosition}>
      <div className="left">
        <div className="mobile-wrap">
          <div
            className={`check-wrap ${
              !checkedStep ? "check-wrap-not-active" : ""
            }`}
          >
            {checkedStep && <IconCheck />}

            {breakpoint === DEVICE_TYPE.MOBILE ||
            breakpoint === DEVICE_TYPE.TABLET_M ? (
              <div className="check-line-long">
                {checkedStep ? (
                  <IconLineLong />
                ) : (
                  <div className="border-not-active" />
                )}
              </div>
            ) : (
              <div className="check-line">
                {checkedStep ? (
                  <IconLine />
                ) : (
                  <div className="border-not-active" />
                )}
              </div>
            )}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">
              {t("Pool:staking.period.title", {
                days: periodInfo.period,
              })}
            </span>
            <div className="icon-wrap">
              <span className="content-text">
                {t("Pool:staking.period.subtitle", {
                  percent: periodInfo.rate * 100 + "%",
                })}
              </span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    {t("Pool:staking.period.subtitleTooltip", {
                      percent: periodInfo.rate * 100 + "%",
                    })}
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          {loading && (
            <PulseSkeletonWrapper height={36} mobileHeight={24}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "400px",
                  tabletWidth: 300,
                  mobileWidth: 100,
                })}
              />
            </PulseSkeletonWrapper>
          )}
          {!loading && (
            <div className="price">
              <span>
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <div>
                      <PriceTooltipContent
                        positions={positions}
                        period={periodInfo.period}
                      />
                    </div>
                  }
                >
                  <span>{totalUSD}</span>
                  {positions.length > 0 &&
                    checkedStep &&
                    totalStakedRewardUSD !== "$0" &&
                    "+ "}
                  {positions.length > 0 &&
                    checkedStep &&
                    totalStakedRewardUSD !== "$0" && (
                      <span className="price-gd-text">
                        {totalStakedRewardUSD}
                      </span>
                    )}
                  {positions.length > 0 && (
                    <div className="badge">{positions.length} LP</div>
                  )}
                </Tooltip>
              </span>
            </div>
          )}
          {loading && (
            <PulseSkeletonWrapper height={36} mobileHeight={24}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "200px",
                  tabletWidth: 140,
                  mobileWidth: 50,
                })}
              />
            </PulseSkeletonWrapper>
          )}
          {!loading && (
            <div className="apr small-gap">
              {aprNumber?.isGreaterThan(100) && <IconStar />}
              <span className="apr-text">{aprStr}</span>
            </div>
          )}
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

interface SummuryAprProps {
  period: StakingPeriodType;
  checkPoints: StakingPeriodType[];
  positions: PoolPositionModel[];
  stakingApr?: string;
  loading: boolean;
  breakpoint: DEVICE_TYPE;
}

export const SummuryApr: React.FC<SummuryAprProps> = ({
  period,
  checkPoints,
  positions,
  stakingApr,
  loading,
}) => {
  const { t } = useTranslation();
  const { tokenPrices } = useTokenData();

  const hasPosition = positions.length > 0;

  const checkedStep = useMemo(() => {
    return checkPoints.includes(period);
  }, [checkPoints, period]);

  const periodInfo = useMemo(() => {
    return STAKING_PERIOD_INFO[period];
  }, [period]);

  const positionRewards = useMemo(() => {
    return positions.flatMap(position => position.reward);
  }, [positions]);

  const totalUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }

    let anyEmptyValue = false;

    const usdValue = positions.reduce((accum, current) => {
      if (!current.positionUsdValue) anyEmptyValue = true;

      return Number(current.positionUsdValue) + accum;
    }, 0);

    if (anyEmptyValue) return "-";

    return `${toUnitFormat(usdValue, true, true)}`;
  }, [positions]);

  const totalStakedRewardUSD = useMemo(() => {
    const tempTotalStakedRewardUSD = positionRewards.reduce(
      (accum, current) => {
        if (current.rewardType !== "INTERNAL") {
          return accum;
        }
        const tokenUSD = tokenPrices[current.rewardToken.priceID]?.usd || 0;
        return Number(current.totalAmount) * Number(tokenUSD) + accum;
      },
      0,
    );
    return toUnitFormat(tempTotalStakedRewardUSD / 10 ** 6, true, true);
  }, [positionRewards, tokenPrices]);

  const aprNumber = useMemo(
    () =>
      stakingApr
        ? BigNumber(stakingApr).multipliedBy(STAKING_PERIOD_INFO[period].rate)
        : null,
    [period, stakingApr],
  );

  const aprStr = useMemo(() => {
    const periodStakingApr = formatRate(aprNumber, { decimals: 0 });

    if (periodStakingApr === "-") return "-";

    return `${periodStakingApr} APR`;
  }, [aprNumber]);

  return (
    <StakingContentCardWrapper nonTotal={!hasPosition}>
      <div className="left">
        <div className="mobile-wrap">
          <div
            className={`check-wrap ${
              !checkedStep ? "check-wrap-not-active" : ""
            }`}
          >
            {checkedStep && <IconCheck />}
          </div>
          <div className="name-wrap">
            <span className="symbol-text">
              {t("Pool:staking.period.title", {
                context: "max",
                days: periodInfo.period,
              })}
            </span>
            <div className="icon-wrap">
              <span className="content-gd-text">
                {t("Pool:staking.period.subtitle", {
                  context: "max",
                  percent: periodInfo.rate * 100 + "%",
                })}
              </span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    {t("Pool:staking.period.subtitleTooltip", {
                      context: "max",
                      percent: periodInfo.rate * 100 + "%",
                    })}
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo className="tooltip-icon" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="contents-wrap">
        <div className="contents">
          {loading && (
            <PulseSkeletonWrapper height={36} mobileHeight={24}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "400px",
                  tabletWidth: 300,
                  mobileWidth: 100,
                })}
              />
            </PulseSkeletonWrapper>
          )}
          {!loading && (
            <div className="price">
              <span>
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <div>
                      <PriceTooltipContent
                        positions={positions}
                        period={periodInfo.period}
                      />
                    </div>
                  }
                >
                  <span>{totalUSD}</span>
                  {checkedStep &&
                    positions.length > 0 &&
                    totalStakedRewardUSD !== "$0" &&
                    "+ "}
                  {positions.length > 0 &&
                    totalStakedRewardUSD !== "$0" &&
                    checkedStep && (
                      <span className="price-gd-text">
                        {totalStakedRewardUSD}
                      </span>
                    )}
                  {positions.length > 0 && (
                    <div className="badge">{positions.length} LP</div>
                  )}
                </Tooltip>
              </span>
            </div>
          )}
          {loading && (
            <PulseSkeletonWrapper height={36} mobileHeight={24}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "200px",
                  tabletWidth: 140,
                  mobileWidth: 50,
                })}
              />
            </PulseSkeletonWrapper>
          )}
          {!loading && (
            <div className="apr small-gap">
              {aprNumber?.isGreaterThan(100) && <IconStar />}
              <span className="apr-gd-text">{aprStr}</span>
            </div>
          )}
        </div>
      </div>
    </StakingContentCardWrapper>
  );
};

export default StakingContentCard;
