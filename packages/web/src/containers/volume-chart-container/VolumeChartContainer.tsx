import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VolumeChart from "@components/dashboard/volume-chart/VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";

export interface VolumePriceInfo {
  amount: string;
  fee: string;
}

export interface VolumeChartInfo {
  datas: string[];
  xAxisLabels: string[];
}

const initialVolumePriceInfo: VolumePriceInfo = {
  amount: "$994,120,000",
  fee: "$12,231",
};

function createXAxisDummyDatas(currentTab: CHART_TYPE) {
  const now = Date.now();
  switch (currentTab) {
    case "7D":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() - 1 * index);
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        const dateStr = `${date.getDate()}`.padStart(2, "0");
        return `${monthStr}-${dateStr}`;
      }).reverse();
    case "1M":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const yearStr = date.getFullYear();
        const monthStr = `${date.getMonth() + 1}`.padStart(2, "0");
        return `${yearStr}-${monthStr}`;
      }).reverse();
    case "1Y":
    case "ALL":
    default:
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const yearStr = date.getFullYear();
        return `${yearStr}`;
      }).reverse();
  }
}

function createDummyAmountDatas() {
  const length = 24;
  return Array.from({ length }, () => `${Math.round(Math.random() * 50) + 1}`);
}

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

  const getChartInfo = useCallback(() => {
    const xAxisLabels = createXAxisDummyDatas(volumeChartType);
    const datas = createDummyAmountDatas();

    const chartInfo: VolumeChartInfo = {
      xAxisLabels,
      datas: datas,
    };

    return chartInfo;
  }, [volumeChartType]);

  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={volumePriceInfo}
      volumeChartInfo={getChartInfo()}
    />
  );
};

export default VolumeChartContainer;
