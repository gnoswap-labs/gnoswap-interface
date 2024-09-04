import { useTranslation } from "react-i18next";

import PriceInformationList from "./price-information-list/PriceInformationList";

import { wrapper } from "./PriceInformation.styles";

interface PriceInformationProps {
  info: {
    [key: string]: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
  };
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
