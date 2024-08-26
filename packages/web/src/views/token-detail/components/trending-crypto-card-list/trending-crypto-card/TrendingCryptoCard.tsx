import { cx } from "@emotion/css";
import Link from "next/link";
import React from "react";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { makeTokenRouteUrl } from "@utils/page.utils";

import { NameSectionWrapper, wrapper } from "./TrendingCryptoCard.styles";

export type TrendingCryptoInfo = {
    path: string;
    symbol: string;
    logoURI: string;
    name: string;
    price: string;
    change: {
      status: MATH_NEGATIVE_TYPE;
      value: string;
    };
  }

interface TrendingCryptoCardProps {
  item: TrendingCryptoInfo;
}

const TrendingCryptoCard: React.FC<TrendingCryptoCardProps> = ({ item }) => {
  return (
    <Link href={makeTokenRouteUrl(item.path)}>
      <div css={wrapper}>
        <NameSectionWrapper>
          <MissingLogo
            symbol={item.symbol}
            url={item.logoURI}
            className="logo"
            width={20}
            mobileWidth={20}
          />
          <span className="name">{item.name}</span>
          <span className="symbol">{item.symbol}</span>
        </NameSectionWrapper>
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
