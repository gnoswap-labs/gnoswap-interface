import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { formatLeaderboardPoint } from "@utils/leaderboard-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";

interface PointCompositionProps {
  totalPoint: string;
  swapPoint: string;
  positionPoint: string;
  // Omitted for round leaderboards, which have no separate staking reward points.
  stakingPoint?: string;
  governancePoint: string;
  referralPoint: string;
  // Swap points before the caps and the wallet swap cap, shown for round leaderboards.
  swapRawPoint?: string;
  swapCapPoint?: string;
  isMobile: boolean;
}

const PointComposition = ({
  totalPoint,
  swapPoint,
  positionPoint,
  stakingPoint,
  governancePoint,
  referralPoint,
  swapRawPoint,
  swapCapPoint,
  isMobile,
}: PointCompositionProps) => {
  const { t } = useTranslation();

  const displayPoints = React.useMemo(() => {
    return {
      totalPoint: formatLeaderboardPoint(totalPoint),
      swapPoint: formatLeaderboardPoint(swapPoint),
      positionPoint: formatLeaderboardPoint(positionPoint),
      stakingPoint: stakingPoint === undefined ? undefined : formatLeaderboardPoint(stakingPoint),
      governancePoint: formatLeaderboardPoint(governancePoint),
      referralPoint: formatLeaderboardPoint(referralPoint),
      swapRawPoint: swapRawPoint === undefined ? undefined : formatLeaderboardPoint(swapRawPoint),
      swapCapPoint: swapCapPoint === undefined ? undefined : formatLeaderboardPoint(swapCapPoint),
    };
  }, [totalPoint, swapPoint, positionPoint, stakingPoint, governancePoint, referralPoint, swapRawPoint, swapCapPoint]);

  const pointItems = [
    { label: "Leaderboard:list.column.swap", value: displayPoints.swapPoint },
    { label: "Leaderboard:list.column.swapRaw", value: displayPoints.swapRawPoint },
    { label: "Leaderboard:list.column.swapCap", value: displayPoints.swapCapPoint },
    { label: "Leaderboard:list.column.position", value: displayPoints.positionPoint },
    { label: "Leaderboard:list.column.staking", value: displayPoints.stakingPoint },
    { label: "Leaderboard:list.column.xGNS", value: displayPoints.governancePoint },
    { label: "Leaderboard:list.column.referral", value: displayPoints.referralPoint },
  ].filter((item): item is { label: string; value: string } => item.value !== undefined);

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          {!isMobile && <Title>Point Composition</Title>}
          <ContentWrapper>
            {pointItems.map(item => {
              return (
                <Flex key={item.label}>
                  <Label>{t(item.label)}</Label>
                  <FontWeight500>{item.value}</FontWeight500>
                </Flex>
              );
            })}
          </ContentWrapper>
        </Wrapper>
      }
    >
      <FrontWeight>{displayPoints.totalPoint}</FrontWeight>
    </Tooltip>
  );
};

export default PointComposition;
