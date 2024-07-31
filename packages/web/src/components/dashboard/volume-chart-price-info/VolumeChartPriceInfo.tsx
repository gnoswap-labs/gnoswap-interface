import React from "react";
import { VolumePriceInfo } from "@containers/volume-chart-container/VolumeChartContainer";
import {
  FeeInfoWrapper,
  VolumeChartPriceInfoWrapper,
} from "./VolumeChartPriceInfo.styles";
import { useTranslation } from "react-i18next";
interface VolumeChartPriceInfoProps {
  volumePriceInfo: VolumePriceInfo;
}
const VolumeChartPriceInfo: React.FC<VolumeChartPriceInfoProps> = ({
  volumePriceInfo,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <VolumeChartPriceInfoWrapper>
        <div className="label">{t("Dashboard:totalVolChart.title")}</div>
        <div className="price">{volumePriceInfo.amount}</div>
      </VolumeChartPriceInfoWrapper>
      <FeeInfoWrapper>
        {t("Dashboard:totalVolChart.totalFee")}: {volumePriceInfo.fee}
      </FeeInfoWrapper>
    </>
  );
};

export default VolumeChartPriceInfo;
