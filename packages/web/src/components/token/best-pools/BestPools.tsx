import { BestPool } from "@containers/best-pools-container/BestPoolsContainer";
import React from "react";
import BestPoolCardList from "@components/token/best-pool-card-list/BestPoolCardList";
import { wrapper } from "./BestPools.styles";

interface BestPoolsProps {
  titleSymbol: string;
  cardList: BestPool[];
}

const BestPools: React.FC<BestPoolsProps> = ({ titleSymbol, cardList }) => {
  return (
    <div css={wrapper}>
      <h2>{`Best Pools for ${titleSymbol}`}</h2>
      <BestPoolCardList list={cardList} />
    </div>
  );
};

export default BestPools;
