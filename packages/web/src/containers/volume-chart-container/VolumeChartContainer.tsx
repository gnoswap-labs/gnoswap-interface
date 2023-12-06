import React, { useCallback, useState, useEffect } from "react";
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
  times: string[];
}

const initialVolumePriceInfo: VolumePriceInfo = {
  amount: "$994,120,000",
  fee: "$12,231",
};
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
function createXAxisDummyDatas(currentTab: CHART_TYPE) {
  const now = Date.now();
  switch (currentTab) {
    case "7D":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setDate(date.getDate() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "1M":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "1Y":
      return Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
    case "ALL":
    default:
      return Array.from({ length: 10 }, (_, index) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 1 * index);
        const monthStr = months[date.getMonth()];
        const dayStr = `${date.getDate()}`.padStart(2, "0");
        const yearStr = date.getFullYear();
    
        return `${monthStr} ${dayStr}, ${yearStr}`;
      }).reverse();
  }
}

function createDummyAmountDatas(volumeChartType: CHART_TYPE) {
  let length = 8;
  if (CHART_TYPE["7D"] === volumeChartType) {
    length = 8;
  }
  if (CHART_TYPE["1M"] === volumeChartType) {
    length = 31;
  }
  if (CHART_TYPE["1Y"] === volumeChartType) {
    length = 91;
  }
  if (CHART_TYPE["ALL"] === volumeChartType) {
    length = 91;
  }
  return Array.from({ length }, (_, index) => {
    const date = new Date();
    date.setHours(date.getHours() - index);
    return {
      amount: `${Math.round(Math.random() * 10000000) + 10000000}`,
      time: date.toString()
    };
  });
}

async function fetchVolumePriceInfo(): Promise<VolumePriceInfo> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve({ amount: "$100,450,000", fee: "$12,232" }),
  );
}

const VolumeChartContainer: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

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
    const datas = createDummyAmountDatas(volumeChartType);

    const chartInfo: VolumeChartInfo = {
      xAxisLabels,
      datas: datas.map(item => item.amount),
      times: datas.map(item => item.time),
    };

    return chartInfo;
  }, [volumeChartType]);

  return (
    <VolumeChart
      volumeChartType={volumeChartType}
      changeVolumeChartType={changeVolumeChartType}
      volumePriceInfo={volumePriceInfo}
      volumeChartInfo={getChartInfo()}
      loading={loading}
    />
  );
};

export default VolumeChartContainer;
