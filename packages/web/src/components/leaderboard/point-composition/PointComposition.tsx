import Tooltip from "@components/common/tooltip/Tooltip";
import {
  ContentWrapper,
  Flex,
  Label,
  Title,
  Wrapper,
} from "./PointComposition.styles";

const PointComposition = ({
  points,
  swapPoint,
  positionPoint,
  stakingPoint,
  referralPoint,
  isMobile,
}: {
  points: string;
  swapPoint: string;
  positionPoint: string;
  stakingPoint: string;
  referralPoint: string;
  isMobile: boolean;
}) => {
  return (
    <Tooltip
      placement="top"
      FloatingContent={
        <Wrapper>
          {!isMobile && <Title>Point Composition</Title>}
          <ContentWrapper>
            <Flex>
              <Label>Swap</Label>
              <div>{swapPoint}</div>
            </Flex>
            <Flex>
              <Label>Position</Label>
              <div>{positionPoint}</div>
            </Flex>
            <Flex>
              <Label>Staking</Label>
              <div>{stakingPoint}</div>
            </Flex>
            <Flex>
              <Label>Referral</Label>
              <div>{referralPoint}</div>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      {points}
    </Tooltip>
  );
};

export default PointComposition;
