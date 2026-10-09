import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@components/common/button/Button";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import Tooltip from "@components/common/tooltip/Tooltip";
import { StakingPeriodType, STAKING_PERIOS } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useIntersectionObserver } from "@hooks/common/use-interaction-observer";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolStakingSummaryModel } from "@models/pool/pool-staking-summary";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";
import { toUnitFormat } from "@utils/number-utils";
import { getStakingPeriodType } from "@utils/stake-position-utils";
import { getUniqueRewardTokensWithMultipleRewardTypes } from "@utils/token-utils";

import IncentivizeTokenDetailTooltipContent from "./incentivized-token-detail-tooltip-content/IncentivizeTokenDetailTooltipContent";
import StakingContentCard, { SummuryApr } from "./staking-content-card/StakingContentCard";

import { AprNumberContainer, AprStakingHeader, StakingContentWrapper } from "./StakingContent.styles";

interface StakingContentProps {
  totalApr: string;
  stakedPosition: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  type: number;
  loading: boolean;
  pool: PoolDetailModel | null;
  poolStakings: PoolStakingModel[];
  stakingSummary: PoolStakingSummaryModel | null;
  hasPoolStaking: boolean;
}

const TEXT_BTN = [
  "Pool:staking.keepStakingNote.one",
  "Pool:staking.keepStakingNote.two",
  "Pool:staking.keepStakingNote.three",
  "Pool:staking.keepStakingNote.four",
];

const StakingContent: React.FC<StakingContentProps> = ({
  totalApr,
  stakedPosition,
  breakpoint,
  mobile,
  type,
  loading,
  pool,
  poolStakings,
  stakingSummary,
  hasPoolStaking,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const [forcedShowAprGuide, setForceShowAprGuide] = useState(true);
  const { t } = useTranslation();

  const { ref, entry } = useIntersectionObserver();
  const isTargetElementVisible = entry?.isIntersecting === true;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleScroll = debounce(() => {
    setIsVisible(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 500);
  }, 10);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const rewardTokenLogos = useMemo(() => {
    const rewardTokens = pool?.rewardTokens || [];
    return getUniqueRewardTokensWithMultipleRewardTypes(rewardTokens, getGnotPath);
  }, [getGnotPath, pool?.rewardTokens]);

  const stakingPositionMap = useMemo(() => {
    return stakedPosition.reduce<{
      [key in StakingPeriodType]: PoolPositionModel[];
    }>(
      (accum, current) => {
        accum[getStakingPeriodType(current.stakedAt)].push(current);
        return accum;
      },
      {
        "5D": [],
        "15D": [],
        "45D": [],
        MAX: [],
      },
    );
  }, [stakedPosition]);

  const checkPoints = useMemo((): StakingPeriodType[] => {
    let checkPointIndex = -1;
    STAKING_PERIOS.forEach((period, index) => {
      if (stakingPositionMap[period].length > 0) {
        checkPointIndex = index;
      }
    });
    if (checkPointIndex < 0) {
      return [];
    }
    return STAKING_PERIOS.slice(0, checkPointIndex + 1);
  }, [stakingPositionMap]);

  return (
    <StakingContentWrapper ref={ref} isMobile={mobile}>
      <div className="content-header">
        {loading && (
          <PulseSkeletonWrapper height={36} mobileHeight={24}>
            <span css={pulseSkeletonStyle({ h: 22, w: "600px", mobileWidth: 400 })} />
          </PulseSkeletonWrapper>
        )}
        {!loading && <span>{t("Pool:staking.intro")}</span>}
        {!loading && (
          <AprNumberContainer placeholderWidth={document.getElementsByClassName("apr-text")?.[0]?.clientWidth}>
            <AprStakingHeader $isMobile={mobile}>
              <Tooltip
                FloatingContent={<IncentivizeTokenDetailTooltipContent poolStakings={poolStakings} />}
                forcedClose={
                  !pool?.incentivized || pool.rewardTokens.length === 0 || !hasPoolStaking || !isTargetElementVisible
                }
                placement="top"
                className="apr-text"
                scroll
                onChangeOpen={(open: boolean) => setForceShowAprGuide(!open)}
              >
                <Tooltip
                  forcedOpen={
                    hasPoolStaking &&
                    entry?.isIntersecting &&
                    (entry?.boundingClientRect.top || 20) > 20 &&
                    isVisible &&
                    forcedShowAprGuide
                  }
                  forcedClose={!forcedShowAprGuide || !hasPoolStaking || !isTargetElementVisible}
                  placement="top"
                  useBasicZIndex={true}
                  FloatingContent={
                    <span style={{ fontSize: breakpoint === "mobile" ? 14 : 16 }}>
                      {t("Pool:staking.tooltip.hoverGuide")}
                    </span>
                  }
                >
                  <span id={"apr-text"}>{totalApr === "-" ? "-" : `${totalApr} APR`} </span>
                </Tooltip>
              </Tooltip>
              {pool?.incentivized && (
                <div
                  className="coin-info"
                  onMouseEnter={() => setForceShowAprGuide(false)}
                  onMouseLeave={() => setForceShowAprGuide(true)}
                >
                  <OverlapTokenLogo
                    tokens={rewardTokenLogos}
                    size={mobile ? 20 : 36}
                    showRewardType={true}
                    tokenTooltipClassName={"coin-item-logo"}
                  />
                </div>
              )}
            </AprStakingHeader>
          </AprNumberContainer>
        )}
      </div>
      <div className="staking-wrap">
        <div className="staking-header">
          <div className="staking-header-left" />
          <div className="staking-header-columns">
            <span className="my-staking-title">{t("Pool:staking.myStake")}</span>
            <div className="total-staked-title">
              <span>{t("Pool:staking.totalStaked")}</span>
              {stakingSummary && (
                <span>
                  {`${toUnitFormat(stakingSummary.totalStakedUsd, true, true)} · ${t("Pool:staking.positionCount", {
                    count: stakingSummary.totalPositionCount,
                  })}`}
                </span>
              )}
            </div>
            <div className="apr-title" />
          </div>
        </div>
        {STAKING_PERIOS.map((period, index) => {
          const tierSummary = stakingSummary?.tiers.find(tier => tier.period === period);
          return period === "MAX" ? (
            <SummuryApr
              loading={loading}
              key={index}
              stakingApr={pool?.stakingApr}
              period={period}
              positions={stakingPositionMap[period]}
              checkPoints={checkPoints}
              breakpoint={breakpoint}
              tierSummary={tierSummary}
            />
          ) : (
            <StakingContentCard
              key={index}
              stakingApr={pool?.stakingApr}
              period={period}
              positions={stakingPositionMap[period]}
              loading={loading}
              checkPoints={checkPoints}
              tierSummary={tierSummary}
            />
          );
        })}
      </div>
      <div className="button-wrap">
        <div className="empty-content"></div>
        {loading && (
          <div className="loading-wrapper">
            <PulseSkeletonWrapper className="loading-button" height={36} mobileHeight={24}>
              <span
                css={pulseSkeletonStyle({
                  h: 22,
                  w: "400px",
                  mobileWidth: 150,
                })}
              />
            </PulseSkeletonWrapper>
          </div>
        )}
        {!loading && (
          <Button
            text={t(TEXT_BTN[type])}
            style={{
              width: "100%",
              height: `${breakpoint === DEVICE_TYPE.MOBILE ? "49px" : "60px"}`,
              fontType: `${
                breakpoint === DEVICE_TYPE.WEB ? "body7" : breakpoint === DEVICE_TYPE.MOBILE ? "p2" : "body9"
              }`,
              textColor: "text01",
              bgColor: "background01",
              padding: "10px 16px",
              gap: "8px",
            }}
            className={type < 3 ? "change-weight" : "receive-button"}
            onClick={() => {}}
          />
        )}
      </div>
    </StakingContentWrapper>
  );
};

export default StakingContent;
