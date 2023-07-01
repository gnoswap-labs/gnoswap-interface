export interface PoolChartResponse {
	pool_id: string;
	current: number;
	ticks: Array<Tick>;
}

interface Tick {
	tick: number;
	value: number;
}
