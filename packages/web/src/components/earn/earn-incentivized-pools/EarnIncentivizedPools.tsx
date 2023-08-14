import { PoolsWrapper } from "./EarnIncentivizedPools.styles";

interface EarnIncentivizedPoolsProps {
  cardList: React.ReactNode;
}

const EarnIncentivizedPools: React.FC<EarnIncentivizedPoolsProps> = ({
  cardList,
}) => (
  <PoolsWrapper>
    <h2>Incentivized Pools</h2>
    {cardList}
  </PoolsWrapper>
);

export default EarnIncentivizedPools;
