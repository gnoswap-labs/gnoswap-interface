import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@components/common/button/Button";
import IconPolygon from "@components/common/icons/IconPolygon";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { PulseSkeletonWrapper } from "@components/common/pulse-skeleton/PulseSkeletonWrapper.style";
import Tooltip from "@components/common/tooltip/Tooltip";
import { StakingPeriodType, STAKING_PERIOS } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useIntersectionObserver } from "@hooks/common/use-interaction-observer";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { themeKey } from "@states/theme";
import { DEVICE_TYPE } from "@styles/media";

import IncentivizeTokenDetailTooltipContent from "./incentivized-token-detail-tooltip-content/IncentivizeTokenDetailTooltipContent";
import StakingContentCard, {
  SummuryApr,
} from "./staking-content-card/StakingContentCard";

import {
  AprNumberContainer,
  AprStakingHeader,
  NoticeAprToolTip,
  StakingContentWrapper,
} from "./StakingContent.styles";

interface StakingContentProps {
  totalApr: string;
  stakedPosition: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  type: number;
  loading: boolean;
  pool: PoolDetailModel | null;
  poolStakings: PoolStakingModel[];
}

const TEXT_BTN = [
  "Pool:staking.keepStakingNote.one",
  "Pool:staking.keepStakingNote.two",
  "Pool:staking.keepStakingNote.three",
  "Pool:staking.keepStakingNote.four",
];

const DAY_TIME = 24 * 60 * 60 * 1000;

const StakingContent: React.FC<StakingContentProps> = ({
  totalApr,
  stakedPosition,
  breakpoint,
  mobile,
  type,
  loading,
  pool,
  poolStakings,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const [forceShowAprGuide, setForceShowAprGuide] = useState(true);
  const { t } = useTranslation();

  const { ref, entry } = useIntersectionObserver();

  const rewardTokenLogos = useMemo(() => {
    const rewardData = pool?.rewardTokens || [];
    const rewardLogo =
      rewardData?.map(item => ({
        ...item,
        logoURI: getGnotPath(item).logoURI,
        symbol: getGnotPath(item).symbol,
        path: getGnotPath(item).path,
        name: getGnotPath(item).name,
      })) || [];

    return [...rewardLogo].reduce((acc: TokenModel[], current) => {
      if (!acc.find(item => item.logoURI === current.logoURI)) {
        acc.push(current);
      }

      return acc;
    }, []) as TokenModel[];
  }, [pool?.rewardTokens, getGnotPath]);

  const stakingPositionMap = useMemo(() => {
    return stakedPosition.reduce<{
      [key in StakingPeriodType]: PoolPositionModel[];
    }>(
      (accum, current) => {
        const stakedTime = new Date(current.stakedAt).getTime();
        const difference = (new Date().getTime() - stakedTime) / DAY_TIME;
        let periodType: StakingPeriodType = "MAX";
        if (difference < 5) {
          periodType = "5D";
        } else if (difference < 10) {
          periodType = "10D";
        } else if (difference < 30) {
          periodType = "30D";
        }
        accum[periodType].push(current);
        return accum;
      },
      {
        "5D": [],
        "10D": [],
        "30D": [],
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
            <span
              css={pulseSkeletonStyle({ h: 22, w: "600px", mobileWidth: 400 })}
            />
          </PulseSkeletonWrapper>
        )}
        {!loading && <span>{t("Pool:staking.intro")}</span>}
        {!loading && (
          <AprNumberContainer
            placeholderWidth={
              document.getElementsByClassName("apr-text")?.[0]?.clientWidth
            }
          >
            <div className="placeholder">
              {entry?.isIntersecting &&
                (entry?.boundingClientRect.top || 20) > 20 &&
                forceShowAprGuide && (
                  <NoticeAprToolTip>
                    <div className={`box ${themeKey}-shadow`}>
                      <span>{t("Pool:staking.tooltip.hoverGuide")}</span>
                    </div>
                    <IconPolygon className="polygon-icon" />
                  </NoticeAprToolTip>
                )}
            </div>
            <AprStakingHeader $isMobile={mobile}>
              <Tooltip
                FloatingContent={
                  <IncentivizeTokenDetailTooltipContent
                    poolStakings={poolStakings}
                  />
                }
                placement="top"
                className="apr-text"
                scroll
                onChangeOpen={(open: boolean) => setForceShowAprGuide(!open)}
              >
                <span id={"apr-text"}>
                  {totalApr === "-" ? "-" : `${totalApr} APR`}{" "}
                </span>
              </Tooltip>
              <div
                className="coin-info"
                onMouseEnter={() => setForceShowAprGuide(false)}
                onMouseLeave={() => setForceShowAprGuide(true)}
              >
                <OverlapTokenLogo
                  tokens={rewardTokenLogos}
                  size={mobile ? 20 : 36}
                  tokenTooltipClassName={"coin-item-logo"}
                />
              </div>
            </AprStakingHeader>
          </AprNumberContainer>
        )}
      </div>
      <div className="staking-wrap">
        <span>{t("Pool:staking.myStake")}</span>
        {STAKING_PERIOS.map((period, index) => {
          return period === "MAX" ? (
            <SummuryApr
              loading={loading}
              key={index}
              stakingApr={pool?.stakingApr}
              period={period}
              positions={stakingPositionMap[period]}
              checkPoints={checkPoints}
              breakpoint={breakpoint}
            />
          ) : (
            <StakingContentCard
              key={index}
              stakingApr={pool?.stakingApr}
              period={period}
              positions={stakingPositionMap[period]}
              breakpoint={breakpoint}
              loading={loading}
              checkPoints={checkPoints}
            />
          );
        })}
      </div>
      <div className="button-wrap">
        <div className="empty-content"></div>
        {loading && (
          <div className="loading-wrapper">
            <PulseSkeletonWrapper
              className="loading-button"
              height={36}
              mobileHeight={24}
            >
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
                breakpoint === DEVICE_TYPE.WEB
                  ? "body7"
                  : breakpoint === DEVICE_TYPE.MOBILE
                  ? "p2"
                  : "body9"
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
