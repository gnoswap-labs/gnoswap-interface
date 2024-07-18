import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cx } from "@emotion/css";
import React from "react";
import { NameSectionWrapper, wrapper } from "./TrendingCryptoCard.styles";
import Link from "next/link";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeTokenRouteUrl } from "@utils/page.utils";
interface TrendingCryptoCardProps {
  item: any;
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
