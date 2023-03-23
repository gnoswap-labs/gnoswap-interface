import React from "react";
import { wrapper } from "./IncentivizedPoolCardList.styles";
import { type PoolListProps } from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";
import IncentivizedPoolCard from "@components/earn/incentivized-pool-card/IncentivizedPoolCard";
interface IncentivizedPoolCardListProps {
  list: Array<PoolListProps>;
}

const IncentivizedPoolCardList: React.FC<IncentivizedPoolCardListProps> = ({
  list,
}) => (
  <div css={wrapper}>
    {list.map((item, idx) => (
      <IncentivizedPoolCard item={item} key={idx} />
    ))}
  </div>
);

export default IncentivizedPoolCardList;
