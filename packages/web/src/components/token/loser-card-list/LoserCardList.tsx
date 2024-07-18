import { cx } from "@emotion/css";
import React from "react";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import {
  cardStyle,
  loadingWrapper,
  NameSectionWrapper,
} from "@components/token/gainer-and-loser/CardListCommonStyle.styles";
import Link from "next/link";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeTokenRouteUrl } from "@utils/page.utils";

interface LoserCardListProps {
  losers: any[];
  loadingLose: boolean;
}

const LoserCard: React.FC<LoserCardListProps> = ({
  losers = [],
  loadingLose,
}) => {
  return (
    <section css={cardStyle}>
      <h2 className="card-title">Top 3 Losers</h2>
      {loadingLose && (
        <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {!loadingLose && losers.length === 0 && (
        <div css={loadingWrapper}>
          <span>No data</span>
        </div>
      )}
      {!loadingLose &&
        losers.map((loser, idx) => (
          <Link href={makeTokenRouteUrl(loser.path)} key={idx}>
            <div className="card-wrap">
              <NameSectionWrapper>
                <MissingLogo
                  symbol={loser.symbol}
                  url={loser.logoURI}
                  className="logo"
                  width={20}
                  mobileWidth={20}
                />
                <span className="name">{loser.name}</span>
                <span className="symbol">{loser.symbol}</span>
              </NameSectionWrapper>
              <span className="price">{loser.price}</span>
              <span
                className={cx("change", {
                  negative:
                    loser?.change?.status === MATH_NEGATIVE_TYPE.NEGATIVE,
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
