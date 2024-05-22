import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import React from "react";
import { cx } from "@emotion/css";
import { cardStyle, loadingWrapper } from "@components/token/gainer-and-loser/CardListCommonStyle.styles";
import Link from "next/link";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { makeId } from "@utils/common";

interface GainerCardListProps {
  gainers: any[];
  loadingGain: boolean;
}

const GainerCardList: React.FC<GainerCardListProps> = ({ gainers, loadingGain }) => {
  return (
    <section css={cardStyle}>
      <h2 className="card-title">Top 3 Gainers</h2>
      {loadingGain && <div css={loadingWrapper}>
        <LoadingSpinner />
      </div>}
      {!loadingGain && gainers.length === 0 && <div css={loadingWrapper}>
        <span>No data</span>
      </div>}
      {!loadingGain && gainers.map((gainer, idx) => (
        <Link href={`/tokens/${makeId(gainer.path)}`} key={idx}>
          <div className="card-wrap">
            <div>
              <MissingLogo symbol={gainer.symbol} url={gainer.logoURI} className="token-image" width={20} mobileWidth={20} />
              <span className="name">{gainer.name}</span>
              <span className="symbol">{gainer.symbol}</span>
            </div>
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
