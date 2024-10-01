import { useTranslation } from "react-i18next";

import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import { STATIC_TEXT } from "@common/values";
import { wrapper } from "./MarketInformationList.styles";

export const marketInformationInit = {
  popularity: "",
  lockedTokensUsd: "",
  volumeUsd24h: "",
  feesUsd24h: "",
};

interface MarketInformationListProps {
  list: {
    popularity: string;
    lockedTokensUsd: string;
    volumeUsd24h: string;
    feesUsd24h: string;
  };
  loading: boolean;
}

const MarketInformationList: React.FC<MarketInformationListProps> = ({
  list,
  loading,
}) => {
  const { t } = useTranslation();

  const TITLE_LIST = [
    t("TokenDetails:info.market.col.marketCap"),
    STATIC_TEXT.TVL,
    t("TokenDetails:info.market.col.volume"),
    t("TokenDetails:info.market.col.fee"),
  ];

  return (
    <div css={wrapper}>
      {Object.values(list).map((item: string, idx: number) => (
        <div key={idx} className="marketInfo-wrap">
          <span className="title">{TITLE_LIST[idx]}</span>
          {!loading && <span className="market-info-value">{item}</span>}
          {loading && (
            <span
              className="loading-value"
              css={pulseSkeletonStyle({
                h: "20px",
                w: "100px",
                tabletWidth: "50",
                smallTableWidth: "100",
              })}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MarketInformationList;
