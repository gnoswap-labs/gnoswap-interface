import PricePerformanceList from "@components/token/price-performance-list/PricePerformanceList";
import { useTranslation } from "react-i18next";
import { wrapper } from "./PricePerformance.styles";

interface PricePerformanceProps {
  info: any;
  loading: boolean;
}

const PricePerformance: React.FC<PricePerformanceProps> = ({
  info,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h2>{t("TokenDetails:info.performance.title")}</h2>
      <PricePerformanceList list={info} loading={loading} />
    </div>
  );
};

export default PricePerformance;
