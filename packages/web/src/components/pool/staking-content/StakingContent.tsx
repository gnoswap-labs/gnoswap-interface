import React, { useCallback, useEffect, useMemo, useState } from "react";
import StakingContentCard, {
  SummuryApr,
} from "@components/pool/staking-content-card/StakingContentCard";
import {
  AprNumberContainer,
  AprStakingHeader,
  NoticeAprToolTip,
  StakingContentWrapper,
} from "./StakingContent.styles";
import Button from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { STAKING_PERIOS, StakingPeriodType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import IncentivizeTokenDetailTooltipContainer from "@containers/incentivize-token-detail-container/IncentivizeTokenDetailTooltipContainer";

interface StakingContentProps {
  totalApr: string;
  stakedPosition: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  type: number;
  loading: boolean;
  pool: PoolDetailModel | null;
}

const TEXT_BTN = [
  "Create your first position to get started ⛵",
  "Stake your position to get started ⛵",
  "Keep staking to receive higher rewards ⌛",
  "Receiving max rewards ✨",
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
}) => {
  const { getGnotPath } = useGnotToGnot();
  const [showAprTooltip, setShowAprTooltip] = useState(false);
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

  const debounce = <Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number,
  ): ((...args: Params) => void) => {
    let timer: NodeJS.Timeout;
    return (...args: Params) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);
    };
  };

  const toggleTooltip = useCallback(
    debounce((state: boolean) => setShowAprTooltip(state), 0),
    [],
  );

  useEffect(() => {
    const fn = () => {
      toggleTooltip(false);

      const top = document
        .getElementById("staking-container")
        ?.getBoundingClientRect().top;

      if (top && top <= 300) {
        toggleTooltip(true);
      }
    };

    window.addEventListener("scroll", fn);

    return () => {
      window.removeEventListener("scroll", fn);
    };
  }, [showAprTooltip, toggleTooltip]);

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

  useEffect(() => {
    let element: EventTarget | null;

    const moutOutAprText = () => toggleTooltip(true);

    const fn: EventListener = e => {
      if (e.target instanceof Element) {
        const isLogoHover = e?.target?.className?.includes?.("coin-item-logo");
        const isHoverAprText = ["apr-text"].includes(e.target.id);

        if (isLogoHover) {
          element?.addEventListener("mouseleave", moutOutAprText);
        }

        if (isHoverAprText || isLogoHover) {
          toggleTooltip(false);
        }
      }
    };

    document
      .getElementById("apr-text")
      ?.addEventListener("mouseleave", moutOutAprText);

    window.addEventListener("mouseover", fn);

    return () => {
      window.removeEventListener("mouseover", fn);
      document
        .getElementById("apr-text")
        ?.removeEventListener("mouseleave", moutOutAprText);
      element?.removeEventListener("mouseleave", moutOutAprText);
    };
  }, [showAprTooltip, toggleTooltip]);

  return (
    <StakingContentWrapper isMobile={mobile}>
      <div className="content-header">
        {loading && (
          <SkeletonEarnDetailWrapper height={36} mobileHeight={24}>
            <span
              css={pulseSkeletonStyle({ h: 22, w: "600px", mobileWidth: 400 })}
            />
          </SkeletonEarnDetailWrapper>
        )}
        {!loading && (
          <span>
            Stake your position to earn rewards up{" "}
            <span className="to-web">to</span>
          </span>
        )}
        {!loading && (
          <AprNumberContainer
            placeholderWidth={
              document.getElementsByClassName("apr-text")?.[0]?.clientWidth
            }
          >
            <Tooltip
              FloatingContent={
                <NoticeAprToolTip>Hover to view details</NoticeAprToolTip>
              }
              placement="top"
              forcedOpen={showAprTooltip}
              isShouldShowed={showAprTooltip}
              className={"float-view-apr"}
            >
              <div className="placeholder"></div>
            </Tooltip>
            <AprStakingHeader $isMobile={mobile}>
              <span className="to-mobile">to</span>
              <Tooltip
                FloatingContent={
                  <IncentivizeTokenDetailTooltipContainer
                    poolPath={pool?.poolPath}
                  />
                }
                placement="top"
                className="apr-text"
              >
                <span id={"apr-text"}>
                  {totalApr === "-" ? "-" : `${totalApr} APR`}{" "}
                </span>
              </Tooltip>
              <div className="coin-info">
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
        <>
          <span>My Staking</span>
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
        </>
      </div>
      <div className="button-wrap">
        <div className="empty-content"></div>
        {loading && (
          <div className="loading-wrapper">
            <SkeletonEarnDetailWrapper
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
            </SkeletonEarnDetailWrapper>
          </div>
        )}
        {!loading && (
          <Button
            text={TEXT_BTN[type]}
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
