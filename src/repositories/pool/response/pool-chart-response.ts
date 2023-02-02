export interface PoolChartResopnse {
	pool_id: string;
	ticks: Array<Tick>;
}

interface Tick {
	tick: number;
	value: number;
}
