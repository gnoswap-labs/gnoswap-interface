import React, { useMemo } from "react";
import StakingContentCard, {
  SummuryApr,
} from "@components/pool/staking-content-card/StakingContentCard";
import { StakingContentWrapper } from "./StakingContent.styles";
import Button from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";
import { SkeletonEarnDetailWrapper } from "@layouts/pool-layout/PoolLayout.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { STAKING_PERIOS, StakingPeriodType } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

interface StakingContentProps {
  totalApr: string;
  positions: PoolPositionModel[];
  rewardTokens: TokenModel[];
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
  positions,
  rewardTokens,
  breakpoint,
  mobile,
  type,
  loading,
  pool,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const rewardTokenLogos = useMemo(() => {
    const rewardData = pool?.rewardTokens || [];
    console.log("🚀 ~ rewardTokenLogos ~ rewardData:", rewardData);
    const rewardLogo = rewardData?.map(item => getGnotPath(item).logoURI) || [];
    const temp = rewardTokens.map(token => getGnotPath(token).logoURI);
    console.log("🚀 ~ rewardTokenLogos ~ rewardTokens:", rewardTokens);
    return [...new Set([...temp, ...rewardLogo])].filter(item => item).map(item => ({ src: item }));
  }, [rewardTokens, pool]);

  const stakingPositionMap = useMemo(() => {
    return positions.reduce<{
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
  }, [positions]);

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
          <div className="header-wrap">
            <span className="to-mobile">to</span>
            <span className="apr">{totalApr} APR </span>
            <div className="coin-info">
              <OverlapLogo logos={rewardTokenLogos} />
            </div>
          </div>
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
                stakingApr={pool?.stakingApr || "0"}
                rewardTokens={rewardTokens}
                period={period}
                positions={stakingPositionMap[period]}
                checkPoints={checkPoints}
                breakpoint={breakpoint}
              />
            ) : (
              <StakingContentCard
                key={index}
                rewardTokens={rewardTokens}
                stakingApr={pool?.stakingApr || "0"}
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
              fontType: `${breakpoint === DEVICE_TYPE.WEB
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
            onClick={() => { }}
          />
        )}
      </div>
    </StakingContentWrapper>
  );
};

export default StakingContent;
