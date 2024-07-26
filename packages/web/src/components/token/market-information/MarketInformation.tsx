import MarketInformationList from "@components/token/market-information-list/MarketInformationList";
import { useTranslation } from "react-i18next";
import { wrapper } from "./MarketInformation.styles";

interface MarketInformationProps {
  info: any;
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
