import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VolumeChart from "@components/dashboard/volume-chart/VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";

export interface VolumePriceInfo {
  amount: string;
  fee: string;
}

const initialVolumePriceInfo: VolumePriceInfo = {
  amount: "$994,120,000",
  fee: "$12,231",
};

async function fetchVolumePriceInfo(): Promise<VolumePriceInfo> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve({ amount: "$100,450,000", fee: "$12,232" }),
  );
}

const VolumeChartContainer: React.FC = () => {
  const [volumeChartType, setVolumeChartType] = useState<CHART_TYPE>(
    CHART_TYPE["7D"],
  );

  const { data: volumePriceInfo } = useQuery<VolumePriceInfo, Error>({
    queryKey: ["volumePriceInfo"],
    queryFn: () => fetchVolumePriceInfo(),
    initialData: initialVolumePriceInfo,
  });

  const changeVolumeChartType = useCallback((newType: string) => {
    const volumeChartType =
      Object.values(CHART_TYPE).find(type => type === newType) ||
      CHART_TYPE["7D"];
    setVolumeChartType(volumeChartType);
  }, []);

  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={volumePriceInfo}
    />
  );
};

export default VolumeChartContainer;
