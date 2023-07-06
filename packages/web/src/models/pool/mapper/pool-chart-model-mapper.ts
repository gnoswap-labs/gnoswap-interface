import { PoolChartResponse } from "@repositories/pool";
import { PoolChartModel } from "@models/pool/pool-chart-model";

export class PoolChartModelMapper {
  public static mappedChartTicks(response: PoolChartResponse): PoolChartModel {
    const { current, ticks } = response;
    return {
      current,
      ticks,
    };
  }
}
