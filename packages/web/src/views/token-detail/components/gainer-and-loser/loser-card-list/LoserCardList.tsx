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
  NameSectionWrapper,
} from "../CardListCommonStyle.styles";

interface LoserCardListProps {
  losers: TokenChangeInfo[];
  loadingLose: boolean;
}

const LoserCard: React.FC<LoserCardListProps> = ({
  losers = [],
  loadingLose,
}) => {
  const { t } = useTranslation();

  return (
    <section css={cardStyle}>
      <h2 className="card-title">{t("TokenDetails:topLosers.title")}</h2>
      {loadingLose && (
        <div css={loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {!loadingLose && losers.length === 0 && (
        <div css={loadingWrapper}>
          <span>{t("common:noData")}</span>
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
