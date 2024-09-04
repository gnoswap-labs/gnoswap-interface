import { useTranslation } from "react-i18next";

import MarketInformationList from "./market-information-list/MarketInformationList";

import { wrapper } from "./MarketInformation.styles";

interface MarketInformationProps {
  info: {
    popularity: string;
    lockedTokensUsd: string;
    volumeUsd24h: string;
    feesUsd24h: string;
  };
  loading: boolean;
}

const MarketInformation: React.FC<MarketInformationProps> = ({
  info,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h2>{<h2>{t("TokenDetails:info.market.title")}</h2>}</h2>
      <MarketInformationList list={info} loading={loading} />
    </div>
  );
};

export default MarketInformation;
