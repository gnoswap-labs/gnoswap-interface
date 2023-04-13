import React from "react";
import { wrapper } from "./TrendingCryptos.styles";

interface TrendingCryptosProps {
  cardList: React.ReactNode;
}

const TrendingCryptos: React.FC<TrendingCryptosProps> = ({ cardList }) => {
  return (
    <div css={wrapper}>
      <h2>Trending Cryptos</h2>
      {cardList}
    </div>
  );
};

export default TrendingCryptos;
