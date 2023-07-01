export interface PoolChartModel {
  current: number;
  ticks: Array<ChartTick>;
}

export interface ChartTick {
  tick: number;
  value: number;
}
