import React from "react";
import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { numberToFormat } from "@utils/string-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";
import { removeTrailingZeros } from "@utils/number-utils";

interface PointCompositionProps {
  totalPoint: string;
  swapPoint: string;
  positionPoint: string;
  stakingPoint: string;
  governancePoint: string;
  referralPoint: string;
  isMobile: boolean;
}

const formatPoint = (point: string): string => {
  if (!point) return "-";
  const formattedPoint = numberToFormat(point, { decimals: 2, forceDecimals: true, truncateDecimals: true });
  return removeTrailingZeros(formattedPoint);
};

const PointComposition = ({
  totalPoint,
  swapPoint,
  positionPoint,
  stakingPoint,
  governancePoint,
  referralPoint,
  isMobile,
}: PointCompositionProps) => {
  const { t } = useTranslation();

  const displayPoints = React.useMemo(() => {
    return {
      totalPoint: formatPoint(totalPoint),
      swapPoint: formatPoint(swapPoint),
      positionPoint: formatPoint(positionPoint),
      stakingPoint: formatPoint(stakingPoint),
      governancePoint: formatPoint(governancePoint),
      referralPoint: formatPoint(referralPoint),
    };
  }, [totalPoint, swapPoint, positionPoint, stakingPoint, governancePoint, referralPoint]);

  const pointItems = [
    { label: "Leaderboard:list.column.swap", value: displayPoints.swapPoint },
    { label: "Leaderboard:list.column.position", value: displayPoints.positionPoint },
    { label: "Leaderboard:list.column.staking", value: displayPoints.stakingPoint },
    { label: "Leaderboard:list.column.xGNS", value: displayPoints.governancePoint },
    { label: "Leaderboard:list.column.referral", value: displayPoints.referralPoint },
  ];

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
