import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { LeaderboardHoldingDetail } from "@repositories/leaderboard/response/common/types";
import { formatLeaderboardPoint } from "@utils/leaderboard-utils";
import { ContentWrapper, Flex, FontWeight500, Label, Wrapper } from "../point-composition/PointComposition.styles";

interface StakingPointProps {
  positionStakingPoint: string | undefined;
  holdingDetail: LeaderboardHoldingDetail | null | undefined;
}

// Staking points with a hover on the account's currently staked positions.
// Without holding details from the API only the points are shown.
const StakingPoint = ({ positionStakingPoint, holdingDetail }: StakingPointProps) => {
  const { t } = useTranslation();
  const point = formatLeaderboardPoint(positionStakingPoint);

  if (!holdingDetail) {
    return <span>{point}</span>;
  }

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          <ContentWrapper>
            <Flex>
              <Label>{t("Leaderboard:list.column.stakedPositions")}</Label>
              <FontWeight500>
                {holdingDetail.stakedPositionCount} (
                {t("Leaderboard:list.column.inRange", { n: holdingDetail.inRangePositionCount })})
              </FontWeight500>
            </Flex>
            <Flex>
              <Label>{t("Leaderboard:list.column.pointsThisRound")}</Label>
              <FontWeight500>{point}</FontWeight500>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      <span>{point}</span>
    </Tooltip>
  );
};

export default StakingPoint;
