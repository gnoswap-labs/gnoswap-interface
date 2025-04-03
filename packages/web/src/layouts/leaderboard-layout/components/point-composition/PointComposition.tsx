import React from "react";
import Tooltip from "@components/common/tooltip/Tooltip";
import { numberToFormat } from "@utils/string-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";

const PointComposition = ({
  totalPoint,
  swapPoint,
  positionPoint,
  stakingPoint,
  referralPoint,
  isMobile,
}: {
  totalPoint: string;
  swapPoint: string;
  positionPoint: string;
  stakingPoint: string;
  referralPoint: string;
  isMobile: boolean;
}) => {
  const displayTotalPoint = React.useMemo(() => {
    if (!totalPoint) return "-";
    return `${numberToFormat(totalPoint)}`;
  }, [totalPoint]);

  const displaySwapPoint = React.useMemo(() => {
    if (!swapPoint) return "-";
    return `${numberToFormat(swapPoint)}`;
  }, [swapPoint]);

  const displayPositionPoint = React.useMemo(() => {
    if (!positionPoint) return "-";
    return `${numberToFormat(positionPoint)}`;
  }, [positionPoint]);

  const displayStakingPoint = React.useMemo(() => {
    if (!stakingPoint) return "-";
    return `${numberToFormat(stakingPoint)}`;
  }, [stakingPoint]);

  const displayReferralPoint = React.useMemo(() => {
    if (!referralPoint) return "-";
    return `${numberToFormat(referralPoint)}`;
  }, [referralPoint]);

  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          {!isMobile && <Title>Point Composition</Title>}
          <ContentWrapper>
            <Flex>
              <Label>Swap</Label>
              <FontWeight500>{displaySwapPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Position</Label>
              <FontWeight500>{displayPositionPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Staking</Label>
              <FontWeight500>{displayStakingPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Referral</Label>
              <FontWeight500>{displayReferralPoint}</FontWeight500>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      <FrontWeight>{displayTotalPoint}</FrontWeight>
    </Tooltip>
  );
};

export default PointComposition;
