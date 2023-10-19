import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import React from "react";
import { cx } from "@emotion/css";
import { cardStyle } from "@components/token/gainer-and-loser/CardListCommonStyle.styles";
import Link from "next/link";

interface GainerCardListProps {
  gainers: any[];
}

const GainerCardList: React.FC<GainerCardListProps> = ({ gainers }) => {
  return (
    <section css={cardStyle}>
      <h2 className="card-title">Top 3 Gainers</h2>
      {gainers.map((gainer, idx) => (
        <Link href={`/tokens/${gainer.symbol}`} key={idx}>
          <div className="card-wrap">
            <img src={gainer?.logoURI} alt="logo" />
            <span className="name">{gainer.name}</span>
            <span className="symbol">{gainer.symbol}</span>
            <span className="price">{gainer.price}</span>
            <span
              className={cx("change", {
                negative: gainer?.change?.status === MATH_NEGATIVE_TYPE.NEGATIVE,
              })}
            >
              {gainer?.change?.value}
            </span>
          </div>
        </Link>
        ))}
    </section>
  );
};

export default GainerCardList;
