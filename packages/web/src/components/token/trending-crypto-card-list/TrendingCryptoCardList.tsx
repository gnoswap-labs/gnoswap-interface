import React from "react";
import TrendingCryptoCard from "@components/token/trending-crypto-card/TrendingCryptoCard";
import { wrapper } from "./TrendingCryptoCardList.styles";

interface TrendingCryptoCardListProps {
  list: any[];
}

const TrendingCryptoCardList: React.FC<TrendingCryptoCardListProps> = ({
  list,
}) => {
  return (
    <div css={wrapper}>
      {list.map((item, idx) => (
        <TrendingCryptoCard item={item} key={idx} />
      ))}
    </div>
  );
};

export default TrendingCryptoCardList;
