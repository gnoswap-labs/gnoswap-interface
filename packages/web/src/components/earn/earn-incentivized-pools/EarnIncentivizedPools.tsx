import { wrapper } from "./EarnIncentivizedPools.styles";

interface EarnIncentivizedPoolsProps {
  cardList: React.ReactNode;
}

const EarnIncentivizedPools: React.FC<EarnIncentivizedPoolsProps> = ({
  cardList,
}) => (
  <div css={wrapper}>
    <h2>Incentivized Pools</h2>
    {cardList}
  </div>
);

export default EarnIncentivizedPools;
