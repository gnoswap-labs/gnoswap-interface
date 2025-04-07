import React from "react";
import Tooltip from "@components/common/tooltip/Tooltip";
import { numberToFormat } from "@utils/string-utils";
import { ContentWrapper, Flex, FontWeight500, FrontWeight, Label, Title, Wrapper } from "./PointComposition.styles";

const PointComposition = ({
  totalPoint,
  swapPoint,
  positionPoint,
  stakingPoint,
  governancePoint,
  referralPoint,
  isMobile,
}: {
  totalPoint: string;
  swapPoint: string;
  positionPoint: string;
  stakingPoint: string;
  governancePoint: string;
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

  const displayPositionStakingPoint = React.useMemo(() => {
    if (!stakingPoint) return "-";
    return `${numberToFormat(stakingPoint)}`;
  }, [stakingPoint]);

  const displayXGNSPoint = React.useMemo(() => {
    if (!governancePoint) return "-";
    return `${numberToFormat(governancePoint)}`;
  }, [governancePoint]);

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
              <Label>Position Staking</Label>
              <FontWeight500>{displayPositionStakingPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>xGNS Staking</Label>
              <FontWeight500>{displayXGNSPoint}</FontWeight500>
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
