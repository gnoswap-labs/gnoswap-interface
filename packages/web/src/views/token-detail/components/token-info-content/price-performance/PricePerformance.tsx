import { useTranslation } from "react-i18next";

import PricePerformanceList from "./price-performance-list/PricePerformanceList";

import { wrapper } from "./PricePerformance.styles";

interface PricePerformanceProps {
  info: {
    createdAt: string;
    amount: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
    change: {
      status: "NEGATIVE" | "POSITIVE" | "NONE";
      value: string;
    };
  }[];
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
