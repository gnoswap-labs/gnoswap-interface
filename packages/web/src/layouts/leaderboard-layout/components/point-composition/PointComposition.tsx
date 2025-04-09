import React from "react";
import Tooltip from "@components/common/tooltip/Tooltip";
import { numberToFormat } from "@utils/string-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";

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
  return numberToFormat(point, { decimals: 1, forceDecimals: true });
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
    { label: "Swap", value: displayPoints.swapPoint },
    { label: "Position", value: displayPoints.positionPoint },
    { label: "Position Staking", value: displayPoints.stakingPoint },
    { label: "xGNS Staking", value: displayPoints.governancePoint },
    { label: "Referral", value: displayPoints.referralPoint },
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
                  <Label>{item.label}</Label>
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
