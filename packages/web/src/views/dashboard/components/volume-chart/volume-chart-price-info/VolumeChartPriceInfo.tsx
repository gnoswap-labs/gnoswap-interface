import React from "react";
import { useTranslation } from "react-i18next";

import {
  FeeInfoWrapper,
  VolumeChartPriceInfoWrapper,
} from "./VolumeChartPriceInfo.styles";

export interface VolumePriceInfo {
  amount: string;
  fee: string;
}

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
