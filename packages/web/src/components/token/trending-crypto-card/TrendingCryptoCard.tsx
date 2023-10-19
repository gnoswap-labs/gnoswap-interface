import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import React from "react";
import { wrapper } from "./TrendingCryptoCard.styles";
import Link from "next/link";
interface TrendingCryptoCardProps {
  item: any;
}

const TrendingCryptoCard: React.FC<TrendingCryptoCardProps> = ({ item }) => {
  return (
    <Link href={`/tokens/${item.symbol}`}>
      <div css={wrapper}>
        <img src={item.logoURI} alt="logo" />
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
    </Link>
  );
};

export default TrendingCryptoCard;
