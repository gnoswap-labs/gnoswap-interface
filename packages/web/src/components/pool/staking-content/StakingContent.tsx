import React, { useMemo } from "react";
import StakingContentCard, {
  SummuryApr,
} from "@components/pool/staking-content-card/StakingContentCard";
import {
  StakingContentWrapper,
} from "./StakingContent.styles";
import Button from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { STAKING_PERIOS, StakingPeriodType } from "@constants/option.constant";

interface StakingContentProps {
  totalApr: string;
  positions: PoolPositionModel[];
  rewardTokens: TokenModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  type: number;
}

const TEXT_BTN = [
  "Stake your positions to get started ⛵",
  "Create your first position to get started ⛵",
  "Keep your position staked to get higher rewards ⌛",
  "Receiving Max Rewards ✨",
];

const DAY_TIME = 24 * 60 * 60 * 1000;

const StakingContent: React.FC<StakingContentProps> = ({
  totalApr,
  positions,
  rewardTokens,
  breakpoint,
  mobile,
  type,
}) => {
  const rewardTokenLogos = useMemo(() => {
    return rewardTokens.map(token => token.logoURI);
  }, [rewardTokens]);

  const stakingPositionMap = useMemo(() => {
    return positions.reduce<{ [key in StakingPeriodType]: PoolPositionModel[] }>((accum, current) => {
      const stakedTime = Number(current.stakedAt) * 1000;
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
    }, {
      "5D": [],
      "10D": [],
      "30D": [],
      "MAX": [],
    });
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
        <span>Stake your position to earn rewards up <span className="to-web">to</span></span>
        <div className="header-wrap">
          <span className="to-mobile">to</span>
          <span className="apr">{totalApr} APR </span>
          <div className="coin-info">
            <OverlapLogo logos={rewardTokenLogos} />
          </div>
        </div>
      </div>
      <div className="staking-wrap">
        <>
          <span>My Staking</span>
          {STAKING_PERIOS.map((period, index) => {
            return period === "MAX" ? (
              <SummuryApr
                key={index}
                rewardTokens={rewardTokens}
                period={period}
                positions={stakingPositionMap[period]}
                checkPoints={checkPoints}
              />
            ) : (
              <StakingContentCard
                key={index}
                rewardTokens={rewardTokens}
                period={period}
                positions={stakingPositionMap[period]}
                breakpoint={breakpoint}
                checkPoints={checkPoints}
              />
            );
          })}
        </>
      </div>
      <div className="button-wrap">
        <Button
          text={TEXT_BTN[type]}
          style={{
            width: `${breakpoint === DEVICE_TYPE.WEB
              ? "800px"
              : breakpoint === DEVICE_TYPE.TABLET
                ? "600px"
                : "calc(100% - 32px)"
              }`,
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
      </div>
    </StakingContentWrapper>
  );
};

export default StakingContent;
