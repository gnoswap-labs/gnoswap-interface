import PriceInformationList from "@components/token/price-information-list/PriceInformationList";
import { useTranslation } from "react-i18next";
import { wrapper } from "./PriceInformation.styles";

interface PriceInformationProps {
  info: any;
  loading: boolean;
}

const PriceInformation: React.FC<PriceInformationProps> = ({
  info,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h2>{t("TokenDetails:info.info.title")}</h2>
      <PriceInformationList list={info} loading={loading} />
    </div>
  );
};

export default PriceInformation;
