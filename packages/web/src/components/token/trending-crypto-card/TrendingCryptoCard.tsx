import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import React from "react";
import { wrapper } from "./TrendingCryptoCard.styles";

interface TrendingCryptoCardProps {
  item: any;
}

const TrendingCryptoCard: React.FC<TrendingCryptoCardProps> = ({ item }) => {
  return (
    <div css={wrapper}>
      <img src={item.tokenLogo} alt="logo" />
      <span className="name">{item.name}</span>
      <span className="symbol">{item.symbol}</span>
      <span className="price">{item.price}</span>
      <span
        className={cx("change", {
          negative: item.change.status === MATH_NEGATIVE_TYPE.NEGATIVE,
        })}
      >
        {item.change.value}
      </span>
    </div>
  );
};

export default TrendingCryptoCard;
