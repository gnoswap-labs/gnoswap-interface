import { cx } from "@emotion/css";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { TokenChangeInfo } from "@models/token/token-change-info";
import { makeTokenRouteUrl } from "@utils/page.utils";

import {
  cardStyle,
  loadingWrapper,
  NameSectionWrapper
} from "../CardListCommonStyle.styles";

interface GainerCardListProps {
  gainers: TokenChangeInfo[];
  loadingGain: boolean;
}

const GainerCardList: React.FC<GainerCardListProps> = ({
  gainers = [],
  loadingGain,
}) => {
  const { t } = useTranslation();

  return (
    <section css={cardStyle}>
      <h2 className="card-title">{t("TokenDetails:topGainers.title")}</h2>
      {loadingGain && (
        <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {!loadingGain && gainers.length === 0 && (
        <div css={loadingWrapper}>
          <span>No data</span>
        </div>
      )}
      {!loadingGain &&
        gainers.map((gainer, idx) => (
          <Link href={makeTokenRouteUrl(gainer.path)} key={idx}>
            <div className="card-wrap">
              <NameSectionWrapper>
                <MissingLogo
                  symbol={gainer.symbol}
                  url={gainer.logoURI}
                  className="token-image"
                  width={20}
                  mobileWidth={20}
                />
                <span className="name">{gainer.name}</span>
                <span className="symbol">{gainer.symbol}</span>
              </NameSectionWrapper>
              <span className="price">{gainer.price}</span>
              <span
                className={cx("change", {
                  negative:
                    gainer?.change?.status === MATH_NEGATIVE_TYPE.NEGATIVE,
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
