import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import React from "react";
import { wrapper } from "./TrendingCryptoCard.styles";
import Link from "next/link";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeId } from "@utils/common";
interface TrendingCryptoCardProps {
  item: any;
}

const TrendingCryptoCard: React.FC<TrendingCryptoCardProps> = ({ item }) => {
  return (
    <Link href={`/tokens/${makeId(item.path)}`}>
      <div css={wrapper}>
        <div>
          <MissingLogo symbol={item.symbol} url={item.logoURI} className="logo" width={20} mobileWidth={20}/>
          <span className="name">{item.name}</span>
          <span className="symbol">{item.symbol}</span>
        </div>
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
