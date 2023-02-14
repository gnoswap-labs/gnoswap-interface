import { PoolChartResopnse } from "@/repositories/pool";
import { PoolChartModel } from "../pool-chart-model";

export class PoolChartModelMapper {
	public static mappedChartTicks(response: PoolChartResopnse): PoolChartModel {
		const { current, ticks } = response;
		return {
			current,
			ticks,
		};
	}
}
