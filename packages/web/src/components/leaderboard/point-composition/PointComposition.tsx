import Tooltip from "@components/common/tooltip/Tooltip";
import {
  ContentWrapper,
  Flex,
  FontWeight500,
  FrontWeight,
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
              <FontWeight500>{swapPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Position</Label>
              <FontWeight500>{positionPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Staking</Label>
              <FontWeight500>{stakingPoint}</FontWeight500>
            </Flex>
            <Flex>
              <Label>Referral</Label>
              <FontWeight500>{referralPoint}</FontWeight500>
            </Flex>
          </ContentWrapper>
        </Wrapper>
      }
    >
      <FrontWeight>{points}</FrontWeight>
    </Tooltip>
  );
};

export default PointComposition;
