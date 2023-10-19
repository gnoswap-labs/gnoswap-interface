import { cx } from "@emotion/css";
import React from "react";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { cardStyle } from "@components/token/gainer-and-loser/CardListCommonStyle.styles";
import Link from "next/link";

interface LoserCardListProps {
  losers: any[];
}

const LoserCard: React.FC<LoserCardListProps> = ({ losers }) => {
  return (
    <section css={cardStyle}>
      <h2 className="card-title">Top 3 Losers</h2>
      {losers.map((loser, idx) => (
        <Link href={`/tokens/${loser.symbol}`} key={idx}>
          <div className="card-wrap">
            <img src={loser?.logoURI} alt="logo" />
            <span className="name">{loser.name}</span>
            <span className="symbol">{loser.symbol}</span>
            <span className="price">{loser.price}</span>
            <span
              className={cx("change", {
                negative: loser?.change?.status === MATH_NEGATIVE_TYPE.NEGATIVE,
              })}
            >
              {loser?.change?.value}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default LoserCard;
