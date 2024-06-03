import React from "react";
import { VolumePriceInfo } from "@containers/volume-chart-container/VolumeChartContainer";
import {
  FeeInfoWrapper,
  VolumeChartPriceInfoWrapper,
} from "./VolumeChartPriceInfo.styles";
interface VolumeChartPriceInfoProps {
  volumePriceInfo: VolumePriceInfo;
}
const VolumeChartPriceInfo: React.FC<VolumeChartPriceInfoProps> = ({
  volumePriceInfo,
}) => (
  <>
    <VolumeChartPriceInfoWrapper>
      <div className="label">Total Volume</div>
      <div className="price">{volumePriceInfo.amount}</div>
    </VolumeChartPriceInfoWrapper>
    <FeeInfoWrapper>Total Fees: {volumePriceInfo.fee}</FeeInfoWrapper>
  </>
);

export default VolumeChartPriceInfo;
